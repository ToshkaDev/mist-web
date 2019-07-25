import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenesShopCart from './shop-cart-genes.selectors';
import { Entities } from '../core/common/entities';
import * as MistAction from '../core/common/mist-actions';
import { CartChangedService } from './cart-changed.service';
import { ToggleChangedService } from '../core/components/protein-feature-toggle/toggle-changed.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'shop-cart-genes',
    templateUrl: './shop-cart.genes.pug',
  })
export class ShopCartGenesComponent extends MistComponent {
    static readonly genesColumns: string[] = ["Select", "Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];
    readonly zeroResultShopCartQuery = "-1";
    static readonly baseEntity: string = Entities.GENES;
    @Input()
    thisEntitySelected;
    private isLcrChecked = false;
    private isCoiledCoilsChecked = false;

    constructor(store: Store<any>, private cartChangedService: CartChangedService, private toggleChanegsService: ToggleChangedService) {
        super(store, fromGenesShopCart, ShopCartGenesComponent.genesColumns, Entities.GENES_SHOPCART, true);
        this.cartChangedService.cartChanged$.subscribe(() => this.sendQuery());
        this.toggleChanegsService.lcrChanged$.subscribe(isChecked => this.isLcrChecked = isChecked);
        this.toggleChanegsService.coiledCoilsChanged$.subscribe(isChecked => this.isCoiledCoilsChecked = isChecked);
        this.sendQuery();
    }

    sendQuery() {
        let shopCartItems = this.cartChangedService.webStorageItemIsSet(ShopCartGenesComponent.baseEntity)
            ? this.cartChangedService.getWebStorageItem(ShopCartGenesComponent.baseEntity).join(',')
            : null;
        if (shopCartItems) {
            this.getByIdList(shopCartItems);
        } else {
            this.getByIdList(this.zeroResultShopCartQuery);
        }
    }

    getByIdList(query: string) {
        super.getStore().dispatch(new MistAction.GetByIdList(MistAction.GETBY_ID_LIST_GENES_SHOPCART, {
            search: query,
            perPage: this.perPage, 
            pageIndex: this.defaultCurrentPage
        }));
    }
}