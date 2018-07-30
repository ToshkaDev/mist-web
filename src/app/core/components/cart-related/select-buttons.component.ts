import { Component, EventEmitter, Input, Output, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'cart-select-buttons',
  styleUrls: ['./select-buttons.scss'],
  templateUrl: './select-buttons.pug',
})
export class SelectButtonsComponent implements AfterContentChecked {
    @Output() selectClickEvent = new EventEmitter<any>();
    @Input() cart: any;
    @Input() idsForShopCart: string[];
    isAddDisabled = false;
        
    buttonClicked(event: any) {
      this.selectClickEvent.emit(event);
    }

    ngAfterContentChecked() {


    }

}