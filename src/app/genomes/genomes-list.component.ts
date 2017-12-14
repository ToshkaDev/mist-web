import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() count;
  @Input() perPage;
  @Input() currentPage;

  pageSizeOptions = [5, 10, 30, 100];

  @Output() pageEvent = new EventEmitter<any>();

  pageChanged(pagination: any) {
    this.pageEvent.emit(pagination);
  }

  selected = 'phylum';
}
