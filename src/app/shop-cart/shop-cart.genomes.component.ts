import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenomes from '../genomes/genomes.selectors';
import { Entities } from '../core/common/entities';
import { GetByIdList } from '../genomes/genomes.actions';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'shop-cart-genomes',
    templateUrl: './shop-cart.genomes.pug',
  })
  export class ShopCartGenomesComponent extends MistComponent {
    static readonly genomesColumns = ['Select', 'Genome', 'Taxonomy', 'Genbank Version', 'Assembly level'];
    @Input()
    thisEntitySelected = false;

    constructor(store: Store<any>, private cookieService: CookieService) {
        super(store, fromGenomes, ShopCartGenomesComponent.genomesColumns, Entities.GENOMES, true);
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
        super.getStore().dispatch(new GetByIdList({
            search: query, 
            perPage: this.perPage, 
            pageIndex: this.defaultCurrentPage
        }));
    }

  }