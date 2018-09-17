import { Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CookieChangedService } from '../../shop-cart/cookie-changed.service';
import MistDataSource from './mist.datasource';
import { saveAs } from 'file-saver';
import { Entities } from './entities';
import { Misc } from './misc-enum';


export abstract class MistListComponent implements OnChanges {
    @Input() displayedColumns: string[];  
    @Input() result: MistDataSource;
    @Output() cookieEvent = new EventEmitter<any>();
    idsForShopCart: Set<string> = new Set();
    idsForShopCartArray:  string[] = [];
    idToIsDisabled: any = {};
    idToIsChecked: any = {};
    shopCartIdToIsChecked: any = {};
    checked: string = null;
    readonly fileNamePrefix= "MIST3_";
    readonly cookiePrefix = Misc.COOKIE_PREFIX;
    readonly cookieLifeDays = 30;  
    readonly cookieMaxQuantity = 160;
    
    constructor(private cookieService: CookieService, private cookieChangedService: CookieChangedService, private entity: string, private isShopCart: boolean = false)  {
    }

    ngOnChanges() {
        this.result.connect().subscribe(entitiesList => { 
            if (entitiesList && entitiesList.length > 0) {
                entitiesList.forEach(entity => {
                    // We need to control differently checkboxes in the shopping cart and when we're displaying the data.
                    // Id-wise checkbox control in shooping cart needed to avoid selection of thouse items which were not displayed 
                    // after deleting all the currently displaed items 
                    if (!this.isShopCart) {
                        this.idToIsDisabled[entity.id+""] = false;
                        this.idToIsChecked[entity.id+""] = null;
                    } else {
                        this.shopCartIdToIsChecked[entity.id+""] = null;
                    }
                }); 
            }
            if (this.cookieChangedService.cookieIsSet(this.entity)) {
                this.updateDisabledCheckboxes(new Set(this.cookieChangedService.getCookie(this.entity)));
            }
        });
    }
    
    cookieChanged(message) {
        this.cookieChangedService.notify(message);
    }

    onAllCheckBoxChanged(event: any) {
        event.checked ? this.selectAll() : this.unselectAll();
        this.result.connect().subscribe(entitiesList => this.checkBoxesChanged(event, entitiesList));
    }

    onAddRemoveClickEvent(event: any): void {
        switch(event) {
            case 'addToCart': {
                this.addToCart();
                break; 
            }
            case 'removeFromCart': {
                this.removeFromCart();
                break; 
            }
            case 'downloadFromCart': {
                this.downloadFromCart();
                break; 
            } 
            default: { 
                console.log("Something went wrong in onSelectClickEvent(event)"); 
                break; 
            } 
        } 
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
        if (event.checked ) {
            if (!this.idsForShopCart.has(element)) 
                this.idsForShopCartArray.push(element);
            this.idsForShopCart.add(element);
        } else {
            let elementIndex = this.idsForShopCartArray.indexOf(element);
            this.idsForShopCartArray.splice(elementIndex, 1);
            this.idsForShopCart.delete(element);
        }
    }

    checkBoxesChanged(event: any, entitiesList: any[]): void {
        entitiesList.forEach(entity => this.checkBoxChanged(event, entity.id));
    }

    union(set1, set2) { 
        let unionSet: Set<string> = new Set();
        set1.forEach(elem => unionSet.add(elem));
        set2.forEach(elem => unionSet.add(elem));
        return unionSet;
    }

    addToCart(): void {
        if (this.cookieChangedService.cookieIsSet(this.entity)) {
            let currentCookie: Set<string> = new Set(this.cookieChangedService.getCookie(this.entity));
            let unionCookie = this.union(currentCookie, this.idsForShopCart);
            let cookieQnt = unionCookie.size;     
            if (cookieQnt > this.cookieMaxQuantity) {
                let toRemoveFrom = this.idsForShopCartArray.length - (cookieQnt - this.cookieMaxQuantity);
                this.idsForShopCartArray.splice(toRemoveFrom);
                this.idsForShopCart = new Set(this.idsForShopCartArray);
                unionCookie = this.union(currentCookie, this.idsForShopCart);
            }
            if (unionCookie.size > currentCookie.size) {
                this.cookieService.set(`${this.cookiePrefix}${this.entity}`, Array.from(unionCookie).join(), this.cookieLifeDays);
                this.cookieChangedService.notifyOfChange();
            }
            
        } else {
            this.cookieService.set(`${this.cookiePrefix}${this.entity}`, Array.from(this.idsForShopCart).join(), this.cookieLifeDays);
            this.cookieChangedService.notifyOfChange();
        }
        this.updateDisabledCheckboxes(this.idsForShopCart);
    }

    updateDisabledCheckboxes(cookieSet: Set<string>) {
        cookieSet.forEach(cookieId => {
            this.idToIsDisabled[cookieId] = true;
            this.idToIsChecked[cookieId] = 'checked'; 
        });
    }

    removeFromCart(): void {     
        if (this.cookieChangedService.cookieIsSet(this.entity)) {
            let idsToDeletFrom = new Set(this.cookieChangedService.getCookie(this.entity));
            // Additional guard against unnecessary requests to server
            let oldIdsToDeletFrom = new Set(this.cookieChangedService.getCookie(this.entity));
            this.idsForShopCart.forEach(element => {
                idsToDeletFrom.delete(element);
            });
            if (idsToDeletFrom && idsToDeletFrom.size != 0 && idsToDeletFrom.size < oldIdsToDeletFrom.size) {
                this.cookieService.set(`${this.cookiePrefix}${this.entity}`, Array.from(idsToDeletFrom).join());
                this.cookieChanged(`${this.entity}|cookie is changed`);
                this.cookieChangedService.notifyOfChange();
            } else if (idsToDeletFrom && idsToDeletFrom.size == 0) {
                this.cookieService.delete(`${this.cookiePrefix}${this.entity}`);
                this.cookieChanged(`${this.entity}|cookie is deleted`);
                this.cookieChangedService.notifyOfChange();
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
                        mistFile = `${mistFile}>${geneId}${geneLocus}${geneVersion} ${geneProduct} [${geneOrganism}]\n`;
                        mistFile = mistFile + `${proteinSequence}\n`;
                    }

                });
            }
        }).unsubscribe();

        let file = new File([mistFile], `${this.fileNamePrefix}${this.entity}`, {type: "text/plain;charset=utf-8"});
        saveAs(file);
    }
}