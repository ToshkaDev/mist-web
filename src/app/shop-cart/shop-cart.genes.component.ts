import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenes from '../genes/genes.selectors';
import { Entities } from '../core/common/entities';
import { GetByIdList } from '../genes/genes.actions';

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
        super(store, fromGenes, ShopCartGenesComponent.genesColumns, Entities.GENES, true);
        this.sendQuery();
    }

    initialyzeFilter() {
        return null;
    }
    
    sendQuery() {
        let cookie = this.getCookie();
        console.log("cookie " + cookie)
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
        super.getStore().dispatch(new GetByIdList({
            search: query, 
            perPage: this.perPage, 
            pageIndex: this.defaultCurrentPage
        }));
    }

}