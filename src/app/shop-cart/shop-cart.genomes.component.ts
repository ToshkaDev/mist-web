import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenomes from '../genomes/genomes.selectors';
import { Entities } from '../core/common/entities';
import { GetByIdList } from '../genomes/genomes.actions';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'shop-cart-genomes',
    styleUrls: ['./shop-cart.genomes.scss'],
    templateUrl: './shop-cart.genomes.pug',
  })
  export class ShopCartGenomesComponent extends MistComponent {
    static readonly genomesColumns = ['Select', 'Genome', 'Taxonomy', 'Genbank Version', 'Assembly level'];

    constructor(store: Store<any>, private cookieService: CookieService) {
        super(store, fromGenomes, ShopCartGenomesComponent.genomesColumns, Entities.GENOMES, true);
        this.sendQuery();
    }

    initialyzeFilter() {
        return null;
    }
      
    sendQuery() {
        this.cookieService.set('mist-genomesIds', '1,2,3,4,5,6,7,8,9');
        let cookieValue = this.cookieService.get('mist-genomesIds');
        this.getByIdList(cookieValue) ;
    }
    
    getByIdList(query: string) {
        super.getStore().dispatch(new GetByIdList({
          search: query, 
          perPage: this.perPage, 
          pageIndex: this.defaultCurrentPage
        }));
    }

  }