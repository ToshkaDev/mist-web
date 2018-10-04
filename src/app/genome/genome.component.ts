import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { FetchGenome } from './genome.actions';
import * as fromGenomes from './genome.selectors';
import GenomeView from './genome.view.model';

import { MistApi } from '../core/services/mist-api.service';

@Component({
  selector: 'mist-genome',
  styleUrls: ['./genome.scss'],
  templateUrl: './genome.pug',
})
export class GenomeComponent implements OnInit {
  assemblyVersion = this.route.snapshot.paramMap.get('version');
  stpMatrixLimit = 20;
  stpMatrix$ = this.mistApi.fetchStpMatrix(this.assemblyVersion, this.stpMatrixLimit).share();

  private errorMessage$: Observable<string>;
  private genome$: Observable<any>;
  private genomeViewModel: GenomeView;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute,
    private mistApi: MistApi,
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.errorMessage$ = this.store.select(fromGenomes.getFetchErrorMessage);
    this.genome$ = this.store.select(fromGenomes.getFetchResult);
    this.getGenome(this.assemblyVersion);
    this.genome$.subscribe(result =>
      result ? this.genomeViewModel = new GenomeView(result) : this.genomeViewModel = null);
  }

  getGenome(query: string) {
    this.store.dispatch(new FetchGenome(query));
  }
}
