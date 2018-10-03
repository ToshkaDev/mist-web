import { Component, Input } from '@angular/core';

import { GenomeStpMatrix, JointRank } from '../../services/mist-api.service';

@Component({
  selector: 'mist-major-mode-table',
  styleUrls: ['./major-mode-table.scss'],
  templateUrl: './major-mode-table.pug',
})
export class MajorModeTableComponent {
  @Input()
  stpMatrix: GenomeStpMatrix;

  @Input()
  stpMatrixLimit: number;

  JointRank = JointRank;
}
