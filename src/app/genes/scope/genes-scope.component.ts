import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/from';

import * as fromScope from './scope.selectors';
import { Entities } from '../../core/common/entities';
import * as MistAction from '../../core/common/mist-actions';
import { MistComponent } from '../../core/common/mist-component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'mist-genes-scope',
    styleUrls: ['./genes-scope.scss'],
    templateUrl: './genes-scope.pug',
  })
export class GenesScopeComponent extends MistComponent {

  static readonly genomesColumns = ['Genome', 'Assembly level'];

  constructor(store: Store<any>) {
    super(store, fromScope, GenesScopeComponent.genomesColumns, Entities.SCOPE);
  } 

  search(query: string, scope: string) {
    super.getStore().dispatch(new MistAction.Search(MistAction.SEARCH_SCOPE, {
      search: query,
      scope: null, 
      perPage: this.perPage, 
      pageIndex: this.defaultCurrentPage, 
      filter: null
    }));
  }

  sendQuery() {
    let scope, searchterm;
    this.query$.subscribe(currentSearchterm => searchterm = currentSearchterm).unsubscribe();
    this.scope$.subscribe(currentScope => scope = currentScope).unsubscribe();
    this.search(searchterm, scope);
  }

}