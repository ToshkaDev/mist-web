import { Component, OnInit, AfterContentChecked } from '@angular/core';
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
import { CartChangedService } from '../../../shop-cart/cart-changed.service';

import * as MistAction from '../../common/mist-actions';
import { genomeScopeInterface } from '../../../genome/genome.view.model';

@Component({
  selector: 'mist-main-menu',
  styleUrls: ['./main-menu.scss'],
  templateUrl: './main-menu.pug',
})
export class MainMenuComponent implements OnInit, AfterContentChecked {
  private query: string;
  static readonly allGenomesScope = "All Genomes";
  private scope: string = MainMenuComponent.allGenomesScope;
  private scopeSearchTerm;
  private query$: Observable<string>;
  private scopeName$: Observable<string>;
  private scopeName: string;
  private isFetching$: Observable<boolean>;
  private isFetchingScope$: Observable<boolean>;
  private errorMessage$: Observable<string>;
  private isSearchPerformed$: Observable<boolean>;
  private result$: Observable<any>;
  private resultScope$: Observable<any>;
  private selectedComponent: string = Entities.GENOMES;
  private smallMenuDisplay: any = {'visibility': 'visible'};
  private genomesFilter: GenomesFilter = new GenomesFilter();
  readonly defaultCurrentPage: number = 1;
  readonly minQueryLenght: number = 1;
  private perPage: number = 30;
  private defaultSelection: string = "defaultValue";
  private selected: string = this.defaultSelection;
  private isScope: boolean = false;
  private scopeIsSelected: boolean = false;
  private genesInCart: string;
  private genomesInCart: string;
  private scopeSetFromDetailPage: genomeScopeInterface;

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

  private SelectorsResults = new Map<string, MemoizedSelector<State, any>>([
    [Entities.GENES, fromGenes.getSearchResults],
    [Entities.GENOMES, fromGenomes.getSearchResults],
    //["protein-features", ""],
  ]);

  private SelectorsScope = new Map<string, boolean>([
    [Entities.GENOMES, false],
    [Entities.GENES, true],
    //["protein-features", ""],
  ]);

