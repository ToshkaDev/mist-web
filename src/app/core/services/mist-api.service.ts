import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Fields } from '../common/fields';

@Injectable()
export class MistApi {
  // static BASE_URL = 'https://api.mistdb.com/v1';
  static BASE_URL = 'http://localhost:5000/v1';
  static GENOMES_ROOT = '/genomes';
  static GENES_ROOT = '/genes';
  static paginationParams = "page=%pageNumber%&per_page=%perPage%";
  constructor(private http: Http) {}

  searchGenomesUrl(query: string): string {
    return this.getGenomesBaseUrl() + '?count&search=' + query;
  }

  searchGenomesWithPaginationUrl(query: any): string {
    let url = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    url = this.processGenomesFilter(query, url); 
    url = this.specifyFields(`${url}&`, Fields.GENOMES_FIELDS);
    return this.searchGenomesUrl(query.search) + '&' + url;
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
    return this.getGenomesBaseUrl() + "/" +  query;
  }

  getGenomesBaseUrl() {
    return MistApi.BASE_URL + MistApi.GENOMES_ROOT;
  }

  searchGenesUrl(query: string): string {
    return this.getGenesBaseUrl() + '?count&search=' + query;
  }

  searchGenesWithPaginationUrl(query: any): string {
    let url = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    url = this.processGenesFilter(query, url); 
    url = this.specifyFields(`${url}&`, Fields.GENES_FIELDS);
    return this.searchGenesUrl(query.search) + '&' + url;
  }
  
  processGenesFilter(query: any, url: string): string {
    return url;
  }

  specifyFields(url: string, fields: string): string {
    return `${url}fields=${fields}`
  }

  getGeneUrl(query: string): string {
    let url = this.getGenesBaseUrl() + "/" +  `${query}?`;
    return this.specifyFields(url, Fields.GENE_FIELDS);
  }

  getGenesBaseUrl() {
    return MistApi.BASE_URL + MistApi.GENES_ROOT;
  }
}
