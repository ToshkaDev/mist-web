import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { D3Service } from 'd3-ng2-service';

import { GenesListMain } from '../genes/genes-list.main';
import { CartChangedService } from './cart-changed.service';
import { ToggleChangedService } from '../core/components/protein-feature-toggle/toggle-changed.service';


@Component({
  selector: 'shop-cart-genes-list',
  templateUrl: './shop-cart.genes.list.pug',
  styleUrls: ['./shop-cart.genes.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopCartGenesList extends GenesListMain {
  constructor(elementRef: ElementRef, d3Service: D3Service, cartChangedService: CartChangedService, toggleChangedService: ToggleChangedService) {
    super(elementRef, d3Service, cartChangedService, toggleChangedService, true)
  }
 
}
