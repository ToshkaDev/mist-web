import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Entities } from '../core/common/entities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-shop-cart',
  styleUrls: ['./shop-cart.scss'],
  templateUrl: './shop-cart.pug',
})
export class ShopCartComponent  {
  private isGenomesActive = true;
  private isGenesActive = false;

  
  buttonClicked(entity: string) {
    if (entity == Entities.GENOMES) {
      this.isGenomesActive = true;
      this.isGenesActive = false;
    }
    else if (entity == Entities.GENES) {
      this.isGenesActive = true;
      this.isGenomesActive = false;
    }
  }
 
}