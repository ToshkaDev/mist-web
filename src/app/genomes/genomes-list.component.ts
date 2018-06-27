import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Selectable } from '../core/components/cart-related/selectable';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes-list',
  templateUrl: './genomes-list.pug',
  styleUrls: ['./genomes-list.scss']
})
export class GenomesListComponent implements Selectable {
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
