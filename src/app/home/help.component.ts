import { Component, OnInit } from '@angular/core';
import { MistApi } from '../core/services/mist-api.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

export enum InfoLinks {
  HELP = "help",
  CODE_OF_CONDUCT = "codeOfConduct",
  GUIDE = "guide",
}

@Component({
  selector: 'mist-help',
  styleUrls: ['./help.scss'],
  templateUrl: './help.pug',
})
export class HelpComponent {
  private signalDomainsAndMembers: any[];
  private showTable: boolean = false;
  private showTaxChangesTable: boolean = false;
  readonly arrowObject = {0: "keyboard_arrow_downc", 1:  "keyboard_arrow_upc"};
  private arrow = "keyboard_arrow_downc";
  readonly arrowObjectT = {0: "keyboard_arrow_downc", 1:  "keyboard_arrow_upc"};
  private arrowT = "keyboard_arrow_downc";
  private codeOfConduct = this.route.snapshot.queryParams['code-of-conduct'];

  private links: Map<string, boolean> = new Map([
    [InfoLinks.HELP, true],
    [InfoLinks.CODE_OF_CONDUCT, false],
    [InfoLinks.GUIDE, false],
  ]);
  
  private activeColor = '#0B4F6C';
  private nonActiveColor = '#889999';
  private stylesCommon = {'cursor': 'pointer'};
  private styles: Map<string, any> = new Map([
    ['help', {...this.stylesCommon, 'color': this.activeColor}], 
    ['codeOfConduct', {...this.stylesCommon, 'color': this.nonActiveColor}],
    ['guide', {...this.stylesCommon, 'color':this.nonActiveColor}],
  ]);

  private newToOldTaxonomy: any[] = [
    {"new": "Acidobacteriota", "old": "Acidobacteria"},
    {"new": "Actinomycetota", "old": "Actinobacteria"},
    {"new": "Aquificota", "old": "Aquificae"},
    {"new": "Armatimonadota", "old": "Armatimonadetes"},
    {"new": "Atribacterota", "old": "Candidatus Atribacteria"},
    {"new": "Bacillota", "old": "Firmicutes"},
    {"new": "Bacteroidota", "old": "Bacteroidetes"},
    {"new": "Balneolota", "old": "Balneolaeota"},
    {"new": "Bdellovibrionota", "old": "Formerly part of Proteobacteria"},
    {"new": "Caldisericota", "old": "Caldiserica"},
    {"new": "Calditrichota", "old": "Calditrichaeota"},
    {"new": "Campylobacterota", "old": "Formely Epsilonproteobacteria"},
    {"new": "Chlamydiota", "old": "Chlamydiae"},
    {"new": "Chlorobiota", "old": "Chlorobi"},
    {"new": "Chloroflexota", "old": "Chloroflexi"},
    {"new": "Chrysiogenota", "old": "Chrysiogenetes"},
    {"new": "Deferribacterota", "old": "Deferribacteres"},
    {"new": "Deinococcota", "old": "Deinococcus-Thermus"},
    {"new": "Dictyoglomota", "old": "Dictyoglomi"},
    {"new": "Elusimicrobiota", "old": "Elusimicrobia"},
    {"new": "Fibrobacterota", "old": "Fibrobacteres"},
    {"new": "Fusobacteriota", "old": "Fusobacteria"},
    {"new": "Gemmatimonadota", "old": "Gemmatimonadetes"},
    {"new": "Ignavibacteriota", "old": "Ignavibacteriae"},
    {"new": "Kiritimatiellota", "old": "Kiritimatiellaeota"},
    {"new": "Lentisphaerota", "old": "Lentisphaerae"},
    {"new": "Mycoplasmatota", "old": "Tenericutes"},
    {"new": "Myxococcota", "old": "Formely part of Deltaproteobacteria"},
    {"new": "Nitrososphaerota", "old": "Thaumarchaeota"},
    {"new": "Nitrospinota", "old": "Nitrospinae"},
    {"new": "Nitrospirota", "old": "Nitrospirae"},
    {"new": "Planctomycetota", "old": "Planctomycetes"},
    {"new": "Pseudomonadota", "old": "Proteobacteria"},
    {"new": "Rhodothermota", "old": "Rhodothermaeota"},
    {"new": "Spirochaetota", "old": "Spirochaetes"},
    {"new": "Synergistota", "old": "Synergistetes"},
    {"new": "Thermodesulfobacteriota", "old": "Thermodesulfobacteria"},
    {"new": "Thermomicrobiota", "old": "Formely class Thermomicrobia"},
    {"new": "Thermoproteota", "old": "Crenarchaeota"},
    {"new": "Thermotogota", "old": "Thermotogae"},
    {"new": "Verrucomicrobiota", "old": "Verrucomicrobia"},
    {"new": "Cyanobacteriota", "old": "Cyanobacteria"},
  ]

  constructor(private mistApi: MistApi, private route: ActivatedRoute) {}

  ngOnInit() {
    this.mistApi.fetchSignalDomainsAndMembers().subscribe(result => {
      this.signalDomainsAndMembers = result;
    });
    if (this.codeOfConduct == 'true') {
      this.linkClicked(InfoLinks.CODE_OF_CONDUCT);
      window.scrollTo(0,0);
    }
  }

  private toggleTable(show: boolean = false) {
    show ? this.showTable = true : this.showTable = !this.showTable;
    this.arrow = this.arrowObject[+this.showTable];
  }

  private toggleTaxChangesTable(show: boolean = false) {
    show ? this.showTaxChangesTable = true : this.showTaxChangesTable = !this.showTaxChangesTable;
    this.arrowT = this.arrowObjectT[+this.showTaxChangesTable];
  }

  private linkClicked(activeLink: string) {
    this.links.forEach((value, key, map) => {
      map.set(key, false);
      this.styles.get(key).color = this.nonActiveColor;
    });
    this.links.set(activeLink, true);
    this.styles.get(activeLink).color = this.activeColor;
  }
  
}
