import { ChangeDetectionStrategy, Component } from '@angular/core';

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
    if (entity == "genomes") {
      this.isGenomesActive = true;
      this.isGenesActive = false;
    }
    else if (entity == "genes") {
      this.isGenesActive = true;
      this.isGenomesActive = false;
    }
  }
 
}