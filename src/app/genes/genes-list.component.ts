import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { D3Service } from 'd3-ng2-service';
import { GenesListMain } from './genes-list.main';

@Component({
  selector: 'mist-genes-list',
  templateUrl: './genes-list.pug',
  styleUrls: ['./genes-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenesListComponent extends GenesListMain {
  constructor(elementRef: ElementRef, d3Service: D3Service) {
    super(elementRef, d3Service)
  }
}
