import { Component, EventEmitter, Input, Output } from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'mist-search-input',
  styleUrls: ['./search-input.scss'],
  templateUrl: './search-input.pug',
})
export class SearchInputComponent {
  queryChange$ = new EventEmitter<string>();
  scopeChange$ = new EventEmitter<string>();
  scope_placeholder = "Scope";
  
  @Input() scopeIdentifier;
  @Input() selectedComponent;
  @Input() query = '';
  @Input() scope = '';
  @Input() errorMessage = '';
  @Input() isFetching = false;
  @Input() isFetchingScope = false;
  @Output() onQueryChange = this.queryChange$.map((value) => value.trim());
  @Output() onScopeChange = this.scopeChange$.map((value) => value.trim());
}
