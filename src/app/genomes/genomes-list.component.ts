import { Input, Output, EventEmitter, ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import { GenomesListMain } from './genomes-list.main';
import { CartChangedService } from '../shop-cart/cart-changed.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes-list',
  templateUrl: './genomes-list.pug',
  styleUrls: ['./genomes-list.scss']
})
export class GenomesListComponent extends GenomesListMain {
  @Input() selected: string;

  @Output() taxonomyEvent = new EventEmitter<any>();
  constructor(router: Router, cartChangedService: CartChangedService) {
    super(router, cartChangedService);
  }

  taxonomyChanged(taxon: any) {
    this.taxonomyEvent.emit(taxon);
  }
}
