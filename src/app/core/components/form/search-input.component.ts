import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mist-search-input',
  templateUrl: './search-input.pug',
})
export class SearchInputComponent {
  @Input() query = '';
  @Input() errorMessage = '';
  @Input() isFetching = false;
  @Output() onQueryChange = new EventEmitter<string>();
}
