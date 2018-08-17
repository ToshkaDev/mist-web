import { Input, ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import MistDataSource from '../../core/common/mist.datasource';
import { ScopeService } from '../../core/components/main-menu/scope.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'mist-genes-scope-list',
    templateUrl: './genes-scope-list.pug',
    styleUrls: ['./genes-scope-list.scss']
  })
  export class GenesScopeListComponent {
    @Input() displayedColumns: String[];  
    @Input() result: MistDataSource;

    constructor(private scopeService: ScopeService) {
    }

    select(rowVersion) {
      this.scopeService.select(rowVersion);
    }
    
  }