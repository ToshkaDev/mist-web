import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import {DataSource} from '@angular/cdk/collections';
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
  dataSource = new GenomeDataSource(this.store);
  columns = ['Genome', 'Superkingdom', 'Phylum', 'Assembly level'];
  displayedColumns: String[];
  
  constructor(
    private store: Store<any>,
  ) {}

  ngOnInit() {
    this.query$ = this.store.select(fromGenomes.getSearchQuery);
    this.isFetching$ = this.store.select(fromGenomes.getSearchIsFetching);
    this.errorMessage$ = this.store.select(fromGenomes.getSearchErrorMessage);
    this.genomes$ = this.store.select(fromGenomes.getSearchResults);
    this.genomes$.subscribe(results => results.length > 0 ? this.displayedColumns = this.columns : this.displayedColumns = null);
  }

  search(query: string) {
    this.store.dispatch(new Search(query));   
  }
}

export class GenomeDataSource extends DataSource<any> {
  constructor(private store: Store<any>) {
    super();
  }
  connect(): Observable<any[]> {
    return this.store.select(fromGenomes.getSearchResults);
  }
  disconnect() {}
}
