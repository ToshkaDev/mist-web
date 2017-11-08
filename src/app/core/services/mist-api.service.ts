import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MistApi {
  static BASE_URL = 'https://api.mistdb.com/v1';
  static GENOMES_ROOT = '/genomes';

  constructor(private http: Http) {}

  searchGenomesUrl(query: string): string {
    return MistApi.BASE_URL + MistApi.GENOMES_ROOT + '?count&search=' + query;
  }

  searchGenomes(query: string): Observable<Response> {
    return this.http.get(this.genomesUrl());
  }

  genomesUrl(): string {
    return MistApi.BASE_URL + '/genomes';
  }
}
