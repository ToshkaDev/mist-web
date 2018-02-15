import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Fields } from './fields';

@Injectable()
export class MistApi {
  //static BASE_URL = 'https://api.mistdb.com/v1';
  static BASE_URL = 'http://localhost:5000/v1';
  static GENOMES_ROOT = '/genomes';
  static paginationParams = "page=%pageNumber%&per_page=%perPage%";
  constructor(private http: Http) {}

  searchGenomesUrl(query: string): string {
    return this.genomesUrl() + '?count&search=' + query;
  }

  searchGenomesWithPaginationUrl(query: any): string {
    let url = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    url = this.processGenomesFilter(query, url); 
    url = this.specifyFields(query, url);
    return this.searchGenomesUrl(query.search) + '&' + url;
  }

  specifyFields(query: any, url:string): string {
    return `${url}&fields=${Fields.GENOMES_FIELDS}`
  }

  processGenomesFilter(query: any, url: string): string {
    for (let option in query.filter) {
      if ((query.filter.taxonmoyToRank.has(option) || option == "assembly_level") && query.filter[option]) { 
        let optionReady = option === "clazz" ? "class" : option;
        url = `${url}&where.${optionReady}=${query.filter[option].trim()}`;
      }
    }
    return url;
  }

  getGenomeUrl(query: string): string {
    return this.genomesUrl() + "/" +  query;
  }
  
  // searchGenomes(query: string): Observable<Response> {
  //   return this.http.get(this.genomesUrl());
  // }

  genomesUrl(): string {
    return MistApi.BASE_URL + MistApi.GENOMES_ROOT;
  }
}
