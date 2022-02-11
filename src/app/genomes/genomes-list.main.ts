import { Router } from '@angular/router';

import { MistListComponent } from '../core/common/mist-list-component';
import { Entities } from '../core/common/entities';
import { CartChangedService } from '../shop-cart/cart-changed.service';

export abstract class GenomesListMain extends MistListComponent {
  constructor(router: Router, cartChangedService: CartChangedService, isShopCart: boolean = false) {
    super(router, cartChangedService, Entities.GENOMES, isShopCart);
  }
}
