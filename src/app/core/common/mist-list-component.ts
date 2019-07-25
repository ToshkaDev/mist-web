import { Input, OnChanges } from '@angular/core';
import { CartChangedService } from '../../shop-cart/cart-changed.service';

import MistDataSource from './mist.datasource';
import { saveAs } from 'file-saver';
import { Entities } from './entities';
import {AbstractCart } from './abstract-cart';


export abstract class MistListComponent extends AbstractCart implements OnChanges {
    @Input() displayedColumns: string[];  
    @Input() result: MistDataSource;
    idsForShopCart: Set<string> = new Set();
    idsForShopCartArray:  string[] = [];
    idToIsDisabled: any = {};
    idToIsChecked: any = {};
    shopCartIdToIsChecked: any = {};
    checked: string = null;
    readonly fileNamePrefix= "MIST3_";
    isIndeterminate: boolean = false;
    resultsNumber: number;
    checkedAll: boolean = false;
    
    constructor(private cartChangedService: CartChangedService, private entity: string, private isShopCart: boolean = false)  {
        super(isShopCart);
    }

    ngOnChanges() {
        this.result.connect().subscribe(entitiesList => {
            // need to empty shop-cart collections and update checkboxes states
            this.idsForShopCartArray = [];
            this.idsForShopCart.clear();
            this.updateInderteminateStateAndCheckAll();
            if (entitiesList && entitiesList.length > 0) {
                this.resultsNumber = entitiesList.length; 
                entitiesList.forEach(entity => {
                    // We need to control differently checkboxes in the shopping cart and when we're displaying the data.
                    // Id-wise checkbox control in shooping cart needed to avoid selection of thouse items which were not displayed 
                    // after deleting all the currently displaed items
                    const geneId = entity.Gene ? entity.Gene.id : entity.id;
                    if (!this.isShopCart) {
                        this.idToIsDisabled[geneId+""] = false;
                        this.idToIsChecked[geneId+""] = null;
                    } else {
                        this.shopCartIdToIsChecked[geneId+""] = null;
                    }
                }); 
            }
            if (this.cartChangedService.webStorageItemIsSet(this.entity)) {
                this.updateDisabledCheckboxes(new Set(this.cartChangedService.getWebStorageItem(this.entity)));
            }
        });
    }
    
    shopCartChanged(message) {
        this.cartChangedService.notify(message);
    }

    onAllCheckBoxChanged(event: any) {
        event.checked ? this.selectAll() : this.unselectAll();
        this.result.connect().subscribe(entitiesList => {
            if (entitiesList && entitiesList.length)
                this.checkBoxesChanged(event, entitiesList);
        });
    }

    selectAll(): void {
        if (!this.isShopCart) {
            for (let id in this.idToIsChecked) {
                this.idToIsChecked[id] = 'checked';
            }
        } else {
            for (let id in this.shopCartIdToIsChecked) {
                this.shopCartIdToIsChecked[id] = 'checked';
            }
        }
    }

    unselectAll(): void {
        if (!this.isShopCart) {
            for (let id in this.idToIsChecked) {
                !this.idToIsDisabled[id] ? this.idToIsChecked[id] = null : null;
            }
        } else {
            for (let id in this.shopCartIdToIsChecked) {
                this.shopCartIdToIsChecked[id] = null;
            }
        }
    }

    checkBoxChanged(event: any, entityId: number): void {
        let element = entityId+"";
        if (event.checked) {
            if (!this.idsForShopCart.has(element)) 
                this.idsForShopCartArray.push(element);
            this.idsForShopCart.add(element);
        } else {
            let elementIndex = this.idsForShopCartArray.indexOf(element);
            this.idsForShopCartArray.splice(elementIndex, 1);
            this.idsForShopCart.delete(element);
        }
        this.updateInderteminateStateAndCheckAll();
    }

    updateInderteminateStateAndCheckAll() {
        if (this.idsForShopCartArray.length === 0) {
            this.isIndeterminate = false;
            this.checkedAll = false;
        } 
        else if (this.idsForShopCartArray.length !== this.resultsNumber) {
            this.isIndeterminate = true;
            this.checkedAll = false;
        }
        else {
            this.isIndeterminate = false;
            this.checkedAll = true;
            // we need to fill in this.idToIsChecked json object
            this.selectAll();
        }
    }

