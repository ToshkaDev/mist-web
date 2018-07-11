import { Component, OnInit, Type} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store, MemoizedSelector} from '@ngrx/store';
import GenomesFilter from '../../../genomes/genomes.filter';
import * as fromGenomes from '../../../genomes/genomes.selectors';
import * as fromGenes from '../../../genes/genes.selectors';
import { State } from '../../../app.reducers';
import { Entities } from '../../common/entities';

import * as MistAction from '../../common/mist-actions';

@Component({
  selector: 'mist-main-menu',
  styleUrls: ['./main-menu.scss'],
  templateUrl: './main-menu.pug',
})
export class MainMenuComponent {
  private query: string;
  private query$: Observable<string>;
  private isFetching$: Observable<boolean>;
  private errorMessage$: Observable<string>;
  private selectedComponent: string = Entities.GENOMES;
  private smallMenuDisplay: any = {'visibility': 'visible'};
  

  private genomesFilter: GenomesFilter = new GenomesFilter(); 

  readonly defaultCurrentPage: number = 1;
  readonly minQueryLenght: number = 2;
  private perPage: number = 30;
  private defaultSelection: string = "defaultValue";
  private selected: string = this.defaultSelection;

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
    //["protein-features", ""],import 'rxjs/add/operator/filter'
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
        {"queryString": "two-component sensor histidine kinase", "link": `/${Entities.GENES}`},
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
    private store: Store<any>
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      let currentUrl = event["urlAfterRedirects"] ? `/${String(event["urlAfterRedirects"]).split("/")[1]}` : null;
      this.smallMenuDisplay['visibility'] = this.routeToSmallMenuDisplay.get(currentUrl);
      if (this.routeToSelectionOption.has(currentUrl)) {
        this.selectedComponent = this.routeToSelectionOption.get(currentUrl);
        console.log("this.selectedComponent " + this.selectedComponent)
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
  }

  putQuery(query: string) { 
    this.query = query;
    this.search();
    this.router.navigate([this.selectionOptionToRoute.get(this.selectedComponent)]);
  }

  search() {
    if (this.query && this.query.length >= this.minQueryLenght) {
      let SEARCH = this.selectionOptionToActionType.get(this.selectedComponent);
      this.store.dispatch(new MistAction.Search(SEARCH, {
        search: this.query, 
        perPage: this.perPage, 
        pageIndex: this.defaultCurrentPage, 
        filter: {}
      }));
    } else {
        let CLEAR = this.selectionOptionToClearActionType.get(this.selectedComponent);
        this.store.dispatch(new MistAction.Clear(CLEAR,{}));
    }
  }

  entityChanged(entity: any) {
    this.selectedComponent = entity.value;
    this.router.navigate([this.selectionOptionToRoute.get(this.selectedComponent)]);
  }

  assignObservables(currentUrl: string) {
    //TODO: will need to change this
    this.routeToSelectionOption.has(currentUrl)
      ? this.query$ = this.store.select(this.SelectorsQuery.get(this.selectedComponent))
      : this.query$ = null;
    this.isFetching$ = this.store.select(this.SelectorsIsFetching.get(this.selectedComponent));
    this.errorMessage$ = this.store.select(this.SelectorsErrorMessage.get(this.selectedComponent));
  }

}
