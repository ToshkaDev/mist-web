import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { FirstPage, LastPage, PrevPage, NextPage } from './genes.actions';
import GenesFilter from './genes.filter';
import * as fromGenes from './genes.selectors';
import MistdDatasource from '../core/common/mist.datasource';
import { Navigation }  from '../core/common/navigation';

export abstract class GenesMain implements OnInit {
    readonly defaultCount: number = 1;
    readonly defaultCurrentPage: number = 1;
    readonly defaultPerPage: number = 30;
    readonly defaultTotalPages: number = 1;
    readonly minQueryLenght = 1;
    readonly columns: string[] = ["Select", "Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];
    readonly pageSizeOptions = [5, 10, 30, 100];
    protected genes$: Observable<any[]>;
    protected query$: Observable<string>;
    protected links$: Observable<any>;
    protected count: number;
    protected totalPages: number;
    protected perPage: number = 5;
    protected currentPage: number;
    protected displayedColumns: String[];
    protected dataSource = new MistdDatasource(this.store, fromGenes.getSearchResults);
  
    constructor(private store: Store<any>) {}
  
    ngOnInit() {
      this.query$ = this.store.select(fromGenes.getSearchQuery);
      this.genes$ = this.store.select(fromGenes.getSearchResults);
      this.links$ = this.store.select(fromGenes.getPageLinks);
      this.store.select(fromGenes.getPageInfo).subscribe(
        pageInfo => {
          pageInfo.count ? this.count = pageInfo.count : this.count = this.defaultCount;
          pageInfo.currentPage ? this.currentPage = pageInfo.currentPage : this.currentPage = this.defaultCurrentPage;
          pageInfo.totalPages ? this.totalPages = pageInfo.totalPages : this.totalPages = this.defaultTotalPages;
          pageInfo.perPage ? this.perPage = pageInfo.perPage: this.perPage = this.defaultPerPage;
        }
      );
      this.genes$.subscribe(results => results.length > 0 ? this.displayedColumns = this.columns : this.displayedColumns = null);  
    }
  
    pageApply($event) {
      let eventPageIndex = ++$event.pageIndex;
      let filter: GenesFilter = this.initialyzeFilter();
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
  
    abstract initialyzeFilter(): GenesFilter;

    abstract sendQuery(): void;
  
  }