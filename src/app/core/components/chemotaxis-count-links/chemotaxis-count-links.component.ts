import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PrimaryRank, SecondaryRank } from '../../common/stp-utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-chemotaxis-count-links',
  styleUrls: ['./chemotaxis-count-links.scss'],
  templateUrl: './chemotaxis-count-links.pug',
})
export class ChemotaxisCountLinksComponent {
  @Input() counts: any;
  @Input() secondaryRank: SecondaryRank;
  @Input() componentId: number;

  queryParams(secondaryRank: string, type: string) {
    const { componentId } = this;
    // for some reason 24H,28H and MAC2 need differently ordered query parameters
    let ranks = type === '24H' || type === '28H' || type === 'MAC2' 
      ? `${type},${PrimaryRank.chemotaxis},${secondaryRank}`
      : `${PrimaryRank.chemotaxis},${secondaryRank},${type}`;

    return {
      ...(componentId && {componentId}),
      ranks: ranks,
    };
  }
}
