import { Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CookieChangedService } from '../../shop-cart/cookie-changed.service';
import MistDataSource from './mist.datasource';
import { saveAs } from 'file-saver';
import { Entities } from './entities';

export abstract class MistListComponent implements OnChanges {
    @Input() displayedColumns: string[];  
    @Input() result: MistDataSource;
    @Output() cookieEvent = new EventEmitter<any>();
    idsForShopCart: Set<string> = new Set();
    idToIsDisabled: any = {};
    idToIsChecked: any = {};
    shopCartIdToIsChecked: any = {};
    checked: string = null;
    readonly fileNamePrefix= "MIST3_";
    readonly cookiePrefix = "mist_Database-";
    
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
            if (this.cookieIsSet()) {
                this.updateDisabledCheckboxes(new Set(this.getCookie().split(',')));
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
        event.checked ? this.idsForShopCart.add(entityId+"") : this.idsForShopCart.delete(entityId+"");
    }

    checkBoxesChanged(event: any, entitiesList: any[]): void {
        event.checked 
            ? entitiesList.forEach(entity => this.idsForShopCart.add(entity.id+"")) 
            : entitiesList.forEach(entity => this.idsForShopCart.delete(entity.id+""));
    }

    union(set1, set2) { 
        let unionSet: Set<string> = new Set();
        set1.forEach(elem => unionSet.add(elem));
        set2.forEach(elem => unionSet.add(elem));
        return unionSet;
    }

    addToCart(): void {
        if (this.cookieIsSet()) {
            let currentCookie: Set<string> = new Set(this.getCookie().split(","));
            let unionCookie = this.union(currentCookie, this.idsForShopCart);
            this.cookieService.set(`${this.cookiePrefix}${this.entity}`, Array.from(unionCookie).join());
        } else {
            this.cookieService.set(`${this.cookiePrefix}${this.entity}`, Array.from(this.idsForShopCart).join());
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
        if (this.cookieIsSet()) {
            let idsToDeletFrom = new Set(this.getCookie().split(','));
            // Additional guard against unnecessary requests to server
            let oldIdsToDeletFrom = new Set(this.getCookie().split(','));
            this.idsForShopCart.forEach(element => {
                idsToDeletFrom.delete(element);
            });
            if (idsToDeletFrom && idsToDeletFrom.size != 0 && idsToDeletFrom.size < oldIdsToDeletFrom.size) {
                this.cookieService.set(`${this.cookiePrefix}${this.entity}`, Array.from(idsToDeletFrom).join());
                this.cookieChanged(`${this.entity}|cookie is changed`);
            } else if (idsToDeletFrom && idsToDeletFrom.size == 0) {
                this.cookieService.delete(`${this.cookiePrefix}${this.entity}`);
                this.cookieChanged(`${this.entity}|cookie is deleted`);
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

    cookieIsSet(): boolean {
        return this.cookieService.check(`${this.cookiePrefix}${this.entity}`);
    }

    getCookie(): string {
        return this.cookieService.get(`${this.cookiePrefix}${this.entity}`);
    }

}