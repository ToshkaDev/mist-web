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
    return {
      ...(componentId && {componentId}),
      ranks: `${PrimaryRank.chemotaxis},${secondaryRank},${type}`,
    };
  }
}
