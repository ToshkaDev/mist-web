import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-gene-view',
  templateUrl: './gene.view.pug',
  styleUrls: ['./gene.view.component.scss']
})
export class GeneViewComponent {
  @Input() geneViewModel: any;
}


