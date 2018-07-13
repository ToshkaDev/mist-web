import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenesShopCart from './shop-cart-genes.selector';
import { Entities } from '../core/common/entities';
import * as MistAction from '../core/common/mist-actions';
import { CookieChangedService } from './cookie-changed.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'shop-cart-genes',
    templateUrl: './shop-cart.genes.pug',
  })
export class ShopCartGenesComponent extends MistComponent {
    static readonly genesColumns: string[] = ["Select", "Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];
    readonly zeroResultCookieQuery = "-1";
    @Input()
    thisEntitySelected;

    constructor(store: Store<any>, private cookieService: CookieService, private cookieChangedService: CookieChangedService) {
        super(store, fromGenesShopCart, ShopCartGenesComponent.genesColumns, Entities.GENES, true);
        this.cookieChangedService.cookieChanged$.subscribe(message => this.sendQuery());
        this.sendQuery();
    }

    initialyzeFilter() {
        return null;
    }
    
    sendQuery() {
        let cookie = this.getCookie();
        if (cookie) {
            this.getByIdList(cookie);
        } else {
            this.getByIdList(this.zeroResultCookieQuery);
        }
    }

    getCookie(): string {
        if (this.cookieService.check(`mist_Database-${super.getEntityName()}`)) {
            return this.cookieService.get(`mist_Database-${super.getEntityName()}`);
        }
        return null;
    }

    getByIdList(query: string) {
        super.getStore().dispatch(new MistAction.GetByIdList(MistAction.GETBY_ID_LIST_GENES_SHOPCART, {
            search: query, 
            perPage: this.perPage, 
            pageIndex: this.defaultCurrentPage
        }));
    }

    onCookieChanged() {
        this.sendQuery();
    }

}