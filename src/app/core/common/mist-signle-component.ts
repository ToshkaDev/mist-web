import { Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AbstractCart } from './abstract-cart';
import { CartChangedService } from '../../shop-cart/cart-changed.service';

export abstract class MistSingleComponent extends AbstractCart  {
    @Input() entity$: Observable<any>;
    private entityId: string; 
    readonly cartRemove = {"add": false, "remove": true, "download": false};
    readonly cartAdd = {"add": true, "remove": false, "download": false};

    constructor(private cartChangedService: CartChangedService, private listEntity: string)  {
        super();
    }

    ngOnInit() {
        this.entity$.subscribe(element => {
            element ? this.entityId = element.id + "" : this.entityId = null;
            this.updateButtons();
        })
    }

    addToCart(): void {
        if (this.cartChangedService.webStorageItemIsSet(this.listEntity)) {
            let currentShopCartItems: Set<string> = new Set(this.cartChangedService.getWebStorageItem(this.listEntity));
            currentShopCartItems.add(this.entityId)
            let shopCartQnt = currentShopCartItems.size;     
            if (shopCartQnt > this.cartMaxQuantity) {
                alert("You can't add more thant " + this.cartMaxQuantity + " items in the cart.")
            }
            else {
                this.cartChangedService.setWebStorageItem(this.listEntity, Array.from(currentShopCartItems).join());
                this.updateButtons();
                this.cartChangedService.notifyOfChange();
            }
        } else {
            this.cartChangedService.setWebStorageItem(this.listEntity, this.entityId);
            this.updateButtons();
            this.cartChangedService.notifyOfChange();
        }
    }

    removeFromCart(): void {     
        if (this.cartChangedService.webStorageItemIsSet(this.listEntity)) {
            let idsToDeletFrom = new Set(this.cartChangedService.getWebStorageItem(this.listEntity));
            let oldIdsToDeletFrom = new Set(this.cartChangedService.getWebStorageItem(this.listEntity));

            idsToDeletFrom.delete(this.entityId);

            if (idsToDeletFrom && idsToDeletFrom.size != 0 && idsToDeletFrom.size < oldIdsToDeletFrom.size) {
                this.cartChangedService.setWebStorageItem(this.listEntity, Array.from(idsToDeletFrom).join());
                this.updateButtons();
                this.cartChangedService.notifyOfChange();
            } else if (idsToDeletFrom && idsToDeletFrom.size == 0) {
                this.cartChangedService.removeWebStorageItem(this.listEntity);
                this.updateButtons();
                this.cartChangedService.notifyOfChange();
            } else {
                console.log("Error in removeFromCart()");
            }      
        }
    }

    private updateButtons() {
        let currentCartItems: Set<string> = new Set(this.cartChangedService.getWebStorageItem(this.listEntity));
        if (currentCartItems.has(this.entityId))
            this.cart = this.cartRemove;
        else
            this.cart = this.cartAdd;
    }

}