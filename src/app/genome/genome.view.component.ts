import { ChangeDetectionStrategy, Component, Input, AfterContentChecked } from '@angular/core';
@Component({
  selector: 'mist-genome-view',
  templateUrl: './genome.view.component.pug',
})
export class GenomeViewComponent implements AfterContentChecked {
  @Input() genome: any;
  genomeTaxonomy: string[];

  ngAfterContentChecked() {
    if (this.genome) {
        this.genomeTaxonomy = [
          this.genome.superkingdom, 
          this.genome.phylum, 
          this.genome.class,
          this.genome.order,
          this.genome.family,
          this.genome.genus,
          this.genome.strain];
    }

  }
}