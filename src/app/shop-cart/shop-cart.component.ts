import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Entities } from '../core/common/entities';
import { CartChangedService } from './cart-changed.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-shop-cart',
  styleUrls: ['./shop-cart.scss'],
  templateUrl: './shop-cart.pug',
})
export class ShopCartComponent implements OnInit {
  isGenomesActive = true;
  isGenesActive = false;
  genomesCartElementsIsSet = false;
  genesCartElementsIsSet = false;
  readonly buttonColor = '#b2c798';
  readonly selectedButtonColor = '#96c75c';
  readonly buttonTextColor = 'white';
  private buttonStyle = {'background-color': this.buttonColor, 'color': this.buttonTextColor};
  private styles = {
    'genomes': {...this.buttonStyle, 'background-color': this.selectedButtonColor}, 
    'genes': {...this.buttonStyle}
  };
  
  constructor(private cartChangedService: CartChangedService) {
  }

  ngOnInit() {
    this.setShopCartBooleans();
    this.cartChangedService.cartChanged$.subscribe(() => {
      let genomesCartElementsIsSetOld = this.genomesCartElementsIsSet;
      let genesCartElementsIsSetOld = this.genesCartElementsIsSet;
      this.setShopCartBooleans();
      if (genomesCartElementsIsSetOld && !this.genomesCartElementsIsSet && this.genesCartElementsIsSet) {
        this.buttonClicked(Entities.GENES);
      } else if (genesCartElementsIsSetOld && !this.genesCartElementsIsSet && this.genomesCartElementsIsSet) {
        this.buttonClicked(Entities.GENOMES);
      }
    });
  }

  setShopCartBooleans() {
    this.genomesCartElementsIsSet = this.cartChangedService.webStorageItemIsSet(Entities.GENOMES);
    if (!this.genomesCartElementsIsSet) {
      this.isGenomesActive = false;
      this.isGenesActive = true;
      this.styles.genes["background-color"] = this.selectedButtonColor;
      this.styles.genomes["background-color"] = this.buttonColor;
    }
    this.genesCartElementsIsSet = this.cartChangedService.webStorageItemIsSet(Entities.GENES);
  }

  buttonClicked(entity: string) {
    if (entity == Entities.GENOMES) {
      this.isGenomesActive = true;
      this.isGenesActive = false;
      this.styles.genomes["background-color"] = this.selectedButtonColor;
      this.styles.genes["background-color"] = this.buttonColor;
    }
    else if (entity == Entities.GENES) {
      this.isGenesActive = true;
      this.isGenomesActive = false;
      this.styles.genes["background-color"] = this.selectedButtonColor;
      this.styles.genomes["background-color"] = this.buttonColor;
    }
  }
 
}