    checkBoxesChanged(event: any, entitiesList: any[]): void {
        entitiesList.forEach(entity => {
            const geneId = entity.Gene ? entity.Gene.id : entity.id;
            this.checkBoxChanged(event, geneId);   
        });
    }

    union(set1, set2) { 
        let unionSet: Set<string> = new Set();
        set1.forEach(elem => unionSet.add(elem));
        set2.forEach(elem => unionSet.add(elem));
        return unionSet;
    }

    addToCart(): void {
        if (this.cartChangedService.webStorageItemIsSet(this.entity)) {
            let currentCartItems: Set<string> = new Set(this.cartChangedService.getWebStorageItem(this.entity));
            let unionCartItems = this.union(currentCartItems, this.idsForShopCart);
            let itemsQnt = unionCartItems.size;     
            if (itemsQnt > this.cartMaxQuantity) {
                let toRemoveFrom = this.idsForShopCartArray.length - (itemsQnt - this.cartMaxQuantity);
                this.idsForShopCartArray.splice(toRemoveFrom);
                this.idsForShopCart = new Set(this.idsForShopCartArray);
                unionCartItems = this.union(currentCartItems, this.idsForShopCart);
                alert("You can't add more thant " + this.cartMaxQuantity + " items in the cart.")
            }
            if (unionCartItems.size > currentCartItems.size) {
                this.cartChangedService.setWebStorageItem(this.entity, Array.from(unionCartItems).join());
                this.cartChangedService.notifyOfChange();
            }
            
        } else {
            this.cartChangedService.setWebStorageItem(this.entity, Array.from(this.idsForShopCart).join());
            this.cartChangedService.notifyOfChange();
        }
        this.updateDisabledCheckboxes(this.idsForShopCart);
    }

    updateDisabledCheckboxes(cartItemsSet: Set<string>) {
        cartItemsSet.forEach(itemId => {
            this.idToIsDisabled[itemId] = true;
            this.idToIsChecked[itemId] = 'checked'; 
        });
    }

    removeFromCart(): void {     
        if (this.cartChangedService.webStorageItemIsSet(this.entity)) {    
            let idsToDeletFrom = new Set(this.cartChangedService.getWebStorageItem(this.entity));
            // Additional guard against unnecessary requests to server
            let oldIdsToDeletFrom = new Set(this.cartChangedService.getWebStorageItem(this.entity));
            this.idsForShopCart.forEach(element => {
                idsToDeletFrom.delete(element);
            });
            if (idsToDeletFrom && idsToDeletFrom.size != 0 && idsToDeletFrom.size < oldIdsToDeletFrom.size) {
                this.cartChangedService.setWebStorageItem(this.entity, Array.from(idsToDeletFrom).join());
                this.shopCartChanged(`${this.entity}|cart is changed`);
                this.cartChangedService.notifyOfChange();
            } else if (idsToDeletFrom && idsToDeletFrom.size == 0) {
                this.cartChangedService.removeWebStorageItem(this.entity);
                this.shopCartChanged(`${this.entity}|cart is deleted`);
                this.cartChangedService.notifyOfChange();
            } else {
                console.log("Error in removeFromCart()")
            }      
        }
    }

    downloadFromCart() {
        let mistFile = "", geneId, geneLocus, geneVersion, geneProduct, geneOrganism, proteinSequence;
        this.result.connect().subscribe(itemsList => {
            if (this.entity == Entities.GENES) {
                itemsList.forEach(item => {
                    // download only selected elements
                    if (this.idsForShopCart.has(item.id+"")) {
                        geneId = item.stable_id ? `${item.stable_id}|` : '';
                        geneLocus = item.locus ? `${item.locus}|` : '';
                        geneVersion = item.version ? `${item.version}|` : '';
                        geneProduct = item.product ? item.product : '';
                        geneOrganism = item.Component && item.Component.definition 
                            ? item.Component.definition.split(',')[0].split('Contig')[0].split('chromosome')[0].trim()
                            : '';
                        proteinSequence = item.Aseq && item.Aseq.sequence ? item.Aseq.sequence : '';
                        mistFile = `${mistFile}>${geneVersion}${geneLocus}${geneId} ${geneProduct} [${geneOrganism}]\n`;
                        mistFile = mistFile + `${proteinSequence}\n`;
                    }

                });
            }
        }).unsubscribe();

        let file = new File([mistFile], `${this.fileNamePrefix}${this.entity}`, {type: "text/plain;charset=utf-8"});
        saveAs(file);
    }
}