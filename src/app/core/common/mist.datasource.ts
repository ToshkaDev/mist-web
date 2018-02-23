import { DataSource } from '@angular/cdk/collections';
import { State } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export default class MistDataSource extends DataSource<any> {
    constructor(private store: Store<any>, private selector: MemoizedSelector<State, any>) {
      super();
    }
    connect(): Observable<any[]> {
      return this.store.select(this.selector);
    }
    disconnect() {}
}