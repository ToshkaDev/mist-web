import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

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
    let pagination = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    if(query.filter.phylum) {
      pagination = pagination.concat("&phylum=" + query.filter.phylum.trim());
    }
    if(query.filter.clazz) {
      pagination = pagination.concat("&class=" + query.filter.clazz.trim());
    }
    if(query.filter.orderr) {
      pagination = pagination.concat("&orderr=" + query.filter.orderr.trim());
    }
    if(query.filter.family) {
      pagination = pagination.concat("&family=" + query.filter.family.trim());
    }
    if(query.filter.genus) {
      pagination = pagination.concat("&genus=" + query.filter.genus.trim());
    }
    if(query.filter.assembly_level) {
      pagination = pagination.concat("&assembly_level=" + query.filter.assembly_level.trim());
    }
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
