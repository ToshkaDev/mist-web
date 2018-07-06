import { CookieService } from 'ngx-cookie-service';

import { MistListComponent } from '../core/common/mist-list-component';
import { Entities } from '../core/common/entities';

export abstract class GenomesListMain extends MistListComponent {
  constructor(cookieService: CookieService) {
    super(cookieService, Entities.GENOMES);
  }
}
