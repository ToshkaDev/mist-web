import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/take';
import { Search } from './genes.actions';
import GenesFilter from './genes.filter';
import { GenesMain } from './genes.main';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'mist-genes',
    styleUrls: ['./genes.scss'],
    templateUrl: './genes.pug',
  })
export class GenesComponent extends GenesMain {

  private genesFilter: GenesFilter = new GenesFilter(); 

  constructor(store: Store<any>) {
    super(store);
  }

  search(query: string) {
    super.getStore().dispatch(new Search({
      search: query, 
      perPage: this.perPage, 
      pageIndex: this.defaultCurrentPage, 
      filter: {}
    }));
  }

  initialyzeFilter() {
    //No filter in genes yet
    return null;
  }
  
  sendQuery() {
    this.query$.subscribe(searchterm => this.search(searchterm)).unsubscribe();
  }

  checkQuery() {
    let filter: GenesFilter;
    this.query$.subscribe(searchterm => {
      if (searchterm && searchterm.length >= this.minQueryLenght) {
        filter = Object.assign(new GenesFilter(), this.genesFilter)
      } else {
          filter = Object.assign(new GenesFilter(), this.genesFilter.reset());
      }
    }).unsubscribe();
    return filter;
  }

  //Implement when will need
  filter() {}
  
  //Implement when will need
  reset() {}
}