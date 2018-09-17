import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenomesShopCart from './shop-cart-genomes.selectors';
import { Entities } from '../core/common/entities';
import { Misc } from '../core/common/misc-enum';
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
    static readonly baseEntity: string = Entities.GENOMES;
    @Input()
    thisEntitySelected;
    
    constructor(store: Store<any>, private cookieService: CookieService, private cookieChangedService: CookieChangedService) {
        super(store, fromGenomesShopCart, ShopCartGenomesComponent.genomesColumns, Entities.GENOMES_SHOPCART, true);
        this.cookieChangedService.cookieChanged$.subscribe(message => this.sendQuery());
        this.sendQuery();
    }

    initialyzeFilter() {
        return null;
    }
        
    sendQuery() {
        let cookie = this.cookieChangedService.cookieIsSet(ShopCartGenomesComponent.baseEntity)
            ? this.cookieChangedService.getCookie(ShopCartGenomesComponent.baseEntity).join(',')
            : null;
        if (cookie) {
            this.getByIdList(cookie);
        } else {
            this.getByIdList(this.zeroResultCookieQuery);
        }
    }

    getByIdList(query: string) {
        super.getStore().dispatch(new MistAction.GetByIdList(MistAction.GETBY_ID_LIST_GENOMES_SHOPCART, {
            search: query, 
            scope: null,
            perPage: this.perPage, 
            pageIndex: this.defaultCurrentPage
        }));
    }

  }