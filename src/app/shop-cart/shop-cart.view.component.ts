import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Selectable } from '../core/components/cart-related/selectable';
import { DataSource } from '@angular/cdk/collections';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-shop-cart-view',
  templateUrl: './shop-cart.view.pug',
  styleUrls: ['./shop-cart.view.component.scss']
})
export class ShopCartViewComponent implements Selectable {
    @Input() genomesDisplayedColumns: String[];  
    @Input() genesDisplayedColumns: String[]; 
    @Input() genomesDataSource: DataSource<any>;
    @Input() genesDataSource: DataSource<any>;
    @Input() selected: string;

    checked: string = null;
    
    onSelectClickEvent(event: any) {
      switch(event) { 
        case 'selectAll': { 
          this.selectAll(); 
          break; 
        } 
        case 'unselectAll': { 
          this.unselectAll(); 
          break; 
        } 
        case 'addToCart': { 
          this.addToCart();
          break; 
       } 
        default: { 
          console.log("Something went wrong in onSelectClickEvent(event)"); 
          break; 
        } 
      } 
    }
  
    selectAll() {
      this.checked = 'checked';
    }
  
    unselectAll() {
      this.checked = null;
    }
  
    addToCart() {
  
    }
  
}


