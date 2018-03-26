import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genes-list',
  templateUrl: './genes-list.pug',
  styleUrls: ['./genes-list.scss']
})
export class GenesListComponent { 
  @Input() displayedColumns: String[];  
  @Input() genes: DataSource<any>;
  @Input() query: string;
}
