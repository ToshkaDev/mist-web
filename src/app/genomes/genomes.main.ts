import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { FirstPage, LastPage, PrevPage, NextPage } from './genomes.actions';
import * as fromGenomes from './genomes.selectors';
import GenomesFilter from './genomes.filter';
import { Navigation }  from '../core/common/navigation';
import MistdDatasource from '../core/common/mist.datasource';

export abstract class GenomesMain implements OnInit {
  readonly defaultCount: number = 1;
  readonly defaultCurrentPage: number = 1;
  readonly defaultPerPage: number = 30;
  readonly defaultTotalPages: number = 1;
  readonly minQueryLenght = 1;
  readonly columns = ['Select', 'Genome', 'Superkingdom', 'Taxonomy', 'Genbank Version', 'Assembly level'];
  readonly pageSizeOptions = [5, 10, 30, 100];
  protected query$: Observable<string>;
  protected genomes$: Observable<any[]>;
  protected links$: Observable<any>;
  protected count: number;
  protected totalPages: number;
  protected perPage: number;
  protected currentPage: number;
  protected dataSource: MistdDatasource = new MistdDatasource(this.store, fromGenomes.getSearchResults);
  protected defaultSelection: string = "defaultValue";
  protected selected: string = this.defaultSelection;  
  protected displayedColumns: String[];

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
    this.query$ = this.store.select(fromGenomes.getSearchQuery);
    this.genomes$ = this.store.select(fromGenomes.getSearchResults);
    this.links$ = this.store.select(fromGenomes.getPageLinks);
    this.store.select(fromGenomes.getPageInfo).subscribe(
      pageInfo => {
        pageInfo.count ? this.count = pageInfo.count : this.count = this.defaultCount;
        pageInfo.currentPage ? this.currentPage = pageInfo.currentPage : this.currentPage = this.defaultCurrentPage;
        pageInfo.totalPages ? this.totalPages = pageInfo.totalPages : this.totalPages = this.defaultTotalPages;
        pageInfo.perPage ? this.perPage = pageInfo.perPage: this.perPage = this.defaultPerPage;
      }
    );
    this.genomes$.subscribe(results => results.length > 0 ? this.displayedColumns = this.columns : this.displayedColumns = null);
  }

  pageApply($event) {
    let eventPageIndex = ++$event.pageIndex;
    let filter: GenomesFilter = this.initialyzeFilter();
    if ($event.pageSize !== this.perPage) {
      this.perPage = $event.pageSize;
      this.sendQuery();
    } else if (eventPageIndex > this.currentPage) {
        this.links$.subscribe(link => this.store.dispatch(new NextPage(new Navigation(link.next, filter)))).unsubscribe();
    } else if (eventPageIndex < this.currentPage) {
        this.links$.subscribe(link => this.store.dispatch(new PrevPage(new Navigation(link.prev, filter)))).unsubscribe();
    } else if (eventPageIndex === 1) {
        this.links$.subscribe(link => this.store.dispatch(new FirstPage(new Navigation(link.first, filter)))).unsubscribe();
    } else if (eventPageIndex === this.totalPages) {
        this.links$.subscribe(link => this.store.dispatch(new LastPage(new Navigation(link.last, filter)))).unsubscribe();
    }
  }

  protected getStore() {
      return this.store;
  }

  abstract initialyzeFilter(): GenomesFilter;

  abstract sendQuery(): void;

}