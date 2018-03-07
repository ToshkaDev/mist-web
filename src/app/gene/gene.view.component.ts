import { Component, Input, OnInit } from '@angular/core';
import * as DomainGfx from 'domain-gfx';

@Component({
  selector: 'mist-gene-view',
  templateUrl: './gene.view.pug',
  styleUrls: ['./gene.view.component.scss']
})
export class GeneViewComponent implements OnInit {
  @Input() geneViewModel: any;

  ngOnInit() {
    const parent = document.querySelector('.maincontainer');

    // testing domain-gfx library
    const data = {
      length: 100,
      regions: [
        {
          text: 'domain name',
          start: 2,
          end: 40,
          aliStart: 5,
          aliEnd: 30,
          display: true,
          startStyle: 'jagged',
          endStyle: 'curved',
          color: 'blue',
          metadata: {
            database: 'pfam',
            description: 'text about the domain',
            accession: 'PF00000',
            identifier: 'domain X',
          },
        },
      ],
      markups: [
        {
          lineColour: '#0ff0f0',
          colour: '#bb5b55',
          display: true,
          vAlign: 'top',
          type: 'Pfam predicted active site',
          start: 5,
          headStyle: 'diamond',
          metadata: {
            database: 'pfam',
            description: 'S Pfam predicted active site',
          },
        },
      ],
      motifs: [
        {
          colour: '#00a500',
          metadata: true,
          database: 'Phobius',
          type: 'sig_p',
          display: true,
          end: 50,
          start: 30
        },
      ],
    };
     
    //const dg = new DomainGfx({data, parent});
  }
 
}


