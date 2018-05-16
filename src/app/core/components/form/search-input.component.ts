import { Component, EventEmitter, Input, Output } from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';
import { Entities } from '../../common/entities';

@Component({
  selector: 'mist-search-input',
  styleUrls: ['./search-input.scss'],
  templateUrl: './search-input.pug',
})
export class SearchInputComponent {
  queryChange$ = new EventEmitter<string>();
  static readonly deafultEntity = 'genomes'; 

  @Input() query = '';
  @Input() errorMessage = '';
  @Input() isFetching = false;
  @Output() onQueryChange = this.queryChange$.map((value) => value.trim()).distinctUntilChanged();
  
  clear() {
    this.query = '';
  }
}
