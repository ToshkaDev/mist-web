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
export class ShopCartComponent  {
  isGenomesActive = true;
  isGenesActive = false;
  genomesCookieIsSet = false;
  genesCookieIsSet = false;
  
  constructor(private cookieService: CookieService, private cookieChangedService: CookieChangedService) {
    //this.cookieChangedService.cookieChanged$.subscribe(message => this.setCookieBooleans());
    this.setCookieBooleans()
    this.cookieChangedService.cookieChanged$.subscribe(message => this.setCookieBooleans());
  }

  // ngOnInit() {
  //   console.log("GENOMES cookie  " + this.cookieService.get(`mist_Database-${Entities.GENOMES}`))
  //   console.log("GENES cookie  " + this.cookieService.get(`mist_Database-${Entities.GENES}`))
    
  //   this.setCookieBooleans();
  // }

  setCookieBooleans() {
    console.log("GENOMES cookie  " + this.cookieService.get(`mist_Database-${Entities.GENOMES}`))
    console.log("GENES cookie  " + this.cookieService.get(`mist_Database-${Entities.GENES}`))

    this.cookieService.check(`mist_Database-${Entities.GENOMES}`)
      ? this.genomesCookieIsSet = true
      : this.genomesCookieIsSet = false;
    this.cookieService.check(`mist_Database-${Entities.GENES}`)
      ? this.genesCookieIsSet = true
      : this.genesCookieIsSet = false;
  }

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