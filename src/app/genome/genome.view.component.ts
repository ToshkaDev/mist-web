import { Component, Input } from '@angular/core';
@Component({
  selector: 'mist-genome-view',
  templateUrl: './genome.view.pug',
  styleUrls: ['./genome.view.component.scss']
})
export class GenomeViewComponent  {
  @Input() genomeViewModel: any;
}