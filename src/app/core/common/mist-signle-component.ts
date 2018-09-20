import { Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';

import { AbstractCart } from './abstract-cart';
import { CookieChangedService } from '../../shop-cart/cookie-changed.service';

export abstract class MistSingleComponent extends AbstractCart  {
    @Input() entity$: Observable<any>;
    private entityId: string; 
    readonly cartRemove = {"add": false, "remove": true, "download": false};
    readonly cartAdd = {"add": true, "remove": false, "download": false};

    constructor(private cookieService: CookieService, private cookieChangedService: CookieChangedService, private listEntity: string)  {
        super();
    }

    ngOnInit() {
        this.entity$.subscribe(element => {
            element ? this.entityId = element.id + "" : this.entityId = null;
            this.updateButtons();
        })
    }

    addToCart(): void {
        if (this.cookieChangedService.cookieIsSet(this.listEntity)) {
            let currentCookie: Set<string> = new Set(this.cookieChangedService.getCookie(this.listEntity));
            currentCookie.add(this.entityId)
            let cookieQnt = currentCookie.size;     
            if (cookieQnt > this.cookieMaxQuantity) {
                window.alert("You can't add more thant " + this.cookieMaxQuantity + " in the cart.")
            }
            else {
                this.cookieService.set(`${this.cookiePrefix}${this.listEntity}`, Array.from(currentCookie).join(), this.cookieLifeDays);
                this.updateButtons();
                this.cookieChangedService.notifyOfChange();
            }
        } else {
            this.cookieService.set(`${this.cookiePrefix}${this.listEntity}`, this.entityId, this.cookieLifeDays);
            this.updateButtons();
            this.cookieChangedService.notifyOfChange();
        }
    }

    removeFromCart(): void {     
        if (this.cookieChangedService.cookieIsSet(this.listEntity)) {
            let idsToDeletFrom = new Set(this.cookieChangedService.getCookie(this.listEntity));
            let oldIdsToDeletFrom = new Set(this.cookieChangedService.getCookie(this.listEntity));

            idsToDeletFrom.delete(this.entityId);

            if (idsToDeletFrom && idsToDeletFrom.size != 0 && idsToDeletFrom.size < oldIdsToDeletFrom.size) {
                this.cookieService.set(`${this.cookiePrefix}${this.listEntity}`, Array.from(idsToDeletFrom).join());
                this.updateButtons();
                this.cookieChangedService.notifyOfChange();
            } else if (idsToDeletFrom && idsToDeletFrom.size == 0) {
                this.cookieService.delete(`${this.cookiePrefix}${this.listEntity}`);
                this.updateButtons();
                this.cookieChangedService.notifyOfChange();
            } else {
                console.log("Error in removeFromCart()");
            }      
        }
    }

    private updateButtons() {
        let currentCookie: Set<string> = new Set(this.cookieChangedService.getCookie(this.listEntity));
        if (currentCookie.has(this.entityId))
            this.cart = this.cartRemove;
        else
            this.cart = this.cartAdd;
    }

}