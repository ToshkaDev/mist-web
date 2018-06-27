import { ChangeDetectionStrategy, Component, OnInit, Type } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import * as fromGenes from '../genes/genes.selectors';
import * as fromGenomes from '../genomes/genomes.selectors';
import MistdDatasource from '../core/common/mist.datasource';
import { Navigation }  from '../core/common/navigation';
import { Entities } from '../core/common/entities';
import { CookieService } from 'ngx-cookie-service';

import { 
  GetByIdList as GenesGetByIdList, 
  FirstPage as GenesFirstPage, 
  LastPage as GenesLastPage, 
  PrevPage as GenesPrevPage, 
  NextPage as GenesNextPage
} from '../genes/genes.actions';
import { 
  GetByIdList as GenomesGetByIdList, 
  FirstPage as GenomesFirstPage, 
  LastPage as GenomesLastPage, 
  PrevPage as GenomesPrevPage, 
  NextPage as GenomesNextPage
 } from '../genomes/genomes.actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-shop-cart',
  styleUrls: ['./shop-cart.scss'],
  templateUrl: './shop-cart.pug',
})
export class ShopCartComponent implements OnInit {
  readonly defaultCount: number = 1;
  readonly defaultCurrentPage: number = 1;
  readonly defaultPerPage: number = 30;
  readonly defaultTotalPages: number = 1;
  readonly pageSizeOptions = [5, 10, 30, 100];
  private countGenomes: number;
  private countGenes: number;
  private perPageGenomes: number;
  private perPageGenes: number;
  private totalPagesGenomes: number;
  private totalPagesGenes: number;
  private currentPageGenomes: number;
  private currentPageGenes: number;
  readonly genomesColumns = ['Select', 'Genome', 'Taxonomy', 'Genbank Version', 'Assembly level'];
  readonly genesColumns: string[] = ["Select", "Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];
  private genomes$: Observable<any[]>;
  private genes$: Observable<any[]>;
  private isFetchingGenomes$: Observable<boolean>;
  private errorMessageGenomes$: Observable<string>;
  private isFetchingGenes$: Observable<boolean>;
  private errorMessageGenes$: Observable<string>;
  private linksGenomes$: Observable<any>;
  private linksGenes$: Observable<any>;
  private genomesDataSource: MistdDatasource = new MistdDatasource(this.store, fromGenomes.getSearchResults);
  private genesDataSource = new MistdDatasource(this.store, fromGenes.getSearchResults);
  private genesDisplayedColumns: String[];
  private genomesDisplayedColumns: String[];
    
  private entityToPageActionMap: Map<string, Map<string, Type<Action>>> = new Map([
    [Entities.GENES, new Map<string, Type<Action>>([
      ["getByIdList", GenesGetByIdList],
      ["nextPage", GenesNextPage],
      ["prevPage", GenesPrevPage],
      ["firstPage", GenesFirstPage],
      ["lastPage", GenesLastPage]
    ])],
    [Entities.GENOMES, new Map<string, Type<Action>>([
      ["getByIdList", GenomesGetByIdList],
      ["nextPage", GenomesNextPage],
      ["prevPage", GenomesPrevPage],
      ["firstPage", GenomesFirstPage],
      ["lastPage", GenomesLastPage]
    ])]
  ]);
  private entityToPageCountMap: Map<string, Map<string, number>> = new Map([
    [Entities.GENES, new Map<string, number>([
      ["perPage", this.defaultPerPage],
      ["currentPage", this.currentPageGenes],
      ["totalPages", this.totalPagesGenes],
      ["count", this.countGenes],
    ])],
    [Entities.GENOMES, new Map<string, number>([
      ["perPage", this.defaultPerPage],
      ["currentPage", this.currentPageGenomes],
      ["totalPages", this.totalPagesGenomes],
      ["count", this.countGenomes],
    ])],
  ]);
  private entityToLinks: Map<string, Observable<any>> = new Map([
    [Entities.GENES, this.linksGenes$],
    [Entities.GENOMES, this.linksGenomes$]
  ]);

  constructor(private store: Store<any>, private cookieService: CookieService) {}

  ngOnInit() {
    this.setUpGenes();
    this.setUpGenomes();
    this.cookieService.set('mist-genomesIds', '1,2,3,4,5,6,7,8,9');
    let cookieValue = this.cookieService.get('mist-genomesIds');
    this.getByIdList(cookieValue, "genomes");
  }

  setUpGenes() {
    this.isFetchingGenes$ = this.store.select(fromGenes.getSearchIsFetching);
    this.errorMessageGenes$ = this.store.select(fromGenes.getSearchErrorMessage);
    this.genes$ = this.store.select(fromGenes.getSearchResults);
    this.linksGenes$ = this.store.select(fromGenes.getPageLinks);
    this.store.select(fromGenes.getPageInfo).subscribe(
      pageInfo => {
        pageInfo.count ? this.countGenes = pageInfo.count : this.countGenes = this.defaultCount;
        pageInfo.currentPage ? this.currentPageGenes = pageInfo.currentPage : this.currentPageGenes = this.defaultCurrentPage;
        pageInfo.totalPages ? this.totalPagesGenes = pageInfo.totalPages : this.totalPagesGenes = this.defaultTotalPages;
        pageInfo.perPage ? this.perPageGenes = pageInfo.perPage: this.perPageGenes = this.defaultPerPage;
      }
    );
    this.genes$.subscribe(results => results.length > 0 ? this.genesDisplayedColumns = this.genesDisplayedColumns : this.genesDisplayedColumns = null);
  }

  setUpGenomes() {
    this.isFetchingGenomes$ = this.store.select(fromGenomes.getSearchIsFetching);
    this.errorMessageGenomes$ = this.store.select(fromGenomes.getSearchErrorMessage);
    this.genomes$ = this.store.select(fromGenomes.getSearchResults);
    this.linksGenomes$ = this.store.select(fromGenomes.getPageLinks);
    this.store.select(fromGenomes.getPageInfo).subscribe(
      pageInfo => {
        pageInfo.count ? this.countGenomes = pageInfo.count : this.countGenomes = this.defaultCount;
        pageInfo.currentPage ? this.currentPageGenomes = pageInfo.currentPage : this.currentPageGenomes = this.defaultCurrentPage;
        pageInfo.totalPages ? this.totalPagesGenomes = pageInfo.totalPages : this.totalPagesGenomes = this.defaultTotalPages;
        pageInfo.perPage ? this.perPageGenomes = pageInfo.perPage: this.perPageGenomes = this.defaultPerPage;
      }
    );
    this.genomes$.subscribe(results => results.length > 0 ? this.genomesDisplayedColumns = this.genomesColumns : this.genomesDisplayedColumns = null);
  }

  getByIdList(query: string, entity) {
    let GetByIdList = this.entityToPageActionMap.get(entity).get("getByIdList");
    let perPage = this.entityToPageCountMap.get(entity).get("perPage");
    let pageIndex = this.entityToPageCountMap.get(entity).get("currentPage");
    console.log("perPage " + perPage)
    console.log("this.entityToPageCountMap.get(entity).get(currentPage) " + this.entityToPageCountMap.get(entity).get("currentPage"))
    console.log("this.currentPageGenomes " + this.currentPageGenomes)
    this.store.dispatch(new GetByIdList({
      search: query, 
      perPage: perPage, 
      pageIndex: pageIndex
    }));
  }

  pageApply($event, entity: string) {
    let eventPageIndex = ++$event.pageIndex;
    let links$ = this.entityToLinks.get(entity);
    let pageActionMap =  this.entityToPageActionMap.get(entity);
    let perPage = this.entityToPageCountMap.get(entity).get("perPage");
    let currentPage = this.entityToPageCountMap.get(entity).get("currentPage");
    let totalPages = this.entityToPageCountMap.get(entity).get("totalPages");
    if ($event.pageSize !== perPage) {
      perPage = $event.pageSize;
      this.getByIdList(this.cookieService.get('mist-genomesIds'), entity)
    } else if (eventPageIndex > currentPage) {
        let NextPage = pageActionMap.get("nextPage");
        links$.subscribe(link => this.store.dispatch(new NextPage(new Navigation(link.next, null, true)))).unsubscribe();
    } else if (eventPageIndex < currentPage) {
        let PrevPage = pageActionMap.get("prevPage");
        links$.subscribe(link => this.store.dispatch(new PrevPage(new Navigation(link.prev, null, true)))).unsubscribe();
    } else if (eventPageIndex === 1) {
        let FirstPage = pageActionMap.get("firstPage");
        links$.subscribe(link => this.store.dispatch(new FirstPage(new Navigation(link.first, null, true)))).unsubscribe();
    } else if (eventPageIndex === totalPages) {
        let LastPage = pageActionMap.get("lastPage");
        links$.subscribe(link => this.store.dispatch(new LastPage(new Navigation(link.last, null, true)))).unsubscribe();
    }
  }

}