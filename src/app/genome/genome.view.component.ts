import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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
  private showBioSampleDetails: boolean = false;
  readonly arrowObject = {0: "keyboard_arrow_downc", 1:  "keyboard_arrow_upc"};
  private arrow = "keyboard_arrow_downc";

  constructor(private router: Router, private scopeService: ScopeService, cartChangedService: CartChangedService)  {
    super(router, cartChangedService, Entities.GENOMES)
  }

  private putScope(event: any) {
    this.scopeService.putScope(event);
  }

  private toggleBioSampleDetails(show: boolean = false) {
    show ? this.showBioSampleDetails = true : this.showBioSampleDetails = !this.showBioSampleDetails;
    this.arrow = this.arrowObject[+this.showBioSampleDetails];
}

}