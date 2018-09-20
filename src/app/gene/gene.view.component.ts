import { Component, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { CookieChangedService } from '../shop-cart/cookie-changed.service';
import { MistSingleComponent } from '../core/common/mist-signle-component';
import { Entities } from '../core/common/entities';

@Component({
  selector: 'mist-gene-view',
  templateUrl: './gene.view.pug',
  styleUrls: ['./gene.view.component.scss']
})
export class GeneViewComponent extends MistSingleComponent {
  @Input() geneViewModel: any;

  constructor(cookieService: CookieService, cookieChangedService: CookieChangedService)  {
    super(cookieService, cookieChangedService, Entities.GENES)
  }

}


