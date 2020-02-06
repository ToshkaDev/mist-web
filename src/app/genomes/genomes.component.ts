import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/from';
import GenomesFilter from './genomes.filter';
import { MistComponent } from '../core/common/mist-component';
import * as fromGenomes from './genomes.selectors';
import { Entities } from '../core/common/entities';

import * as MistAction from '../core/common/mist-actions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes',
  templateUrl: './genomes.pug',
})
export class GenomesComponent extends MistComponent {
  private defaultSelection: string = "defaultValue";
  private selected: string = this.defaultSelection;
  private genomesFilter: GenomesFilter = new GenomesFilter();
  readonly taxonomyMap: Map<number,string> = new Map()
    .set(1,"superkingdom")
    .set(2,"phylum")
    .set(3,"clazz")
    .set(4,"order")
    .set(5,"family")
    .set(6,"genus");
  readonly asemblyFilterOptions = [
    {'value':'Complete Genome', 'viewValue' : 'Complete Genome'}, 
    {'value':'Chromosome', 'viewValue' : 'Chromosome'},
    {'value':'Scaffold', 'viewValue' : 'Scaffold'}, 
    {'value':'Contig', 'viewValue' : 'Contig'}];
  static readonly genomesColumns = ['Select', 'Genome', 'Superkingdom', 'Taxonomy Id', 'Taxonomy', 'Version', 'Assembly level'];
  filterClass = "two columns";
  filterStyle;

  constructor(store: Store<any>) {
    super(store, fromGenomes, GenomesComponent.genomesColumns, Entities.GENOMES);
    this.onWindowResize();
  } 


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (window.innerWidth <= 1155) {
      this.filterClass = "eight columns"; 
      this.filterStyle = {"margin-left": "7%"};
    } else {
      this.filterClass = "two columns"; 
      this.filterStyle = null;
    }

  }

  search(query: string, scope: string) {
    super.getStore().dispatch(new MistAction.Search(MistAction.SEARCH_GENOMES, {
      search: query,
      scope: scope, 
      perPage: this.perPage, 
      pageIndex: this.defaultCurrentPage, 
      filter: this.checkQuery()
    }));
  }

  initialyzeFilter() {
    let filter: GenomesFilter;
    this.query$.subscribe(searchterm => searchterm ? filter=this.checkQuery() : null).unsubscribe();
    return filter;
  }
  
  sendQuery() {
    let scope, searchterm;
    this.query$.subscribe(currentSearchterm => searchterm = currentSearchterm).unsubscribe();
    this.scope$.subscribe(currentScope => scope = currentScope).unsubscribe();
    this.search(searchterm, scope);
  }

  filter() {
    this.sendQuery();
    this.selected = this.genomesFilter.getMostSpecificLevel().trim();
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