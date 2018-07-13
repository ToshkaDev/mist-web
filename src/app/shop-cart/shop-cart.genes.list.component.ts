import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { D3Service } from 'd3-ng2-service';
import { CookieService } from 'ngx-cookie-service';

import { GenesListMain } from '../genes/genes-list.main';
import { CookieChangedService } from './cookie-changed.service';


@Component({
  selector: 'shop-cart-genes-list',
  templateUrl: './shop-cart.genes.list.pug',
  styleUrls: ['./shop-cart.genes.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopCartGenesList extends GenesListMain {
  cart = {"add": false, "remove": true};
  constructor(elementRef: ElementRef, d3Service: D3Service, cookieService: CookieService, cookieChangedService: CookieChangedService) {
    super(elementRef, d3Service, cookieService, cookieChangedService)
  }
 
}
