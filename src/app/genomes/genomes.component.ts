import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

import { Search } from './genomes.actions';
import * as fromGenomes from './genomes.selectors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes',
  styleUrls: [],
  templateUrl: './genomes.pug',
})
export class GenomesComponent implements OnInit {
  query$: Observable<string>;
  isFetching$: Observable<boolean>;
  errorMessage$: Observable<string>;
  genomes$: Observable<any[]>;

  constructor(
    private store: Store<any>,
  ) {}

  ngOnInit() {
    this.query$ = this.store.select(fromGenomes.getSearchQuery);
    this.isFetching$ = this.store.select(fromGenomes.getSearchIsFetching);
    this.errorMessage$ = this.store.select(fromGenomes.getSearchErrorMessage);
    this.genomes$ = this.store.select(fromGenomes.getSearchResults);
  }

  search(query: string) {
    console.log('Searching for', query);
    this.store.dispatch(new Search(query));
  }
}
