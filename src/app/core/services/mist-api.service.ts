import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MistApi {
  static BASE_URL = 'https://api.mistdb.com/v1';
  static GENOMES_ROOT = '/genomes';
  static paginationParams = "page=%pageNumber%&per_page=%perPage%";

  constructor(private http: Http) {}

  searchGenomesUrl(query: string): string {
    return this.genomesUrl() + '?count&search=' + query;
  }

  searchGenomesWithPaginationUrl(query: any): string {
    const pagination = MistApi.paginationParams.replace("%pageNumber%", String(query.pageNumber).replace("%perPage%", String(query.perPage)));
    return this.searchGenomesUrl(query.search) + '&' + pagination;
  }

  getGenomeUrl(query: string): string {
    return this.genomesUrl() + "/" +  query;
  }


  searchGenomes(query: string): Observable<Response> {
    return this.http.get(this.genomesUrl());
  }

  genomesUrl(): string {
    return MistApi.BASE_URL + MistApi.GENOMES_ROOT;
  }
}
