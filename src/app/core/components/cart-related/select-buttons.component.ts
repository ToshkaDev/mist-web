import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cart-select-buttons',
  styleUrls: ['./select-buttons.scss'],
  templateUrl: './select-buttons.pug',
})
export class SelectButtonsComponent {
    @Output() selectClickEvent = new EventEmitter<any>();
    @Input() cart: any;
    @Input() idsForShopCart: string[];
    isAddDisabled = false;
        
    buttonClicked(event: any) {
      this.selectClickEvent.emit(event);
    }
}