  private SelectorsIsSearchPerformed = new Map<string, MemoizedSelector<State, boolean>>([
    [Entities.GENOMES, fromGenomes.getIsSearchPerforemd],
    [Entities.GENES, fromGenes.getIsSearchPerforemd],
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
        {"queryString": "Vibrionales", "link": `/${Entities.GENOMES}`},
        {"queryString": "Escherichia coli", "link": `/${Entities.GENOMES}`},
        {"queryString": "GCF_001315015.1", "link": `/${Entities.GENOMES}`}
      ]
    ],
    [Entities.GENES, [
        //{"queryString": "kinase", "link": `/${Entities.GENES}`},
        {"queryString": "GCF_001315015.1-AMK58_RS20975", "link": `/${Entities.GENES}`},
        {"queryString": "NP_415938.1", "link": `/${Entities.GENES}`},
        {"queryString": "PA1098", "link": `/${Entities.GENES}`}
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
    private scopeService: ScopeService,
    private cartChangedService: CartChangedService
  ) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
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
      else
        this.query$ = null;
      // (B)
      // 1) We need to put a genome name to copeService.selectGenomeName
      // in order it to be accessibale to all the places it needed
      // 2) selectScope(...) gets called in order to initiate a search with the new scope.
      // 3) scopeSetFromDetailPage need to be set to null after that,
      // so that a new scope object could be processed when it gets set by a user
      if (this.scopeSetFromDetailPage && this.getCurrentUrl() === `/${Entities.GENES}`) {
        this.scopeService.selectGenomeName(this.scopeSetFromDetailPage.name);
        this.selectScope(this.scopeSetFromDetailPage.refSeqVersion);
        this.scopeSetFromDetailPage = null;
      }

      // Set isSearchPerformed to null when not in search mode
      if (!this.routeToSelectionOption.has(currentUrl)) {
        this.isSearchPerformed$ = null;
      }
    });

    // (A)
    // putScopeGenomeName$ observable of scopeService will be called from the Genome detail page
    // when a user will set the genome to scope and the scope object will be detected here.
    // Once this activated the route will change (as a result of 'this.entityChanged(...)' calling)
    // and the router event listener initialzed in ngOnInit() will be called make
    // the necessary changes and assign observables for 'Genes'
    this.scopeService.putScopeGenomeName$.subscribe(scope => {
      if (scope && scope.refSeqVersion.length) {
        this.scopeSetFromDetailPage = scope;
        this.entityChanged({'value': Entities.GENES});
      }
    });

    this.genesInCart = this.cartChangedService.refreshWebStorageItemCounter(Entities.GENES);
    this.genomesInCart = this.cartChangedService.refreshWebStorageItemCounter(Entities.GENOMES);

    this.cartChangedService.isItemsAddedOrChanged$.subscribe(() => {
      this.genesInCart = this.cartChangedService.refreshWebStorageItemCounter(Entities.GENES);
      this.genomesInCart = this.cartChangedService.refreshWebStorageItemCounter(Entities.GENOMES);
    });
    this.scopeService.selectedScope$.subscribe(selectedScope => this.selectScope(selectedScope));
  }

  ngAfterContentChecked() {
    // put this.scopeName to the obesrvable in scopeService otherwise it's no accesible if a user selected another
    // entity (Genomes or another future component) and returned back to Genes component
    if (this.scopeName && this.scopeName !== this.scopeSearchTerm)
      this.scopeService.selectGenomeName(this.scopeName);
  }

  putQuery(query: string = this.query) {
    this.router.navigate([this.selectionOptionToRoute.get(this.selectedComponent)]);
    this.changeScopeTo(false);
    this.assignObservables(this.getCurrentUrl());
    // Don't send repeated requests. We don't use distinctUntilChanged() in SearchInputComponent
    // because the search term can't be deleted in this case by clicking close icon.
    if (query && this.query === query && this.compntHasScopeAndResIsLoaded()) {
      return;
    } else if (query && query.length >= this.minQueryLenght) {
        this.query = query;
        this.search();
    } else {
        this.query = query;
        this.clear(this.query, this.scope);
    }
  }

  putScope(scope: string) {
    // We need scopeSearchTerm in order to avoid sending repeated requests to the server
    // if a user just selecting the scope search word, but not changing it.
    // We can't use distinctUntilChanged() on onScopeChange in search-input.component.ts because
    // the 'All Genomes' default scope searchterm can't be deleted in this case by clicking on delete icon
    // in search-input.pug
    if (!scope || scope.length == 0) {
        this.clearAndPrepare();
    } else if (this.scopeSearchTerm === scope || this.scopeName === scope) {
        return;
    } else if (scope && scope.length > 0) {
        // If we are going from another page we need to navigate to /genes and reasign observables
        this.entityChanged({'value': Entities.GENES});
        this.launchScopeSearch(scope);
    }
  }

  clearAndPrepare() {
    this.scopeSearchTerm = "";
    this.scope = MainMenuComponent.allGenomesScope;
    this.scopeService.selectGenomeName('');
    // 1) First we need to dispatch clear action to get rid off the results (and a scope) corresponding to the current
    // component which got downloaded previously based on the url.
    // 2) Then we dispatch clear action corresponding to GenesScopeComponent
    // 3) Finally we set scope to true so that only GenesScopeComponent will get downloaded when the genomes
    // results from the server will be retrieved
    this.clear(this.query, null);
    this.clear(null, null, MistAction.CLEAR_SCOPE);
    this.changeScopeTo(true);
  }

  launchScopeSearch(scope: string) {
    this.scopeService.selectGenomeName(scope);
    this.scopeSearchTerm = scope;
    this.scopeIsSelected = false;
    this.query = this.query ? this.query : '';
    // This needed to download GenesScopeComponent.
    this.changeScopeTo(true);
    // A lot of fun is going on here:
    // 1) Clear current observables of the downloaded component
    // 2) Assign observables corresponding to GenesScopeComponent
    // We use separate method to assign observables for scope, because the standard method is based on url address.
    // 3) Search for scope
    this.clear(this.query, this.scopeSearchTerm);
    this.assignObservablesForScope();
    this.searchForScope();
    // At the beginning we set this.scopeIsSelected = false. If a user selects a genome clicking on one of the records
    // on scope search results then this.scopeIsSelected will be changed to true in selectScope(selectedScope: string = null) method.
    // But if a user doesn't select any genome then the search scope will be defaulted to "All Genomes"
    if (!this.scopeIsSelected)
      this.scope = MainMenuComponent.allGenomesScope;
  }

  searchForScope() {
    let SEARCH = MistAction.SEARCH_SCOPE;
    this.store.dispatch(new MistAction.Search(SEARCH, {
      scope: null,
      search: this.scopeSearchTerm,
      perPage: this.perPage,
      pageIndex: this.defaultCurrentPage,
      filter: {}
    }));
  }

  selectScope(selectedScope: any = null) {
    this.scopeIsSelected = true;
    this.scope = selectedScope ? selectedScope : MainMenuComponent.allGenomesScope;
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
    this.scopeName$ = null;
    this.result$ = null;
    if (this.routeToSelectionOption.has(currentUrl)) {
      this.query$ = this.store.select(this.SelectorsQuery.get(this.selectedComponent));
      this.query$.subscribe(query => query ? this.query = query : this.query = null);
      this.scopeName$ = this.SelectorsScope.get(this.selectedComponent) ? this.scopeService.selectedScopeGenomeName$ : null;
      if (this.scopeName$)
        this.scopeName$.subscribe(scopeName => this.scopeName = scopeName);
      if (this.componentHasScope()) {
        this.result$ = this.store.select(this.SelectorsResults.get(this.selectedComponent));
      }
    }
    this.isFetching$ = this.store.select(this.SelectorsIsFetching.get(this.selectedComponent));
    this.isSearchPerformed$ = this.store.select(this.SelectorsIsSearchPerformed.get(this.selectedComponent));
    this.errorMessage$ = this.store.select(this.SelectorsErrorMessage.get(this.selectedComponent));
  }

  assignObservablesForScope() {
    this.query$ = this.store.select(this.SelectorsQuery.get(this.selectedComponent));
    this.resultScope$ = this.store.select(fromScope.getSearchResults);
    this.isFetchingScope$ = this.store.select(fromScope.getSearchIsFetching);
    this.isSearchPerformed$ = this.store.select(fromScope.getIsSearchPerforemd);
    this.errorMessage$ = this.store.select(fromScope.getSearchErrorMessage);
  }

  private getCurrentUrl(): string {
    return this.router.url ? `/${this.router.url.split("/")[1]}` : null;
  }

  private getScope(): string {
    if (this.getCurrentUrl() === this.selectionOptionToRoute.get(Entities.GENES)) {
      if (this.scope === MainMenuComponent.allGenomesScope) {
        this.scopeService.selectGenomeName(MainMenuComponent.allGenomesScope);
      }
      return this.scope;
    }

    return null;
  }

  private changeScopeTo(isScope: boolean) {
    this.isScope = isScope;
  }

  private componentHasScope() {
    return this.SelectorsResults.has(this.routeToSelectionOption.get(this.getCurrentUrl()));
  }

  // should be called after assignObservables() was called. This happens naturally. Just a warning.
  private compntHasScopeAndResIsLoaded() {
    let isResultLoaded = false;
    if (this.result$)
      this.result$.subscribe(result => { if (result && result.length > 0) isResultLoaded = true });
    return isResultLoaded && this.result$;
  }

}
