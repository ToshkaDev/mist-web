import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fieldMap as FieldMap } from '../common/fields';
import { Entities } from '../common/entities';

@Injectable()
export class MistApi {
  // static BASE_URL = 'https://api.mistdb.com/v1';
  static BASE_URL = 'http://localhost:5000/v1';
  static GENOMES_ROOT = '/genomes';
  static GENES_ROOT = '/genes';
  static paginationParams = "page=%pageNumber%&per_page=%perPage%";
  static ENTITY_TO_BASEURL: Map<string, string> = new Map([
    [Entities.GENOMES, MistApi.BASE_URL + MistApi.GENOMES_ROOT],
    [Entities.GENOME, MistApi.BASE_URL + MistApi.GENOMES_ROOT],
    [Entities.GENES, MistApi.BASE_URL + MistApi.GENES_ROOT],
    [Entities.GENE, MistApi.BASE_URL + MistApi.GENES_ROOT],
    [Entities.NEIGHBOUR_GENES, MistApi.BASE_URL + MistApi.GENES_ROOT]
  ]);

  constructor(private http: Http) {}

  searchGenomesUrl(query: string, entity: string): string {
    return this.getBaseUrl(entity) + '?count&search=' + query;
  }

  searchGenomesWithPaginationUrl(query: any, entity: string): string {
    let url = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    url = this.processGenomesFilter(query, url); 
    url = this.specifyFields(`${url}&`, FieldMap.get(entity));
    return this.searchGenomesUrl(query.search, Entities.GENOMES) + '&' + url;
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

  searchGenesUrl(query: string, entity: string): string {
    return this.getBaseUrl(entity) + '?count&search=' + query;
  }

  searchGenesWithPaginationUrl(query: any, entity: string): string {
    let url = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    url = this.processGenesFilter(query, url); 
    url = this.specifyFields(`${url}&`, FieldMap.get(entity));
    return this.searchGenesUrl(query.search, Entities.GENES) + '&' + url;
  }
  
  processGenesFilter(query: any, url: string): string {
    return url;
  }

  specifyFields(url: string, fields: string): string {
    return `${url}fields=${fields}`;
  }

  getUrl(query: string, entity: string): string {
    let url = this.getBaseUrl(entity) + `/${query}`;
    url = entity == Entities.NEIGHBOUR_GENES ? `${url}/neighbors?` : `${url}?`;
    return this.specifyFields(url, FieldMap.get(entity));
  }

  getBaseUrl(entity: string) {
    return MistApi.ENTITY_TO_BASEURL.get(entity);
  }
}
