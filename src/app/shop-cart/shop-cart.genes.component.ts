import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenesShopCart from './shop-cart-genes.selector';
import { Entities } from '../core/common/entities';
import * as MistAction from '../core/common/mist-actions';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'shop-cart-genes',
    templateUrl: './shop-cart.genes.pug',
  })
export class ShopCartGenesComponent extends MistComponent {
    static readonly genesColumns: string[] = ["Select", "Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];
    
    @Input()
    thisEntitySelected = false;

    constructor(store: Store<any>, private cookieService: CookieService) {
        super(store, fromGenesShopCart, ShopCartGenesComponent.genesColumns, Entities.GENES, true);
        this.sendQuery();
    }

    initialyzeFilter() {
        return null;
    }
    
    sendQuery() {
        let cookie = this.getCookie();
        if (cookie) {
            this.getByIdList(cookie);
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

}