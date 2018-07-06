import { Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { CookieService } from 'ngx-cookie-service';

export abstract class MistListComponent {
    @Input() displayedColumns: String[];  
    @Input() result: DataSource<any>;
    idsForShopCart: Set<string> = new Set();
    checked: string = null;
    
    constructor(private cookieService: CookieService, private entity: string) {
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

    checkBoxChanged(event: any, entityId: string): void {
        console.log("cookie before " + this.cookieService.get(`mist_Database-${this.entity}`))
        //this.removeFromCart();
        console.log("cookie after " + this.cookieService.get(`mist_Database-${this.entity}`))
        event.checked ? this.idsForShopCart.add(entityId) : this.idsForShopCart.delete(entityId);
    }

    union(set1, set2) { 
        let unionSet = new Set();
        for (let elem of set1) {
            console.log("elem " + elem)
            unionSet.add(elem);
        }
        for (let elem of set2) {
            console.log("elem 2 " + elem)
            unionSet.add(elem);
        }
        return unionSet;
    }

    addToCart(): void {
        if (this.cookieIsSet()) {
            let currentCookie = new Set(this.getCookie().split(","));
            console.log("this.getCookie() " + this.getCookie()) 
            console.log("this.idsForShopCart " + Array.from(this.idsForShopCart)) 
            let unionCookie = this.union(currentCookie, this.idsForShopCart);
            console.log("unionCookie " + Array.from(unionCookie)) 
            this.cookieService.set(`mist_Database-${this.entity}`, Array.from(unionCookie).join());
        } else {
            this.cookieService.set(`mist_Database-${this.entity}`, Array.from(this.idsForShopCart).join());
        }
    }

    removeFromCart(): void {        
        if (this.cookieIsSet()) {
            let idsToDeletFrom = new Set(this.getCookie().split(','));
            this.idsForShopCart.forEach(element => {
                console.log("element " + element)
                idsToDeletFrom.delete(element);
            });
            this.cookieService.set(`mist_Database-${this.entity}`, Array.from(idsToDeletFrom).join());
        }
    }

    cookieIsSet(): boolean {
        return this.cookieService.check(`mist_Database-${this.entity}`);
    }

    getCookie(): string {
        console.log("cookie " + this.cookieService.get(`mist_Database-${this.entity}`))
        return this.cookieService.get(`mist_Database-${this.entity}`);
    }

}