import { Component, Input } from '@angular/core';

import { PrimaryRank, SecondaryRank } from '../../common/stp-utils';
import { GenomeStpMatrix } from '../../services/mist-api.service';

@Component({
  selector: 'mist-chemotaxis-table',
  styleUrls: ['./chemotaxis-table.scss'],
  templateUrl: './chemotaxis-table.pug',
})
export class ChemotaxisTableComponent {
  @Input()
  stpMatrix: GenomeStpMatrix;

  @Input()
  stpMatrixLimit: number;

  secondaryRanks = [
    SecondaryRank.mcp,
    SecondaryRank.chew,
    SecondaryRank.chea,
    SecondaryRank.cher,
    SecondaryRank.cheb,
    SecondaryRank.checx,
    SecondaryRank.chev,
    SecondaryRank.ched,
    SecondaryRank.chez,
    SecondaryRank.other,
  ];

  PrimaryRank = PrimaryRank;
}
