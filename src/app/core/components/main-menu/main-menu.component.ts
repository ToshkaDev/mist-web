import { Component, OnInit, EventEmitter, Output, Input, AfterContentChecked } from '@angular/core';
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
import { ToggleChangedService } from '../protein-feature-toggle/toggle-changed.service';
import {MistDatabaseGetter } from '../../common/mist-database-getter';

import * as MistAction from '../../common/mist-actions';
import { genomeScopeInterface } from '../../../genome/genome.view.model';

@Component({
  selector: 'mist-main-menu',
  styleUrls: ['./main-menu.scss'],
  templateUrl: './main-menu.pug',
})
export class MainMenuComponent extends MistDatabaseGetter implements OnInit, AfterContentChecked {
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
  private database: string = Entities.MIST;

  // colors
  private dbNameColorActive = "black";
  private dbNameColorInactive = "gray";
  private dbNameColor = {
    'mist': {'color': this.dbNameColorActive},
    'mist-metagenomes': {'color': this.dbNameColorInactive},
  };

  @Output() databaseSwitchEvent = new EventEmitter<any>();
  @Input() databaseChecked = false;

  private selectionOptionToRoute = new Map<string, Map<string, string>> ([
    [Entities.MIST, new Map([
      ["home", `/${Entities.MIST}/`],
      [Entities.GENOMES, `/${Entities.MIST}/${Entities.GENOMES}`],
      [Entities.GENES, `/${Entities.MIST}/${Entities.GENES}`],
    ])],
    [Entities.MIST_METAGENOMES, new Map([
      ["home", `/${Entities.MIST_METAGENOMES}/`],
      [Entities.GENOMES, `/${Entities.MIST_METAGENOMES}/${Entities.GENOMES}`],
      [Entities.GENES, `/${Entities.MIST_METAGENOMES}/${Entities.GENES}`],
    ])]
  ]);

