import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { GenomesListMain } from '../genomes/genomes-list.main';

@Component({
  selector: 'shop-cart-genomes-list',
  templateUrl: './shop-cart.genomes.list.pug',
  styleUrls: ['./shop-cart.genomes.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopCartGenomesList extends GenomesListMain {
  cart = {"add": false, "remove": true};
  constructor(cookieService: CookieService) {
    super(cookieService);
  }

}
