import { ChangeDetectionStrategy, Component, Input, AfterContentChecked } from '@angular/core';
@Component({
  selector: 'mist-genome-view',
  templateUrl: './genome.view.component.pug',
  styleUrls: ['./genome.view.component.scss']
})
export class GenomeViewComponent  {
  @Input() genomeViewModel: any;
}