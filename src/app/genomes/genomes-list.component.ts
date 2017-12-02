import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes-list',
  templateUrl: './genomes-list.pug',
  styleUrls: ['./genomes-list.scss']
})
export class GenomesListComponent {
  @Input() displayedColumns: String[];  
  @Input() genomes: DataSource<any>;
}
