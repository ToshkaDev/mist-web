import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { State } from '../../app.reducers';
import { MemoizedSelector } from '@ngrx/store';

import MistdDatasource from './mist.datasource';
import { Filter, Navigation }  from './navigation';

import * as MistAction from './mist-actions';

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
    protected scope$: Observable<string>;
    protected isFetching$: Observable<string>;
    protected errorMessage$: Observable<string>;
    protected isSearchPerformed$: Observable<string>;
    protected count: number;
    protected totalPages: number;
    protected perPage: number = 30;
    protected currentPage: number;
    protected displayedColumns: string[];
    protected resultsSelector: MemoizedSelector<State, any[]>;
    protected searchQuerySelector: MemoizedSelector<State, string>;
    protected pageInfoSelector: MemoizedSelector<State, any>;
    protected pageLinksSelector: MemoizedSelector<State, any>;
    protected searchScopeSelector: MemoizedSelector<State, string>;
    protected isFetchingSelector: MemoizedSelector<State, string>;
    protected errorMessageSelector: MemoizedSelector<State, string>;
    protected isSearchPerformedSelector: MemoizedSelector<State, string>;
    protected dataSource;

    constructor(private store: Store<any>, selectors: any, private columns: string[], private entity: string, private isGetById: boolean = false) {
        this.initalyzeSelectors(selectors);
        this.dataSource = new MistdDatasource(this.store, this.resultsSelector);
    }

    ngOnInit() {
        this.query$ = this.store.select(this.searchQuerySelector);
        this.result$ = this.store.select(this.resultsSelector);
        this.links$ = this.store.select(this.pageLinksSelector);
        this.scope$ = this.store.select(this.searchScopeSelector);
        this.isFetching$ = this.store.select(this.isFetchingSelector);
        this.errorMessage$ = this.store.select(this.errorMessageSelector);
        this.isSearchPerformed$ = this.store.select(this.isSearchPerformedSelector);
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
        let pageActionMap = MistAction.entityToActionType.get(this.entity);
        let filter: Filter = this.initialyzeFilter();
        let scope: string;
        this.scope$.subscribe(currentScope => scope = currentScope);
        if ($event.pageSize !== this.perPage) {
          this.perPage = $event.pageSize;
          this.sendQuery();
        } else if (eventPageIndex > this.currentPage) {
            this.links$.subscribe(link => this.store.dispatch(new MistAction.NextPage(pageActionMap.get(MistAction.NEXT_PAGE), new Navigation(link.next, scope, filter, this.isGetById)))).unsubscribe();
        } else if (eventPageIndex < this.currentPage) {
            this.links$.subscribe(link => this.store.dispatch(new MistAction.PrevPage(pageActionMap.get(MistAction.PREV_PAGE), new Navigation(link.prev, scope, filter, this.isGetById)))).unsubscribe();
        } else if (eventPageIndex === 1) {
            this.links$.subscribe(link => this.store.dispatch(new MistAction.FirstPage(pageActionMap.get(MistAction.FIRST_PAGE), new Navigation(link.first, scope, filter, this.isGetById)))).unsubscribe();
        } else if (eventPageIndex === this.totalPages) {
            this.links$.subscribe(link => this.store.dispatch(new MistAction.LastPage(pageActionMap.get(MistAction.LAST_PAGE), new Navigation(link.last, scope, filter, this.isGetById)))).unsubscribe();
        }
    }
    
    protected initialyzeFilter(): Filter { return null };

    abstract sendQuery(): void;

    initalyzeSelectors(selectors) {
        this.resultsSelector = selectors.getSearchResults;
        this.searchQuerySelector = selectors.getSearchQuery;
        this.pageInfoSelector = selectors.getPageInfo;
        this.pageLinksSelector = selectors.getPageLinks;
        this.searchScopeSelector = selectors.getSearchScope;
        this.isFetchingSelector = selectors.getSearchIsFetching;
        this.errorMessageSelector = selectors.getSearchErrorMessage;
        this.isSearchPerformedSelector = selectors.getIsSearchPerforemd;
    }

    protected getStore() {
        return this.store;
    }

    protected getEntityName() {
        return this.entity;
    }

}