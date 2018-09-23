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
  genomesCookieIsSet = false;
  genesCookieIsSet = false;
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
    this.setCookieBooleans();
    this.cartChangedService.cookieChanged$.subscribe(() => {
      let genomesCookieIsSetOld = this.genomesCookieIsSet;
      let genesCookieIsSetOld = this.genesCookieIsSet;
      this.setCookieBooleans();
      if (genomesCookieIsSetOld && !this.genomesCookieIsSet && this.genesCookieIsSet) {
        this.buttonClicked(Entities.GENES);
      } else if (genesCookieIsSetOld && !this.genesCookieIsSet && this.genomesCookieIsSet) {
        this.buttonClicked(Entities.GENOMES);
      }
    });
  }

  setCookieBooleans() {
    this.genomesCookieIsSet = this.cartChangedService.webStorageItemIsSet(Entities.GENOMES);
    if (!this.genomesCookieIsSet) {
      this.isGenomesActive = false;
      this.isGenesActive = true;
      this.styles.genes["background-color"] = this.selectedButtonColor;
      this.styles.genomes["background-color"] = this.buttonColor;
    }
    this.genesCookieIsSet = this.cartChangedService.webStorageItemIsSet(Entities.GENES);
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