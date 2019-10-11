import { Component, OnInit } from '@angular/core';
import { MistApi } from '../core/services/mist-api.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'mist-help',
  styleUrls: ['./help.scss'],
  templateUrl: './help.pug',
})
export class HelpComponent {
  private signalDomains: any[];
  private showTable: boolean = false;
  readonly arrowObject = {0: "keyboard_arrow_downc", 1:  "keyboard_arrow_upc"};
  private arrow = "keyboard_arrow_downc";
  
  constructor(private mistApi: MistApi) {}

  ngOnInit() {
    this.mistApi.fetchSignalDomains().subscribe(result => {
      this.signalDomains = result;
    });
  }

  private toggleTable(show: boolean = false) {
    show ? this.showTable = true : this.showTable = !this.showTable;
    this.arrow = this.arrowObject[+this.showTable];
}
  
}
