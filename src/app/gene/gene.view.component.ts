import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CartChangedService } from '../shop-cart/cart-changed.service';
import { MistSingleComponent } from '../core/common/mist-signle-component';
import { Entities } from '../core/common/entities';

@Component({
  selector: 'mist-gene-view',
  templateUrl: './gene.view.pug',
  styleUrls: ['./gene.view.component.scss']
})
export class GeneViewComponent extends MistSingleComponent {
  @Input() geneViewModel: any;

  constructor(private router: Router, cartChangedService: CartChangedService)  {
    super(router, cartChangedService, Entities.GENES)
  }

}


