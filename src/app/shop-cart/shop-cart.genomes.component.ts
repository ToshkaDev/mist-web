import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenomesShopCart from './shop-cart-genomes.selectors';
import { Entities } from '../core/common/entities';
import * as MistAction from '../core/common/mist-actions';
import { CartChangedService } from './cart-changed.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'shop-cart-genomes',
    templateUrl: './shop-cart.genomes.pug',
  })
  export class ShopCartGenomesComponent extends MistComponent {
    static readonly genomesColumns = ['Select', 'Genome', 'Taxonomy ID', 'Taxonomy', 'Version', 'Assembly level'];
    readonly zeroResultShopCartQuery = "-1";
    static readonly baseEntity: string = Entities.GENOMES;
    @Input()
    thisEntitySelected;
    
    constructor(store: Store<any>, private cartChangedService: CartChangedService) {
        super(store, fromGenomesShopCart, ShopCartGenomesComponent.genomesColumns, Entities.GENOMES_SHOPCART, true);
        this.cartChangedService.cartChanged$.subscribe(() => this.sendQuery());
        this.sendQuery();
    }

    sendQuery() {
        let shopCartItems = this.cartChangedService.webStorageItemIsSet(ShopCartGenomesComponent.baseEntity)
            ? this.cartChangedService.getWebStorageItem(ShopCartGenomesComponent.baseEntity).join(',')
            : null;
        if (shopCartItems) {
            this.getByIdList(shopCartItems);
        } else {
            this.getByIdList(this.zeroResultShopCartQuery);
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