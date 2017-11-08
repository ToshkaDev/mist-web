import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mist-genomes',
  styleUrls: [],
  templateUrl: './genomes.pug',
})
export class GenomesComponent implements OnInit, OnDestroy {
  matchingGenomes$: Observable<any[]>;

  private destroy$ = new Subject();

  constructor(
    private store: Store<any>,
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
