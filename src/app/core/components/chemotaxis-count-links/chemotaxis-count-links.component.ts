import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { PrimaryRank, SecondaryRank } from '../../common/stp-utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-chemotaxis-count-links',
  styleUrls: ['./chemotaxis-count-links.scss'],
  templateUrl: './chemotaxis-count-links.pug',
})
export class ChemotaxisCountLinksComponent implements OnInit {
  @Input() counts: any;
  @Input() secondaryRank: SecondaryRank;
  @Input() componentId: number;

  hasSubTypes = true;

  ngOnInit() {
    this.hasSubTypes = this.counts && this.counts[this.secondaryRank] && Object.keys(this.counts[this.secondaryRank]).length > 1;
  }

  queryParams(secondaryRank: string, type: string) {
    const { componentId } = this;
    let ranks = `${PrimaryRank.chemotaxis},${secondaryRank}`;
    if (type) {
      // for some reason 24H,28H and MAC2 need differently ordered query parameters
      if (type === '24H' || type === '28H' || type === 'MAC2') {
        ranks = `${type},${ranks}`;
      } else {
        ranks = `${ranks},${type}`;
      }
    }

    return {
      ...(componentId && {componentId}),
      ranks,
    };
  }
}
