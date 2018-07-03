import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { D3Service } from 'd3-ng2-service';
import { GenesListMain } from '../genes/genes-list.main';

@Component({
  selector: 'shop-cart-genes-list',
  templateUrl: './shop-cart.genes.list.pug',
  styleUrls: ['./shop-cart.genes.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopCartGenesList extends GenesListMain {
  constructor(elementRef: ElementRef, d3Service: D3Service) {
    super(elementRef, d3Service)
  }
 
}
