import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { D3Service } from 'd3-ng2-service';
import { GenomesListMain } from '../genomes/genomes-list.main';

@Component({
  selector: 'shop-cart-genomes-list',
  templateUrl: './shop-cart.genomes.list.pug',
  styleUrls: ['./shop-cart.genomes.list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopCartGenomesList extends GenomesListMain {

}
