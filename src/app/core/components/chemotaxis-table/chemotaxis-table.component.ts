import { Component, Input } from '@angular/core';

import { GenomeStpMatrix, JointRank } from '../../services/mist-api.service';

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

  JointRank = JointRank;
}
