import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cart-select-buttons',
  styleUrls: ['./select-buttons.scss'],
  templateUrl: './select-buttons.pug',
})
export class SelectButtonsComponent {
    @Output() selectClickEvent = new EventEmitter<any>();
        
    buttonClicked(event: any) {
      this.selectClickEvent.emit(event);
    }
}