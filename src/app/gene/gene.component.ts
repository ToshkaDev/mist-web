import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FetchGene } from './gene.actions';
import * as fromGenes from './gene.selectors';
import GeneView from './gene.view.model';

@Component({
    selector: 'mist-gene',
    templateUrl: './gene.pug',
  })
export class GeneComponent implements OnInit {
    private geneStableId: string;
    private errorMessage$: Observable<string>;
    private gene$: Observable<any>;
    private geneViewModel: GeneView;

    private signalGene: any;
    private ecfArray: string[] = [];

    constructor(private store: Store<any>, private route: ActivatedRoute) {
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.errorMessage$ = this.store.select(fromGenes.getFetchErrorMessage);
        this.gene$ = this.store.select(fromGenes.getGene);
        this.geneStableId = this.route.snapshot.paramMap.get('stable_id');
        this.getGene(this.geneStableId);
        this.gene$.skip(1).take(1).subscribe((result) => {
            this.signalGene = result.SignalGene;
            if (this.signalGene) {
                for (let field in result.SignalGene.counts) {
                    if (field.substring(0, 4) === "ECF_") {
                        this.ecfArray.push(" " + field);
                    }
                }
            }

            return result ? this.geneViewModel = new GeneView(result) : this.geneViewModel = null;
        });
    }

    getGene(query: string) {
        this.store.dispatch(new FetchGene(query));
    }
}