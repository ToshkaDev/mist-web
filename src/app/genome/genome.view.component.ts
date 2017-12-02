import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({
  selector: 'mist-genome-view',
  templateUrl: './genome.view.component.pug',
})
export class GenomeViewComponent  {
  @Input() genome: string[];
}
