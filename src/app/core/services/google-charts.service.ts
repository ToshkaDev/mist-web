import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class GoogleCharts {
  private version = 'current';
  private packages = ['corechart'];
  private loaded$ = new ReplaySubject<boolean>(1);

  constructor() {
    this.loaded$ = Observable.create((obs: Observer<boolean>) => {
      (<any>window).google.charts.load(this.version, {packages: this.packages});
      (<any>window).google.charts.setOnLoadCallback(() => {
        obs.next(true);
        obs.complete();
      });
    });
  }

  loaded(): Observable<boolean> {
    return this.loaded$;
  }
}
