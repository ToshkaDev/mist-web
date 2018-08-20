import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store, MemoizedSelector} from '@ngrx/store';
import GenomesFilter from '../../../genomes/genomes.filter';
import * as fromGenomes from '../../../genomes/genomes.selectors';
import * as fromGenes from '../../../genes/genes.selectors';
import * as fromScope from '../../../genes/scope/scope.selectors';
import { State } from '../../../app.reducers';
import { Entities } from '../../common/entities';
import { ScopeService } from './scope.service';

import * as MistAction from '../../common/mist-actions';

@Component({
  selector: 'mist-main-menu',
  styleUrls: ['./main-menu.scss'],
  templateUrl: './main-menu.pug',
})
export class MainMenuComponent {
  private query: string;
  static readonly allGenomesScope = "All Genomes";
  private scope: string = MainMenuComponent.allGenomesScope;
  private query$: Observable<string>;
  private scope$: Observable<string>;
  private isFetching$: Observable<boolean>;
  private errorMessage$: Observable<string>;
  private selectedComponent: string = Entities.GENOMES;
  private smallMenuDisplay: any = {'visibility': 'visible'};
  
  private genomesFilter: GenomesFilter = new GenomesFilter(); 

  readonly defaultCurrentPage: number = 1;
  readonly minQueryLenght: number = 1;
  private perPage: number = 30;
  private defaultSelection: string = "defaultValue";
  private selected: string = this.defaultSelection;
  private isScope: boolean = false;
  scopeIsSelected: boolean = false;

  private routeToSmallMenuDisplay = new Map<string, string>([
    ["/", "visible"],
    ["/help", "visible"],
    ["/member-genomes", "hidden"],
    ["/api", "hidden"],
    ["/shop-cart", "hidden"],
    [`/${Entities.GENOMES}`, "hidden"],
    [`/${Entities.GENES}`, "hidden"],
    //["/protein-features", ""],
  ]);

  private selectionOptionToRoute = new Map<string, string>([
    [Entities.GENOMES, `/${Entities.GENOMES}`],
    [Entities.GENES, `/${Entities.GENES}`],
    //["protein-features", ""],
  ]);
  
  private routeToSelectionOption = new Map<string, string>([
    [`/${Entities.GENOMES}`, Entities.GENOMES],
    [`/${Entities.GENES}`, Entities.GENES],
    //["/protein-features", ""],
  ]);

  private selectionOptionToActionType = new Map<string, string>([
    [Entities.GENOMES, MistAction.SEARCH_GENOMES],
    [Entities.GENES, MistAction.SEARCH_GENES],
    //["protein-features", ""],
  ]);

  private selectionOptionToClearActionType = new Map<string, string>([
    [Entities.GENOMES, MistAction.CLEAR_GENOMES],
    [Entities.GENES, MistAction.CLEAR_GENES],
    //["protein-features", ""],
  ]);

  private SelectorsQuery = new Map<string, MemoizedSelector<State, string>>([
    [Entities.GENOMES, fromGenomes.getSearchQuery],
    [Entities.GENES, fromGenes.getSearchQuery],
    //["protein-features", ""],
  ]);

  private SelectorsScope = new Map<string, MemoizedSelector<State, string>>([
    [Entities.GENOMES, fromGenomes.getSearchScope],
    [Entities.GENES, fromGenes.getSearchScope],
    //["protein-features", ""],
  ]);

  private SelectorsIsFetching = new Map<string, MemoizedSelector<State, boolean>>([
    [Entities.GENOMES, fromGenomes.getSearchIsFetching],
    [Entities.GENES, fromGenes.getSearchIsFetching],
    //["protein-features", ""],
  ]);
  
  private SelectorsErrorMessage = new Map<string, MemoizedSelector<State, string>>([
    [Entities.GENOMES, fromGenomes.getSearchErrorMessage],
    [Entities.GENES, fromGenes.getSearchErrorMessage],
    //["protein-features", ""],
  ]);

  private entityToExamples = new Map<string, any[]>([
    [Entities.GENOMES, [
        {"queryString": "Methanobacteriales", "link": `/${Entities.GENOMES}`}, 
        {"queryString": "Methanococcus voltae", "link": `/${Entities.GENOMES}`},
        {"queryString": "GCF_000302455.1", "link": `/${Entities.GENOMES}`}
      ]
    ],
    [Entities.GENES, [
        {"queryString": "kinase", "link": `/${Entities.GENES}`},
        {"queryString": "GCF_000302455.1-A994_RS01845", "link": `/${Entities.GENES}`},
        {"queryString": "WP_004029250.1", "link": `/${Entities.GENES}`},
        {"queryString": "A994_RS13120", "link": `/${Entities.GENES}`}
      ]
    ],
    //["/protein-features", ""]
  ]);
  
  private examples: any[] = this.entityToExamples.has(this.selectedComponent) 
    ? this.entityToExamples.get(this.selectedComponent) 
    : null; 

