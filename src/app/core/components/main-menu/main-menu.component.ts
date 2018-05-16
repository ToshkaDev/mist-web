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
import { Clear as ClearGenomes } from '../../../genomes/genomes.actions';
import { Clear as ClearGenes } from '../../../genes/genes.actions';
import { Entities } from '../../common/entities';

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
  readonly minQueryLenght: number = 1;
  private perPage: number = 30;
  private defaultSelection: string = "defaultValue";
  private selected: string = this.defaultSelection;

  private routeToSmallMenuDisplay = new Map<string, string>([
    ["/", "visible"],
    ["/help", "visible"],
    ["/member-genomes", "hidden"],
    ["/api", "hidden"],
    [`/${Entities.GENOMES}`, "hidden"],
    [`/${Entities.GENES}`, "hidden"],
    //["/protein-features", ""],
    //["/taxonomy", ""]
  ]);

  private selectionOptionToRoute = new Map<string, string>([
    [Entities.GENOMES, `/${Entities.GENOMES}`],
    [Entities.GENES, `/${Entities.GENES}`],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);
  
  private routeToSelectionOption = new Map<string, string>([
    [`/${Entities.GENOMES}`, Entities.GENOMES],
    [`/${Entities.GENES}`, Entities.GENES],
    //["/protein-features", ""],
    //["/taxonomy", ""]
  ]);

  private selectionOptionToAction = new Map<string, Type<Action>>([
    [Entities.GENOMES, SearchGenomes],
    [Entities.GENES, SearchGenes],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);

  private selectionOptionToClearAction = new Map<string, Type<Action>>([
    [Entities.GENOMES, ClearGenomes],
    [Entities.GENES, ClearGenes],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);

  private SelectorsQuery = new Map<string, MemoizedSelector<State, string>>([
    [Entities.GENOMES, fromGenomes.getSearchQuery],
    [Entities.GENES, fromGenes.getSearchQuery],
    //["protein-features", ""],import 'rxjs/add/operator/filter'
    //["taxonomy", ""]
  ]);

  private SelectorsIsFetching = new Map<string, MemoizedSelector<State, boolean>>([
    [Entities.GENOMES, fromGenomes.getSearchIsFetching],
    [Entities.GENES, fromGenes.getSearchIsFetching],
    //["protein-features", ""],
    //["taxonomy", ""]
  ]);
  
  private SelectorsErrorMessage = new Map<string, MemoizedSelector<State, string>>([
    [Entities.GENOMES, fromGenomes.getSearchErrorMessage],
    [Entities.GENES, fromGenes.getSearchErrorMessage],
    //["protein-features", ""],
    //["taxonomy", ""]
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
      if (Array.from(this.routeToSelectionOption.keys()).includes(currentUrl)) {
        this.selectedComponent = this.routeToSelectionOption.get(currentUrl);
        this.assignObservables();
        this.examples = this.entityToExamples.has(this.selectedComponent) 
          ? this.entityToExamples.get(this.selectedComponent) 
          : null; 
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
      let Search = this.selectionOptionToAction.get(this.selectedComponent);
      this.store.dispatch(new Search({
        search: this.query, 
        perPage: this.perPage, 
        pageIndex: this.defaultCurrentPage, 
        filter: {}
      }));
    } else {
        let Clear = this.selectionOptionToClearAction.get(this.selectedComponent);
        this.store.dispatch(new Clear());
    }
  }

  entityChanged(entity: any) {
    this.selectedComponent = entity.value;
    this.router.navigate([this.selectionOptionToRoute.get(this.selectedComponent)]);
  }

  assignObservables() {
    this.query$ = this.store.select(this.SelectorsQuery.get(this.selectedComponent));
    this.isFetching$ = this.store.select(this.SelectorsIsFetching.get(this.selectedComponent));
    this.errorMessage$ = this.store.select(this.SelectorsErrorMessage.get(this.selectedComponent));
  }

}
