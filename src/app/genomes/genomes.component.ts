import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/from';
import { Search } from './genomes.actions';
import GenomesFilter from './genomes.filter';
import { GenomesMain } from './genomes.main';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes',
  styleUrls: ['./genomes.scss'],
  templateUrl: './genomes.pug',
})
export class GenomesComponent extends GenomesMain {
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
  private genomesFilter: GenomesFilter = new GenomesFilter(); 

  constructor(store: Store<any>) {
    super(store);
  }

  search(query: string) {
    super.getStore().dispatch(new Search({
      search: query, 
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
    this.query$.subscribe(searchterm => this.search(searchterm)).unsubscribe();
  }

  filter() {
    this.query$.subscribe(query => this.search(query)).unsubscribe();
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