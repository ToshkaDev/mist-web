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
  readonly genomesColumns = ['Select', 'Genome', 'Taxonomy', 'Genbank Version', 'Assembly level'];
  readonly genesColumns: string[] = ["Select", "Mist Id", "Protein Id", "Domain Structure", "Locus", "Description", "Location"];
  private paginationElementList = ["count", "currentPage", "totalPages", "perPage"];
  private elementToDefault = {
    "count": this.defaultCount, 
    "currentPage": this.defaultCurrentPage, 
    "totalPages": this.defaultTotalPages, 
    "perPage": this.defaultPerPage
  };
  private genomes$: Observable<any[]>;
  private genes$: Observable<any[]>;
  private isFetchingGenomes$: Observable<boolean>;
  private errorMessageGenomes$: Observable<string>;
  private isFetchingGenes$: Observable<boolean>;
  private errorMessageGenes$: Observable<string>;
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

  private entityToPaginationElement: any = {
    "genes" : {
      "perPage" : this.defaultPerPage,
      "currentPage" : this.defaultCurrentPage,
      "totalPages" : this.defaultTotalPages,
      "count" : this.defaultCount
    },
    "genomes" : {
      "perPage" : this.defaultPerPage,
      "currentPage" : this.defaultCurrentPage,
      "totalPages" : this.defaultTotalPages,
      "count" : this.defaultCount
    }
  }
  
  private entityToLinks: Map<string, Observable<any>> = new Map();

  constructor(private store: Store<any>, private cookieService: CookieService) {}

  ngOnInit() {
    this.setUpGenes();
    this.setUpGenomes();
    this.cookieService.set('mist-genomesIds', '1,2,3,4,5,6,7,8,9');
    let cookieValue = this.cookieService.get('mist-genomesIds');
    this.getByIdList(cookieValue, "genomes");
  }

  setUpPagination(pageInfo, entity) {
    this.paginationElementList.forEach(element => {
      pageInfo[element]
        ? this.entityToPaginationElement[entity][element] = pageInfo[element]
        : this.entityToPaginationElement[entity][element] = this.elementToDefault[element]
    });
  }

  setUpGenes() {
    this.isFetchingGenes$ = this.store.select(fromGenes.getSearchIsFetching);
    this.errorMessageGenes$ = this.store.select(fromGenes.getSearchErrorMessage);
    this.genes$ = this.store.select(fromGenes.getSearchResults);
    this.entityToLinks.set(Entities.GENES, this.store.select(fromGenes.getPageLinks));
    this.store.select(fromGenes.getPageInfo).subscribe(
      pageInfo => this.setUpPagination(pageInfo, Entities.GENES)
    );
    this.genes$.subscribe(results => results.length > 0 ? this.genesDisplayedColumns = this.genesDisplayedColumns : this.genesDisplayedColumns = null);
  }

  setUpGenomes() {
    this.isFetchingGenomes$ = this.store.select(fromGenomes.getSearchIsFetching);
    this.errorMessageGenomes$ = this.store.select(fromGenomes.getSearchErrorMessage);
    this.genomes$ = this.store.select(fromGenomes.getSearchResults);
    this.entityToLinks.set(Entities.GENOMES, this.store.select(fromGenomes.getPageLinks));
    this.store.select(fromGenomes.getPageInfo).subscribe(
      pageInfo => this.setUpPagination(pageInfo, Entities.GENOMES)
    );
    this.genomes$.subscribe(results => results.length > 0 ? this.genomesDisplayedColumns = this.genomesColumns : this.genomesDisplayedColumns = null);
  }

  getByIdList(query: string, entity) {
    let GetByIdList = this.entityToPageActionMap.get(entity).get("getByIdList");
    let perPage = this.entityToPaginationElement[entity]["perPage"]
    let pageIndex = this.entityToPaginationElement[entity]["currentPage"];
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
    let perPage = this.entityToPaginationElement[entity]["perPage"];
    let currentPage = this.entityToPaginationElement[entity]["currentPage"];
    let totalPages = this.entityToPaginationElement[entity]["totalPages"];
    links$.subscribe(link => console.log("link " + JSON.stringify(link)))
    
    if ($event.pageSize !== perPage) {
      this.entityToPaginationElement[entity]["perPage"] = $event.pageSize;
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