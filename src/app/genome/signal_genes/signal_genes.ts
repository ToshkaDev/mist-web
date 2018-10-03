import { OnInit, Component } from "@angular/core";
import { Store } from "@ngrx/store";

import { MistComponent } from "../../core/common/mist-component";
import { Entities } from "../../core/common/entities";
import * as fromSignalGenes from './signal_genes.selectors';
import * as MistAction from '../../core/common/mist-actions';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'mist-signal-genes',
    templateUrl: './signal-genes.pug',
  })
export class SignalGenes extends MistComponent {

    static readonly signalGenesColumns = [];
    private assemblyVersion;

    constructor(store: Store<any>, private route: ActivatedRoute) {
        super(store, fromSignalGenes, SignalGenes.signalGenesColumns, Entities.SIGNAL_GENES);
        this.sendQuery()
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
        let filter  = {"ranks": "tcp,hk", "componentId": "14"};
        this.getByRanks(filter);
    }
    
}