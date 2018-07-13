import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenomesShopCart from './shop-cart-genomes.selectors';
import { Entities } from '../core/common/entities';
import * as MistAction from '../core/common/mist-actions';
import { CookieChangedService } from './cookie-changed.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'shop-cart-genomes',
    templateUrl: './shop-cart.genomes.pug',
  })
  export class ShopCartGenomesComponent extends MistComponent {
    static readonly genomesColumns = ['Select', 'Genome', 'Taxonomy', 'Genbank Version', 'Assembly level'];
    readonly zeroResultCookieQuery = "-1";
    @Input()
    thisEntitySelected;
    

    constructor(store: Store<any>, private cookieService: CookieService, private cookieChangedService: CookieChangedService) {
        super(store, fromGenomesShopCart, ShopCartGenomesComponent.genomesColumns, Entities.GENOMES, true);
        this.cookieChangedService.cookieChanged$.subscribe(message => this.sendQuery());
        this.sendQuery();
    }

    initialyzeFilter() {
        return null;
    }
        
    sendQuery() {
        console.log("sending query ")
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
        super.getStore().dispatch(new MistAction.GetByIdList(MistAction.GETBY_ID_LIST_GENOMES_SHOPCART, {
            search: query, 
            perPage: this.perPage, 
            pageIndex: this.defaultCurrentPage
        }));
    }

    onCookieChanged() {
        this.sendQuery();
    }
    

  }