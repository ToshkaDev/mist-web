import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';

import GenesFilter from './genes.filter';
import { MistComponent } from '../core/common/mist-component';
import * as fromGenes from './genes.selectors';
import { Entities } from '../core/common/entities';
import * as MistAction from '../core/common/mist-actions';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'mist-genes',
    templateUrl: './genes.pug',
  })
export class GenesComponent extends MistComponent {
  static readonly genesColumns: string[] = ["Select", "Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];
  private genesFilter: GenesFilter = new GenesFilter(); 

  constructor(store: Store<any>) {
    super(store, fromGenes, GenesComponent.genesColumns, Entities.GENES);
  }

  search(query: string, scope: string) {
    super.getStore().dispatch(new MistAction.Search(MistAction.SEARCH_GENES, {
      search: query,
      scope: scope, 
      perPage: this.perPage, 
      pageIndex: this.defaultCurrentPage, 
      filter: {}
    }));
  }

  sendQuery() {
    let scope, searchterm;
    this.query$.subscribe(currentSearchterm => searchterm = currentSearchterm).unsubscribe();
    this.scope$.subscribe(currentScope => scope = currentScope).unsubscribe();
    this.search(searchterm, scope);
  }

  checkQuery() {
    let filter: GenesFilter;
    this.query$.subscribe(searchterm => {
      if (searchterm && searchterm.length >= this.minQueryLenght) {
        filter = Object.assign(new GenesFilter(), this.genesFilter)
      } else {
          filter = Object.assign(new GenesFilter(), this.genesFilter.reset());
      }
    }).unsubscribe();
    return filter;
  }
}