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
  @Input() length = 100;
  @Input() pageSize = 30;
  @Input() pageSizeOptions = [5, 10, 30, 100];

  selected = 'phylum';
}
