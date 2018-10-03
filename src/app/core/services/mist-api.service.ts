import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { fieldMap as FieldMap } from '../common/fields';
import { Entities } from '../common/entities';
import { Observable } from 'rxjs/Observable';

export enum SignalDomainKind {
  Chemotaxis = 'chemotaxis',
  Transmitter = 'transmitter',
  Receiver = 'receiver',
  Input = 'input',
  Output = 'output',
  ECF = 'ecf',
  Unknown = 'unknown',
}

export interface SignalProfileCount {
  kind: SignalDomainKind;
  function: string;
  numDomains: number;
}

@Injectable()
export class MistApi {
  // static BASE_URL = 'https://api.mistdb.com/v1';
  static BASE_URL = 'http://localhost:5000/v1';
  // static BASE_URL = 'https://api.mistdb.caltech.edu/v1';
  static GENOMES_ROOT = '/genomes';
  static GENES_ROOT = '/genes';
  static paginationParams = "page=%pageNumber%&per_page=%perPage%";
  static allGenomesScope = "All Genomes";
  static ENTITY_TO_BASEURL: Map<string, string> = new Map([
    [Entities.GENOMES, MistApi.BASE_URL + MistApi.GENOMES_ROOT],
    [Entities.GENOMES_SHOPCART, MistApi.BASE_URL + MistApi.GENOMES_ROOT],
    [Entities.SCOPE, MistApi.BASE_URL + MistApi.GENOMES_ROOT],
    [Entities.GENOME, MistApi.BASE_URL + MistApi.GENOMES_ROOT],
    [Entities.GENES, MistApi.BASE_URL + MistApi.GENES_ROOT],
    [Entities.GENES_SHOPCART, MistApi.BASE_URL + MistApi.GENES_ROOT],
    [Entities.GENE, MistApi.BASE_URL + MistApi.GENES_ROOT],
    [Entities.NEIGHBOUR_GENES, MistApi.BASE_URL + MistApi.GENES_ROOT],
    [Entities.SIGNAL_GENES, MistApi.BASE_URL + MistApi.GENOMES_ROOT]
  ]);

  constructor(private http: Http) {}

  searchWithPaginationUrl(query: any, entity: string): string {
    let url = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    url = this.processFilter(query, url, entity);
    if (query.scope && query.scope !== MistApi.allGenomesScope) {
      url = this.specifyFields(`${url}&`, FieldMap.get("genes_inside_genome"));
      return this.searchInsideGenomeUrl(query.search, query.scope) + '&' + url;
    }
    url = this.specifyFields(`${url}&`, FieldMap.get(entity));
    return this.searchUrl(query.search, entity) + '&' + url;
  }

  searchUrl(query: string, entity: string): string {
    return this.getBaseUrl(entity) + '?count&search=' + query;
  }

  searchInsideGenomeUrl(querySearch: string, queryScope: string): string {
    return this.getBaseUrl(Entities.GENOMES) + `/${queryScope}/` + 'genes?count&search=' + querySearch;
  }

  processFilter(query, url, entity) {
    if (entity == Entities.GENOMES) {
      return this.processGenomesFilter(query, url);
    } else if (entity == Entities.GENES) {
      return this.processGenesFilter(query, url);
    } else if (entity == Entities.SIGNAL_GENES) {
      return this.processSignalGenesFilter(query, url);
    }
    // will need to reconsider
    return url;
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

  // not implemented
  processGenesFilter(query: any, url: string): string {
    return url;
  }

  processSignalGenesFilter(query: any, url: string): string {
    url = `${url}&where.ranks=${query.filter.ranks}&where.component_id=${query.filter.componentId}`;
    return url;
  }

  getByIdList(query: any, entity: string): string {
    let url = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    url = this.specifyFields(`${url}&`, FieldMap.get(entity));
    return this.getBaseUrl(entity) + `?count&where.id=${query.search}` + "&" + url;
  }

  getByRanks(query: any, entity: string): string {
    let url = MistApi.paginationParams.replace("%pageNumber%", query.pageIndex).replace("%perPage%", query.perPage);
    url = this.processFilter(query, url, entity);
    url = this.specifyFields(`${url}&`, FieldMap.get(entity));
    url = this.getBaseUrl(entity) + `/${query.search}` + "/signal_genes?" + url;
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

  fetchStProfileData(genomeVersion): Observable<SignalProfileCount[]> {
    const url = this.getBaseUrl(Entities.GENOME) + `/${genomeVersion}/st-profile`;
    return this.http.get(url)
      .map((response) => <SignalProfileCount[]>response.json());
  }
}
