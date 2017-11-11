import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes-list',
  templateUrl: './genomes-list.pug',
})
export class GenomesListComponent {
  @Input() genomes: any[] = [];
}
