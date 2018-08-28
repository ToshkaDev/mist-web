import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { Entities } from '../core/common/entities';
import { CookieChangedService } from './cookie-changed.service';

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
  
  constructor(private cookieService: CookieService, private cookieChangedService: CookieChangedService) {
  }

  ngOnInit() {
    this.setCookieBooleans();
    this.cookieChangedService.cookieChanged$.subscribe(message => {
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
    this.genomesCookieIsSet = this.cookieService.check(`mist_Database-${Entities.GENOMES}`);
    if (!this.genomesCookieIsSet) {
      this.isGenomesActive = false;
      this.isGenesActive = true;
      this.styles.genes["background-color"] = this.selectedButtonColor;
      this.styles.genomes["background-color"] = this.buttonColor;
    }
    this.genesCookieIsSet = this.cookieService.check(`mist_Database-${Entities.GENES}`);
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