  constructor(
    private router: Router,
    private store: Store<any>,
    private scopeService: ScopeService
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      let currentUrl = this.getCurrentUrl();
      this.smallMenuDisplay['visibility'] = this.routeToSmallMenuDisplay.get(currentUrl);
      this.changeScopeTo(false);
      if (this.routeToSelectionOption.has(currentUrl)) {
        this.selectedComponent = this.routeToSelectionOption.get(currentUrl);
        this.assignObservables(currentUrl);
        this.examples = this.entityToExamples.has(this.selectedComponent) 
          ? this.entityToExamples.get(this.selectedComponent) 
          : null; 
      } 
      //TODO: will need remove this
      else {
        this.query$ = null;
      }
    });   

    this.scopeService.selectedScope$.subscribe(selectedScope => this.selectScope(selectedScope));
  }

  putQuery(query: string = this.query) {
    this.router.navigate([this.selectionOptionToRoute.get(this.selectedComponent)]);
    this.changeScopeTo(false);
    this.assignObservables(this.getCurrentUrl());
    this.query = query;
    if (this.query && this.query.length >= this.minQueryLenght) {
      this.search();
    } else {
      this.clear(this.query, this.scope); 
    } 
  }

  putScope(scope: string) {
    if (this.scope === scope) 
      return;
    if (scope && scope.length > 0) {
      this.scopeIsSelected = false;
      this.scope = scope;
      this.query = this.query ? this.query : '';
      this.changeScopeTo(true);
      // A lot of fun is going on here:
      // 1) Clear current observables of the downloaded component
      // 2) Assign observables corresponding to GenesScopeComponent
      // We use separate method to assign observables for scope, because the standard method is based on url address.
      // 3) Search for scope
      this.clear(this.query, this.scope);
      this.assignObservablesForScope();
      this.searchForScope();
      // At the beginning we set this.scopeIsSelected = false. If a user selects a genome clicking on one of the records
      // on scope search results then this.scopeIsSelected will be changed to true in selectScope(selectedScope: string = null) method.
      // But if a user doesn't select any genome then the search scope will be defaulted to "All Genomes" 
      if (!this.scopeIsSelected)
        this.scope = MainMenuComponent.allGenomesScope;
    } else {
      this.scope = MainMenuComponent.allGenomesScope;
      // 1) First we need to dispatch clear action to get rid off the results (and a scope) corresponding to the current
      // component which got downloaded previously based on the url. 
      // 2) Then we dispatch clear action corresponding to GenesScopeComponent
      // 3) Finally we set scope to true so that only GenesScopeComponent will get downloaded when the genomes 
      // results from the server will be retrieved
      this.clear(this.query, null); 
      this.clear(null, null, MistAction.CLEAR_SCOPE); 
      this.changeScopeTo(true);
    }
  }

  searchForScope() {
    let SEARCH = MistAction.SEARCH_SCOPE;
    this.store.dispatch(new MistAction.Search(SEARCH, {
      scope: null,
      search: this.scope, 
      perPage: this.perPage, 
      pageIndex: this.defaultCurrentPage, 
      filter: {}
    }));
  }

  selectScope(selectedScope: string = null) {
    this.scopeIsSelected = true;
    this.scope = selectedScope && selectedScope.length > 0 ? selectedScope : MainMenuComponent.allGenomesScope;
    this.putQuery();
  }

  search() {
    let SEARCH = this.selectionOptionToActionType.get(this.selectedComponent);
    this.store.dispatch(new MistAction.Search(SEARCH, {
      scope: this.getScope(),
      search: this.query, 
      perPage: this.perPage, 
      pageIndex: this.defaultCurrentPage, 
      filter: {}
    }));
  }

  clear(query: string, scope: string, action: string = null) {
    let CLEAR = action ? action : this.selectionOptionToClearActionType.get(this.selectedComponent);
    this.store.dispatch(new MistAction.Clear(CLEAR, {
      query: query,
      scope: scope
    }));
  }

  entityChanged(entity: any) {
    this.selectedComponent = entity.value;
    this.router.navigate([this.selectionOptionToRoute.get(this.selectedComponent)]);
  }

  assignObservables(currentUrl: string) {
    this.query$ = null;
    this.scope$ = null;
    if (this.routeToSelectionOption.has(currentUrl)) {
      this.query$ = this.store.select(this.SelectorsQuery.get(this.selectedComponent));
      this.scope$ = this.store.select(this.SelectorsScope.get(this.selectedComponent));
    }
    this.isFetching$ = this.store.select(this.SelectorsIsFetching.get(this.selectedComponent));
    this.errorMessage$ = this.store.select(this.SelectorsErrorMessage.get(this.selectedComponent));
  }

  assignObservablesForScope() {
    this.query$ = this.store.select(this.SelectorsQuery.get(this.selectedComponent));
    this.isFetching$ = this.store.select(fromScope.getSearchIsFetching);
    this.errorMessage$ = this.store.select(fromScope.getSearchErrorMessage);
  }

  private getCurrentUrl(): string {
    return this.router.url ? `/${this.router.url.split("/")[1]}` : null;
  }

  private getScope(): string {
    if (this.getCurrentUrl() === this.selectionOptionToRoute.get(Entities.GENES)) {
      return this.scope;
    }
    return null;
  }

  private changeScopeTo(isScope: boolean) {
    this.isScope = isScope;
    this.scopeService.change(isScope);
  }

}
