import { Misc } from './misc-enum';

export abstract class AbstractCart  {
    readonly cookiePrefix = Misc.COOKIE_PREFIX;
    readonly cookieLifeDays = 30;  
    readonly cookieMaxQuantity = 160;
    readonly shopCartIndicators = {"add": false, "remove": true, "download": true}; 
    cart: any = {"add": true, "remove": false, "download": false};

    constructor(isShopCart = null) {
        if (isShopCart) 
            this.cart = this.shopCartIndicators;
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
                console.log("Something went wrong in onAddRemoveClickEvent(event)"); 
                break; 
            } 
        } 
    }

    abstract addToCart(): void;

    abstract removeFromCart(): void;

    downloadFromCart(): void {};

}