  private routeToSelectionOption = new Map<string, Map<string, string>> ([
    [Entities.MIST, new Map([
        [`/${Entities.MIST}/${Entities.GENOMES}`, Entities.GENOMES],
        [`/${Entities.MIST}/${Entities.GENES}`, Entities.GENES],
      ])
    ],
    [Entities.MIST_METAGENOMES, new Map([
        [`/${Entities.MIST_METAGENOMES}/${Entities.GENOMES}`, Entities.GENOMES],
        [`/${Entities.MIST_METAGENOMES}/${Entities.GENES}`, Entities.GENES],
      ])
    ]
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

  private entityToExamples = new Map<string, Map<string, any[]>>([
    [Entities.MIST, new Map([
        [Entities.GENOMES, [
            {"queryString": "Vibrionales", "link": `/${Entities.MIST}/${Entities.GENOMES}`},
            {"queryString": "Escherichia coli", "link": `/${Entities.MIST}/${Entities.GENOMES}`},
            {"queryString": "GCF_001315015.1", "link": `/${Entities.MIST}/${Entities.GENOMES}`}
          ]
        ],
        [Entities.GENES, [
            {"queryString": "GCF_001315015.1-AMK58_RS20975", "link": `/${Entities.MIST}/${Entities.GENES}`},
            {"queryString": "NP_415938.1", "link": `/${Entities.MIST}/${Entities.GENES}`},
            {"queryString": "PA1098", "link": `/${Entities.MIST}/${Entities.GENES}`}
          ]
        ]
      ])
    ],
    [Entities.MIST_METAGENOMES, new Map([
        [Entities.GENOMES, [
            {"queryString": "Pseudomonadaceae", "link": `/${Entities.MIST_METAGENOMES}/${Entities.GENOMES}`},
            {"queryString": "Methanococcus maripaludis", "link": `/${Entities.MIST_METAGENOMES}/${Entities.GENOMES}`},
            {"queryString": "GCA_003661005.1", "link": `/${Entities.MIST_METAGENOMES}/${Entities.GENOMES}`}
          ]
        ],
        [Entities.GENES, [
            {"queryString": "GCA_003648675.1-DRI93_04610", "link": `/${Entities.MIST_METAGENOMES}/${Entities.GENES}`},
            {"queryString": "CCX43969.1", "link": `/${Entities.MIST_METAGENOMES}/${Entities.GENES}`},
            {"queryString": "BN456_00532", "link": `/${Entities.MIST_METAGENOMES}/${Entities.GENES}`}
          ]
        ]
      ])
    ]
  ]);

  private examples: any[];

  constructor(
    private router: Router,
    private store: Store<any>,
    private scopeService: ScopeService,
    private cartChangedService: CartChangedService,
    private toggleChanegsService: ToggleChangedService
  ) {
    super(router);
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      const currentDatabase = super.getCurrentDatabase();
      const currentUrl = this.getCurrentUrl();
      this.changeScopeTo(false);
      this.setExamples();
      if (this.routeToSelectionOption.get(currentDatabase).has(currentUrl)) {
        this.selectedComponent = this.routeToSelectionOption.get(currentDatabase).get(currentUrl);
        this.assignObservables(currentDatabase, currentUrl);
      }
      else
        this.query$ = null;
      // (B)
      // 1) We need to put a genome name to copeService.selectGenomeName
      // in order it to be accessibale to all the places it needed
      // 2) selectScope(...) gets called in order to initiate a search with the new scope.
      // 3) scopeSetFromDetailPage need to be set to null after that,
      // so that a new scope object could be processed when it gets set by a user
      if (this.scopeSetFromDetailPage && this.getCurrentUrl() === `/${currentDatabase}/${Entities.GENES}`) {
        this.scopeService.selectGenomeName(this.scopeSetFromDetailPage.name);
        this.selectScope(this.scopeSetFromDetailPage.refSeqVersion);
        this.scopeSetFromDetailPage = null;
      }
      // Set isSearchPerformed to null when not in search mode
      if (!this.routeToSelectionOption.get(currentDatabase).has(currentUrl)) {
        this.isSearchPerformed$ = null;
      }
      // Finally, update the object database and set styles corresponding to the selected database
      this.database = currentDatabase;
      this.mistSetStyles();
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
    
    // subscribe to database toggle even and make corresponding updates upon even detection
    this.toggleChanegsService.databaseChanged$.subscribe(isChecked => {
      this.databaseChecked = isChecked; 
      this.mistSetDatabase();
    });
    
    this.genesInCart = this.cartChangedService.refreshWebStorageItemCounter(Entities.GENES);
    this.genomesInCart = this.cartChangedService.refreshWebStorageItemCounter(Entities.GENOMES);

    this.cartChangedService.isItemsAddedOrChanged$.subscribe(() => {
      this.genesInCart = this.cartChangedService.refreshWebStorageItemCounter(Entities.GENES);
      this.genomesInCart = this.cartChangedService.refreshWebStorageItemCounter(Entities.GENOMES);
    });
    this.scopeService.selectedScope$.subscribe(selectedScope => this.selectScope(selectedScope));
  }

  setExamples() {
    this.examples = this.entityToExamples.get(super.getCurrentDatabase()).has(this.selectedComponent)
    ? this.entityToExamples.get(super.getCurrentDatabase()).get(this.selectedComponent)
    : null;
  }

  ngAfterContentChecked() {
    // put this.scopeName to the obesrvable in scopeService otherwise it's no accesible if a user selected another
    // entity (Genomes or another future component) and returned back to Genes component
    if (this.scopeName && this.scopeName !== this.scopeSearchTerm)
      this.scopeService.selectGenomeName(this.scopeName);
  }

  putQuery(query: string = this.query) {
    this.router.navigate([this.selectionOptionToRoute.get(super.getCurrentDatabase()).get(this.selectedComponent)]);
    this.changeScopeTo(false);
    this.assignObservables(super.getCurrentDatabase(), this.getCurrentUrl());
    // Don't send repeated requests. We don't use distinctUntilChanged() in SearchInputComponent
    // because the search term can't be deleted in this case by clicking close icon.
    if (query && this.query === query && this.resultRetrievedAndLoaded()) {
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

  mistSwitchDatabaseClicked($event) {
    this.toggleChanegsService.databaseChanged($event.checked);
  }

  mistSetDatabase() {
    this.databaseChecked ? this.database = Entities.MIST_METAGENOMES : this.database = Entities.MIST;
    if (this.selectionOptionToRoute.get(this.database)) {
      this.router.navigate([this.selectionOptionToRoute.get(this.database).get("home")]);
    }
  }
  
  mistSetStyles() {
    if (this.database === Entities.MIST_METAGENOMES) {
      this.databaseChecked = true
      this.dbNameColor["mist-metagenomes"]["color"] = this.dbNameColorActive;
      this.dbNameColor["mist"]["color"] = this.dbNameColorInactive;
    } else {
      this.databaseChecked = false;
      this.dbNameColor["mist"]["color"] = this.dbNameColorActive;
      this.dbNameColor["mist-metagenomes"]["color"] = this.dbNameColorInactive;
    }
    this.databaseSwitchEvent.emit(this.database);
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
    this.router.navigate([this.selectionOptionToRoute.get(super.getCurrentDatabase()).get(this.selectedComponent)]);
  }

  assignObservables(currentDatabase: string, currentUrl: string) {
    this.query$ = null;
    this.scopeName$ = null;
    this.result$ = null;
    if (this.routeToSelectionOption.get(currentDatabase).has(currentUrl)) {
      this.query$ = this.store.select(this.SelectorsQuery.get(this.selectedComponent));
      this.query$.subscribe(query => query ? this.query = query : this.query = null);
      this.scopeName$ = this.SelectorsScope.get(this.selectedComponent) ? this.scopeService.selectedScopeGenomeName$ : null;
      if (this.scopeName$)
        this.scopeName$.subscribe(scopeName => this.scopeName = scopeName);
      if (this.resultAccessible()) {
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
    if (this.router.url) {
      const splittedUrl = this.router.url.split("/");
      if (splittedUrl.length >= 3)
        return `/${splittedUrl[1]}/${splittedUrl[2]}`;
      else if (splittedUrl.length < 3)
        return `/${splittedUrl[1]}`;
    }
    return null;
  }

  private getScope(): string {
    if (this.getCurrentUrl() === this.selectionOptionToRoute.get(super.getCurrentDatabase()).get(Entities.GENES)) {
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

  private resultAccessible() {
    return this.SelectorsResults.has(this.routeToSelectionOption.get(super.getCurrentDatabase()).get(this.getCurrentUrl()));
  }

  // should be called after assignObservables() was called. This happens naturally. Just a warning.
  private resultRetrievedAndLoaded() {
    let isResultLoaded = false;
    if (this.result$)
      this.result$.subscribe(result => { if (result && result.length > 0) isResultLoaded = true });
    return isResultLoaded && this.result$;
  }

}
