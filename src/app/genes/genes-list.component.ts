import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { D3Service } from 'd3-ng2-service';
import { CookieService } from 'ngx-cookie-service';

import { GenesListMain } from './genes-list.main';
import { CookieChangedService } from '../shop-cart/cookie-changed.service';

@Component({
  selector: 'mist-genes-list',
  templateUrl: './genes-list.pug',
  styleUrls: ['./genes-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenesListComponent extends GenesListMain {
  cart = {"add": true, "remove": false};
  constructor(elementRef: ElementRef, d3Service: D3Service, cookieService: CookieService, cookieChangedService: CookieChangedService) {
    super(elementRef, d3Service, cookieService, cookieChangedService)
  }
}
