import { CookieService } from 'ngx-cookie-service';

import { Input, Output, EventEmitter, ChangeDetectionStrategy, Component } from '@angular/core';
import { GenomesListMain } from './genomes-list.main';
import { CookieChangedService } from '../shop-cart/cookie-changed.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes-list',
  templateUrl: './genomes-list.pug',
  styleUrls: ['./genomes-list.scss']
})
export class GenomesListComponent extends GenomesListMain {
  @Input() selected: string;
  @Output() taxonomyEvent = new EventEmitter<any>();
  cart = {"add": true, "remove": false};

  constructor(cookieService: CookieService, cookieChangedService: CookieChangedService) {
    super(cookieService, cookieChangedService);
  }

  taxonomyChanged(taxon: any) {
    this.taxonomyEvent.emit(taxon);
  }

}
