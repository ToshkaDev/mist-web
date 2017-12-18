import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import {DataSource} from '@angular/cdk/collections';
import { Search, FirstPage, LastPage, PrevPage, NextPage } from './genomes.actions';
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
  links$: Observable<any>;
  count: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  dataSource = new GenomeDataSource(this.store);
  columns = ['Select', 'Genome', 'Superkingdom', 'Taxonomy', 'Genbank Version', 'Assembly level'];

  // asemblyFilter = [{'val':'complete', 'viewVal' : 'Complete genome'}, 
  // {'val':'chromosom', 'viewVal' : 'Chromosom'},
  // {'val':'scaffold', 'viewVal' : 'Scaffold'}, 
  // {'val':'contig', 'viewVal' : 'Contig'}];
  
  displayedColumns: String[];
  
  constructor(
    private store: Store<any>,
  ) {}

  ngOnInit() {
    this.query$ = this.store.select(fromGenomes.getSearchQuery);
    this.isFetching$ = this.store.select(fromGenomes.getSearchIsFetching);
    this.errorMessage$ = this.store.select(fromGenomes.getSearchErrorMessage);
    this.genomes$ = this.store.select(fromGenomes.getSearchResults);
    this.links$ = this.store.select(fromGenomes.getPageLinks);
    this.store.select(fromGenomes.getPageInfo).subscribe(
      pageInfo => {
        pageInfo.count ? this.count = pageInfo.count : this.count = 1;
        pageInfo.currentPage ? this.currentPage = pageInfo.currentPage : this.currentPage = 1;
        pageInfo.totalPages ? this.totalPages = pageInfo.totalPages : this.totalPages = 5;
        pageInfo.perPage ? this.perPage = pageInfo.perPage: this.perPage = 10;
      }
    );
    this.genomes$.subscribe(results => results.length > 0 ? this.displayedColumns = this.columns : this.displayedColumns = null);
  }

  pageApply($event) {
    let eventPageIndex = ++$event.pageIndex;
    if ($event.pageSize != this.perPage) {
      this.perPage = $event.pageSize;
      this.query$.subscribe(val => this.search(val,1)).unsubscribe();
    } else if (eventPageIndex > this.currentPage) {
      this.links$.subscribe(link => this.store.dispatch(new NextPage(link.next))).unsubscribe();
    } else if (eventPageIndex < this.currentPage) {
      this.links$.subscribe(link => this.store.dispatch(new PrevPage(link.prev))).unsubscribe();
    } else if (eventPageIndex === 1) {
      this.links$.subscribe(link => this.store.dispatch(new FirstPage(link.first))).unsubscribe();
    } else if (eventPageIndex === this.totalPages) {
      this.links$.subscribe(link => this.store.dispatch(new LastPage(link.last))).unsubscribe();
    }
  }

  search(query: string, currentPage: number = this.currentPage) {
    this.store.dispatch(new Search({search: query, perPage: this.perPage, pageIndex: currentPage}));  
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
