import { Component, Input } from '@angular/core';

import { CartChangedService } from '../shop-cart/cart-changed.service';
import { MistSingleComponent } from '../core/common/mist-signle-component';
import { Entities } from '../core/common/entities';
import { ScopeService } from '../core/components/main-menu/scope.service';

@Component({
  selector: 'mist-genome-view',
  templateUrl: './genome.view.pug',
  styleUrls: ['./genome.view.component.scss']
})
export class GenomeViewComponent extends MistSingleComponent {
  @Input() genomeViewModel: any;

  constructor(private scopeService: ScopeService, cartChangedService: CartChangedService)  {
    super(cartChangedService, Entities.GENOMES)
  }

  private putScope(event: any) {
    this.scopeService.putScope(event);
  }

}