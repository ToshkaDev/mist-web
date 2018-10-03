import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Entities } from '../../core/common/entities';
import * as MistAction from '../../core/common/mist-actions';
import { MistComponent } from '../../core/common/mist-component';
import * as fromSignalGenes from './signal_genes.selectors';

@Component({
  selector: 'mist-signal-genes',
  templateUrl: './signal-genes.pug',
})
export class SignalGenesComponent extends MistComponent implements OnInit {
  static readonly signalGenesColumns = [];

  private assemblyVersion;
  private queryParams = this.route.snapshot.queryParams;

  constructor(store: Store<any>, private route: ActivatedRoute) {
    super(store, fromSignalGenes, SignalGenesComponent.signalGenesColumns, Entities.SIGNAL_GENES);
    this.sendQuery();
  }

  getByRanks(filter: any) {
    super.getStore().dispatch(new MistAction.GetByRanks(MistAction.GETBY_RANKS_SIGNAL_GENES, {
      search: this.assemblyVersion,
      scope: null,
      perPage: this.perPage,
      pageIndex: this.defaultCurrentPage,
      filter: filter
    }));
  }

  sendQuery() {
    this.assemblyVersion = this.route.snapshot.paramMap.get('version');
    let filter = { "ranks": "tcp,hk", "componentId": "14" };
    this.getByRanks(filter);
  }
}