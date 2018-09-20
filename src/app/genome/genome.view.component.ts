import { Component, Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


import { CookieChangedService } from '../shop-cart/cookie-changed.service';
import { MistSingleComponent } from '../core/common/mist-signle-component';
import { Entities } from '../core/common/entities';
@Component({
  selector: 'mist-genome-view',
  templateUrl: './genome.view.pug',
  styleUrls: ['./genome.view.component.scss']
})
export class GenomeViewComponent extends MistSingleComponent {
  @Input() genomeViewModel: any;

  constructor(cookieService: CookieService, cookieChangedService: CookieChangedService)  {
    super(cookieService, cookieChangedService, Entities.GENOMES)
  }
}