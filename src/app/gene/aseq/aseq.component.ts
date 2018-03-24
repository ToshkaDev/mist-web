import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { FetchDomains } from '../gene.actions';
import * as fromGenes from '../gene.selectors';
import GeneView from '../gene.view.model';
import { Aseq } from '../../core/common/aseq';

@Component({
    selector: 'mist-aseq',
    templateUrl: './aseq.pug',
  })
export class AseqComponent implements OnInit {
    @Input() private gene$: Observable<any>;
    private errorMessage$: Observable<string>;
    private aseqData$: Observable<any>;
    private neighbourGenes$: Observable<any[]>;
    private geneViewModel: GeneView;
 

    constructor(private store: Store<any>) {
    }

    ngOnInit() {
        this.errorMessage$ = this.store.select(fromGenes.getFetchErrorMessage);
        this.aseqData$ = this.store.select(fromGenes.getDomains);
        this.gene$.skip(1).take(1).subscribe(result => result ? this.getDomains(result.aseq_id) : null);
        this.aseqData$.subscribe(res => console.log("res " + JSON.stringify(res)));
    }
    
    getDomains(query: string) {
        this.store.dispatch(new FetchDomains(query));
    }

}