import { ChangeDetectionStrategy, Component, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { Subject } from 'rxjs/Subject';
import { Search, FirstPage, LastPage, PrevPage, NextPage } from './genomes.actions';
import * as fromGenomes from './genomes.selectors';
import GenomesFilter from './genomes.filter';
import { Navigation }  from '../core/common/navigation';
import MistdDatasource from '../core/common/mist.datasource';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes',
  styleUrls: ['./genomes.scss'],
  templateUrl: './genomes.pug',
})
export class GenomesComponent implements OnInit {
  readonly defaultCount: number = 1;
  readonly defaultCurrentPage: number = 1;
  readonly defaultPerPage: number = 30;
  readonly defaultTotalPages: number = 1;
  readonly minQueryLenght = 1;
  readonly columns = ['Select', 'Genome', 'Superkingdom', 'Taxonomy', 'Genbank Version', 'Assembly level'];
  readonly pageSizeOptions = [5, 10, 30, 100];
  readonly taxonomyMap: Map<number,string> = new Map()
    .set(1,"superkingdom")
    .set(2,"phylum")
    .set(3,"clazz")
    .set(4,"order")
    .set(5,"family")
    .set(6,"genus");
  readonly asemblyFilterOptions = [
    {'value':'Complete Genome', 'viewValue' : 'Complete Genome'}, 
    {'value':'Chromosom', 'viewValue' : 'Chromosom'},
    {'value':'Scaffold', 'viewValue' : 'Scaffold'}, 
    {'value':'Contig', 'viewValue' : 'Contig'}];
  query$: Observable<string>;
  isFetching$: Observable<boolean>;
  errorMessage$: Observable<string>;
  genomes$: Observable<any[]>;
  links$: Observable<any>;
  count: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  dataSource: MistdDatasource = new MistdDatasource(this.store, fromGenomes.getSearchResults);
  defaultSelection: string = "defaultValue";
  selected: string = this.defaultSelection;  
  genomesFilter: GenomesFilter = new GenomesFilter(); 
  displayedColumns: String[];

  constructor(
    private store: Store<any>
  ) {
  }

  ngOnInit() {
    this.query$ = this.store.select(fromGenomes.getSearchQuery);
    this.isFetching$ = this.store.select(fromGenomes.getSearchIsFetching);
    this.errorMessage$ = this.store.select(fromGenomes.getSearchErrorMessage);
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
    let filter: GenomesFilter;
    this.query$.subscribe(searchterm => filter=this.checkQuery()).unsubscribe();
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
      filter: this.checkQuery()
    }));
  }

  filter() {
    this.query$.subscribe(query => this.search(query)).unsubscribe();
    this.selected = this.genomesFilter.getMostSpecificLevel();
  }

  reset() {
    this.genomesFilter.reset();
    this.selected = this.defaultSelection;
  }

  filterTaxonomy($event) {
    let selectedOptId: string = $event.source.selected._id;
    let selectedOptIndex: number = $event.source._optionIds.split(" ").indexOf(selectedOptId);
    let level: string = this.taxonomyMap.get(selectedOptIndex) + "";
    this.genomesFilter[level] = $event.value;
    this.genomesFilter.resetFrom(level);
    this.selected = $event.value;
    this.filter();
  }

  checkQuery() {
    let filter: GenomesFilter;
    this.query$.subscribe(searchterm => {
      if (searchterm && searchterm.length >= this.minQueryLenght) {
        filter = Object.assign(new GenomesFilter(), this.genomesFilter)
      } else {
          filter = Object.assign(new GenomesFilter(), this.genomesFilter.reset());
          this.selected = this.defaultSelection;
      }
    }).unsubscribe();
    return filter;
  }
}