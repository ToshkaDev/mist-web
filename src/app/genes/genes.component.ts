import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { Search, FirstPage, LastPage, PrevPage, NextPage } from './genes.actions';
import GenesFilter from './genes.filter';
import * as fromGenes from './genes.selectors';
import MistdDatasource from '../core/common/mist.datasource';
import { Navigation }  from '../core/common/navigation';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'mist-genes',
    styleUrls: ['./genes.scss'],
    templateUrl: './genes.pug',
  })

  export class GenesComponent implements OnInit {
    readonly defaultCount: number = 1;
    readonly defaultCurrentPage: number = 1;
    readonly defaultPerPage: number = 30;
    readonly defaultTotalPages: number = 1;
    readonly minQueryLenght = 1;
    readonly columns: string[] = ["Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];
    readonly pageSizeOptions = [5, 10, 30, 100];
    private genes$: Observable<any[]>;
    private query$: Observable<string>;
    private isFetching$: Observable<boolean>;
    private errorMessage$: Observable<string>;
    private links$: Observable<any>;
    count: number;
    totalPages: number;
    perPage: number = 5;
    currentPage: number;
    displayedColumns: String[];
    genesFilter: GenesFilter = new GenesFilter(); 
    dataSource = new MistdDatasource(this.store, fromGenes.getSearchResults);

    constructor(
      private store: Store<any>,
    ) {}

    ngOnInit() {
      this.query$ = this.store.select(fromGenes.getSearchQuery);
      this.isFetching$ = this.store.select(fromGenes.getSearchIsFetching);
      this.errorMessage$ = this.store.select(fromGenes.getSearchErrorMessage);
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
      this.genes$.skip(1).subscribe(result => console.log(JSON.stringify(result)));
      this.genes$.subscribe(results => results.length > 0 ? this.displayedColumns = this.columns : this.displayedColumns = null);  
    }

    pageApply($event) {
      let eventPageIndex = ++$event.pageIndex;
      let filter: GenesFilter;
      //If actual filtering will be set up uncomment the line below
      //this.query$.subscribe(searchterm => filter=this.checkQuery()).unsubscribe();
      if ($event.pageSize !== this.perPage) {
        this.perPage = $event.pageSize;
        this.query$.subscribe(searchterm => this.search(searchterm)).unsubscribe();
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

    search(query: string) {
      this.store.dispatch(new Search({
        search: query, 
        perPage: this.perPage, 
        pageIndex: this.defaultCurrentPage, 
        filter: {}
      }));
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

    filter() {}

    reset() {}
  }