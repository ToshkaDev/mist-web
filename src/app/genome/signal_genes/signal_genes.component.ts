import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Entities } from '../../core/common/entities';
import * as MistAction from '../../core/common/mist-actions';
import { MistComponent } from '../../core/common/mist-component';
import * as fromSignalGenes from './signal_genes.selectors';
import { Filter } from '../../core/common/navigation';
import { ToggleChangedService } from '../../core/components/protein-feature-toggle/toggle-changed.service';

export default class SignalGenesFilter implements Filter {
  constructor(public ranks, public componentId, public kind, public stFunction) {}
  reset() {}
}

@Component({
  selector: 'mist-signal-genes',
  templateUrl: './signal-genes.pug',
})
export class SignalGenesComponent extends MistComponent {
  static readonly signalGenesColumns: string[] = [
    "Select",
    "Mist Id",
    "Protein Id",
    "Domain Structure",
    "Type",
    "Locus",
    "Description",
  ];

  private assemblyVersion = this.route.snapshot.paramMap.get('version');
  private queryParams = this.route.snapshot.queryParams;
  private isLcrChecked = false;
  private isCoiledCoilsChecked = false;
  
  constructor(store: Store<any>, private route: ActivatedRoute, private toggleChanegsService: ToggleChangedService) {
    super(store, fromSignalGenes, SignalGenesComponent.signalGenesColumns, Entities.SIGNAL_GENES);
    this.toggleChanegsService.lcrChanged$.subscribe(isChecked => this.isLcrChecked = isChecked);
    this.toggleChanegsService.coiledCoilsChanged$.subscribe(isChecked => this.isCoiledCoilsChecked = isChecked);
    this.sendQuery();
  }

  sendQuery(): void {
    super.getStore().dispatch(new MistAction.GetSignalGenes(MistAction.GET_SIGNAL_GENES, {
      search: this.assemblyVersion,
      scope: null,
      perPage: this.perPage,
      pageIndex: this.defaultCurrentPage,
      filter: this.initialyzeFilter(),
    }));
  }

  initialyzeFilter(): Filter {
    return new SignalGenesFilter(
      this.queryParams.ranks,
      this.queryParams.componentId,
      this.queryParams.kind,
      this.queryParams.function,
    );
  }
}
