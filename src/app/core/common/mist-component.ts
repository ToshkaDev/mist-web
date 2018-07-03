import { OnInit, Type } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { State } from '../../app.reducers';
import { MemoizedSelector } from '@ngrx/store';
import MistdDatasource from './mist.datasource';
import { Filter, Navigation }  from './navigation';
import { Entities } from './entities';
import { 
    FirstPage as GenesFirstPage, 
    LastPage as GenesLastPage, 
    PrevPage as GenesPrevPage, 
    NextPage as GenesNextPage
  } from '../../genes/genes.actions';
  import { 
    FirstPage as GenomesFirstPage, 
    LastPage as GenomesLastPage, 
    PrevPage as GenomesPrevPage, 
    NextPage as GenomesNextPage
   } from '../../genomes/genomes.actions';

export abstract class MistComponent implements OnInit {
    readonly defaultCount: number = 1;
    readonly defaultCurrentPage: number = 1;
    readonly defaultPerPage: number = 30;
    readonly defaultTotalPages: number = 1;
    readonly minQueryLenght = 1;
    readonly pageSizeOptions = [5, 10, 30, 100];
    protected result$: Observable<any[]>;
    protected query$: Observable<string>;
    protected links$: Observable<any>;
    protected count: number;
    protected totalPages: number;
    protected perPage: number = 5;
    protected currentPage: number;
    protected displayedColumns: string[];
    protected resultsSelector: MemoizedSelector<State, any[]>;
    protected searchQuerySelector: MemoizedSelector<State, string>;
    protected pageInfoSelector: MemoizedSelector<State, any>;
    protected pageLinksSelector: MemoizedSelector<State, any>;
    protected dataSource;
    private entityToPageActionMap: Map<string, Map<string, Type<Action>>> = new Map([
        [Entities.GENES, new Map<string, Type<Action>>([
          ["nextPage", GenesNextPage],
          ["prevPage", GenesPrevPage],
          ["firstPage", GenesFirstPage],
          ["lastPage", GenesLastPage]
        ])],
        [Entities.GENOMES, new Map<string, Type<Action>>([
          ["nextPage", GenomesNextPage],
          ["prevPage", GenomesPrevPage],
          ["firstPage", GenomesFirstPage],
          ["lastPage", GenomesLastPage]
        ])]
      ]); 

    constructor(private store: Store<any>, selectors: any, private columns: string[], private entity: string, private isGetById: boolean = false) {
        this.initalyzeSelectors(selectors);
        this.dataSource = new MistdDatasource(this.store, this.resultsSelector);
    }

    ngOnInit() {
        this.query$ = this.store.select(this.searchQuerySelector);
        this.result$ = this.store.select(this.resultsSelector);
        this.links$ = this.store.select(this.pageLinksSelector);
        this.store.select(this.pageInfoSelector).subscribe(
          pageInfo => {
            pageInfo.count ? this.count = pageInfo.count : this.count = this.defaultCount;
            pageInfo.currentPage ? this.currentPage = pageInfo.currentPage : this.currentPage = this.defaultCurrentPage;
            pageInfo.totalPages ? this.totalPages = pageInfo.totalPages : this.totalPages = this.defaultTotalPages;
            pageInfo.perPage ? this.perPage = pageInfo.perPage: this.perPage = this.defaultPerPage;
          }
        );
        this.result$.subscribe(results => results && results.length > 0 ? this.displayedColumns = this.columns : this.displayedColumns = null);  
    }

    pageApply($event) {
        let eventPageIndex = ++$event.pageIndex;
        let pageActionMap =  this.entityToPageActionMap.get(this.entity);
        let filter: Filter = this.initialyzeFilter();
        if ($event.pageSize !== this.perPage) {
          this.perPage = $event.pageSize;
          this.sendQuery();
        } else if (eventPageIndex > this.currentPage) {
            let NextPage = pageActionMap.get("nextPage");
            this.links$.subscribe(link => this.store.dispatch(new NextPage(new Navigation(link.next, filter, this.isGetById)))).unsubscribe();
        } else if (eventPageIndex < this.currentPage) {
            let PrevPage = pageActionMap.get("prevPage");
            this.links$.subscribe(link => this.store.dispatch(new PrevPage(new Navigation(link.prev, filter, this.isGetById)))).unsubscribe();
        } else if (eventPageIndex === 1) {
            let FirstPage = pageActionMap.get("firstPage");
            this.links$.subscribe(link => this.store.dispatch(new FirstPage(new Navigation(link.first, filter, this.isGetById)))).unsubscribe();
        } else if (eventPageIndex === this.totalPages) {
            let LastPage = pageActionMap.get("lastPage");
            this.links$.subscribe(link => this.store.dispatch(new LastPage(new Navigation(link.last, filter, this.isGetById)))).unsubscribe();
        }
    }
    
    abstract initialyzeFilter(): Filter;

    abstract sendQuery(): void;

    initalyzeSelectors(selectors) {
        this.resultsSelector = selectors.getSearchResults;
        this.searchQuerySelector = selectors.getSearchQuery;
        this.pageInfoSelector = selectors.getPageInfo;
        this.pageLinksSelector = selectors.getPageLinks;
    }

    protected getStore() {
        return this.store;
    }


}