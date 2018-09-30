import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GenomesListMain } from '../genomes/genomes-list.main';
import { CartChangedService } from './cart-changed.service';

@Component({
  selector: 'shop-cart-genomes-list',
  templateUrl: './shop-cart.genomes.list.pug',
  styleUrls: ['./shop-cart.genomes.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopCartGenomesList extends GenomesListMain {
  readonly cart = {"add": false, "remove": true, "download": false};
  
  constructor(cartChangedService: CartChangedService) {
    super(cartChangedService, true);
  }

}
