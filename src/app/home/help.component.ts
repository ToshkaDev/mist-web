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
  readonly arrowObject = {0: "keyboard_arrow_downc", 1:  "keyboard_arrow_upc"};
  private arrow = "keyboard_arrow_downc";
  private codeOfConduct = this.route.snapshot.queryParams['code-of-conduct'];

  private links: Map<string, boolean> = new Map([
    [InfoLinks.HELP, true],
    [InfoLinks.CODE_OF_CONDUCT, false],
    [InfoLinks.GUIDE, false],
  ]);
  
  private activeColor = '#197477';
  private nonActiveColor = '#889999';
  private stylesCommon = {'cursor': 'pointer'};
  private styles: Map<string, any> = new Map([
    ['help', {...this.stylesCommon, 'color': this.activeColor}], 
    ['codeOfConduct', {...this.stylesCommon, 'color': this.nonActiveColor}],
    ['guide', {...this.stylesCommon, 'color':this.nonActiveColor}],
  ]);

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

  private linkClicked(activeLink: string) {
    this.links.forEach((value, key, map) => {
      map.set(key, false);
      this.styles.get(key).color = this.nonActiveColor;
    });
    this.links.set(activeLink, true);
    this.styles.get(activeLink).color = this.activeColor;
  }
  
}
