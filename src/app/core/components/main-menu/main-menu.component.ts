import { Component, OnInit, Type} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GenomesComponent } from '../../../genomes/genomes.component';
import { GenesComponent } from '../../../genes/genes.component';
import { Store, Action, MemoizedSelector} from '@ngrx/store';
import { Search as SearchGenomes } from '../../../genomes/genomes.actions';
import { Search as SearchGenes } from '../../../genes/genes.actions';
import GenomesFilter from '../../../genomes/genomes.filter';
import * as fromGenomes from '../../../genomes/genomes.selectors';
import * as fromGenes from '../../../genes/genes.selectors';
import { State } from '../../../app.reducers';


@Component({
  selector: 'mist-main-menu',
  styleUrls: ['./main-menu.scss'],
  templateUrl: './main-menu.pug',
})
export class MainMenuComponent {

  query: string;
  query$: Observable<string>;
  isFetching$: Observable<boolean>;
  errorMessage$: Observable<string>;
  selectedComponent: string = "genomes";
  

  genomesFilter: GenomesFilter = new GenomesFilter(); 

  readonly defaultCurrentPage: number = 1;
  readonly minQueryLenght = 1;
  perPage: number=10;
  currentPage: number;
  defaultSelection: string = "defaultValue";
  selected: string = this.defaultSelection;

  private selectionOptionToRoute = new Map<string, string>([
    ["genomes", "/genomes"],
    ["genes-proteins", "/genes"],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);
  

  private routeToSelectionOption = new Map<string, string>([
    ["/genomes", "genomes"],
    ["/genes", "genes-proteins"],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);

  private selectionOptionToAction = new Map<string, Type<Action>>([
    ["genomes", SearchGenomes],
    ["genes-proteins", SearchGenes],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);

  private SelectorsQuery = new Map<string, MemoizedSelector<State, string>>([
    ["genomes", fromGenomes.getSearchQuery],
    ["genes-proteins", fromGenes.getSearchQuery],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);

  private SelectorsIsFetching = new Map<string, MemoizedSelector<State, boolean>>([
    ["genomes", fromGenomes.getSearchIsFetching],
    ["genes-proteins", fromGenes.getSearchIsFetching],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);
  
  private SelectorsErrorMessage = new Map<string, MemoizedSelector<State, string>>([
    ["genomes", fromGenomes.getSearchErrorMessage],
    ["genes-proteins", fromGenes.getSearchErrorMessage],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);

  constructor(
    private router: Router,
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.assignObservables();
  }

  putQuery(query: string) {
    if (this.router.url in Array.from(this.routeToSelectionOption.keys()))
      this.selectedComponent = this.routeToSelectionOption.get(this.router.url);
    
    this.query = query;
    this.search();
    this.router.navigate([this.selectionOptionToRoute.get(this.selectedComponent)]);
  }

  search() {
    let Search = this.selectionOptionToAction.get(this.selectedComponent);
    if (this.query)
      this.store.dispatch(new Search({
        search: this.query, 
        perPage: this.perPage, 
        pageIndex: this.defaultCurrentPage, 
        filter: {}
      }));
  }

  entityChanged(entity: any) {
    this.selectedComponent = entity.value;
    this.router.navigate([this.selectionOptionToRoute.get(this.selectedComponent)]);
    this.assignObservables()
  }

  assignObservables() {
    this.query$ = this.store.select(this.SelectorsQuery.get(this.selectedComponent));
    this.isFetching$ = this.store.select(this.SelectorsIsFetching.get(this.selectedComponent));
    this.errorMessage$ = this.store.select(this.SelectorsErrorMessage.get(this.selectedComponent));
  }

  checkQuery() {
    let filter: GenomesFilter;
    this.query$.subscribe(searchterm => {
      if (searchterm && searchterm.length >= this.minQueryLenght) {
        filter = Object.assign(new GenomesFilter(), this.genomesFilter)
      } else {
          filter = Object.assign(new GenomesFilter(), this.genomesFilter.reset());
          this.selected = this.defaultSelection;
      }}).unsubscribe();
    return filter;
  }

}
