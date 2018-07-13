import { Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { CookieService } from 'ngx-cookie-service';
import { CookieChangedService } from '../../shop-cart/cookie-changed.service';

export abstract class MistListComponent {
    @Input() displayedColumns: string[];  
    @Input() result: DataSource<any>;
    @Output() cookieEvent = new EventEmitter<any>();
    idsForShopCart: Set<string> = new Set();
    checked: string = null;
    
    constructor(private cookieService: CookieService, private cookieChangedService: CookieChangedService, private entity: string) {
    }
    
    cookieChanged2() {
        this.cookieChangedService.notify("cookie changed");
    }

    cookieChanged() {
        this.cookieEvent.emit();
    }

    onSelectClickEvent(event: any): void {
        switch(event) { 
            case 'selectAll': {
                this.selectAll(); 
                break; 
            } 
            case 'unselectAll': { 
                this.unselectAll(); 
                break; 
            } 
            case 'addToCart': {
                this.addToCart();
                break; 
            }
            case 'removeFromCart': {
                this.removeFromCart();
                break; 
            } 
            default: { 
                console.log("Something went wrong in onSelectClickEvent(event)"); 
                break; 
            } 
        } 
    }

    selectAll(): void {
        this.checked = 'checked';
    }

    unselectAll(): void {
        this.checked = null;
    }

    checkBoxChanged(event: any, entityId: number): void {
        event.checked ? this.idsForShopCart.add(entityId+"") : this.idsForShopCart.delete(entityId+"");
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
            this.cookieService.set(`mist_Database-${this.entity}`, Array.from(unionCookie).join());
        } else {
            this.cookieService.set(`mist_Database-${this.entity}`, Array.from(this.idsForShopCart).join());
        }
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
                console.log("here 1 " + idsToDeletFrom)
                this.cookieService.set(`mist_Database-${this.entity}`, Array.from(idsToDeletFrom).join());
                this.cookieChanged();
            } else if (idsToDeletFrom && idsToDeletFrom.size == 0) {
                console.log("here 2 " + idsToDeletFrom)
                this.cookieService.delete(`mist_Database-${this.entity}`);
                this.cookieChanged();
            } else {
                console.log("Error in removeFromCart()")
            }      
        }
    }

    cookieIsSet(): boolean {
        return this.cookieService.check(`mist_Database-${this.entity}`);
    }

    getCookie(): string {
        return this.cookieService.get(`mist_Database-${this.entity}`);
    }

}