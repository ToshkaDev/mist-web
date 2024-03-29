import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

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
  
  constructor(router: Router, cartChangedService: CartChangedService) {
    super(router, cartChangedService, true);
  }

}
