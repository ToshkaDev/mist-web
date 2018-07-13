import { CookieService } from 'ngx-cookie-service';

import { MistListComponent } from '../core/common/mist-list-component';
import { Entities } from '../core/common/entities';
import { CookieChangedService } from '../shop-cart/cookie-changed.service';

export abstract class GenomesListMain extends MistListComponent {
  constructor(cookieService: CookieService, cookieChangedService: CookieChangedService) {
    super(cookieService, cookieChangedService, Entities.GENOMES);
  }
}
