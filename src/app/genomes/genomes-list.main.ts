import { Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Selectable } from '../core/components/cart-related/selectable';

export class GenomesListMain implements Selectable {
  @Input() displayedColumns: String[];  
  @Input() genomes: DataSource<any>;
  @Input() query: string;
  @Input() selected: string;
  @Output() taxonomyEvent = new EventEmitter<any>();

  checked: string = null;
  
  taxonomyChanged(taxon: any) {
    this.taxonomyEvent.emit(taxon);
  }

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
