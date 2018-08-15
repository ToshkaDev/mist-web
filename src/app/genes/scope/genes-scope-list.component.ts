import { Input, Output, EventEmitter, ChangeDetectionStrategy, Component } from '@angular/core';
import MistDataSource from '../../core/common/mist.datasource';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'mist-genes-scope-list',
    templateUrl: './genes-scope-list.pug',
    styleUrls: ['./genes-scope-list.scss']
  })
  export class GenesScopeListComponent {
    @Input() displayedColumns: String[];  
    @Input() result: MistDataSource;
  }