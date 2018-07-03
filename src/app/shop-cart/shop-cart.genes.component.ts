import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { MistComponent } from '../core/common/mist-component';
import * as fromGenes from '../genes/genes.selectors';
import { Entities } from '../core/common/entities';
import { GetByIdList } from '../genes/genes.actions';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'shop-cart-genes',
    styleUrls: ['./shop-cart.genes.scss'],
    templateUrl: './shop-cart.genes.pug',
  })
export class ShopCartGenesComponent extends MistComponent {
  static readonly genesColumns: string[] = ["Select", "Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];


  constructor(store: Store<any>, private cookieService: CookieService) {
      super(store, fromGenes, ShopCartGenesComponent.genesColumns, Entities.GENES, true);
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