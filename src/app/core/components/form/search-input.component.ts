import { Component, EventEmitter, Input, Output } from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'mist-search-input',
  styleUrls: ['./search-input.scss'],
  templateUrl: './search-input.pug',
})
export class SearchInputComponent {
  queryChange$ = new EventEmitter<string>();

  @Input() query = '';
  @Input() errorMessage = '';
  @Input() isFetching = false;
  @Output() onQueryChange = this.queryChange$.map((value) => value.trim()).distinctUntilChanged();
  
  clear() {
    this.query = '';
  }
}
