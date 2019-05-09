import { Pipe, PipeTransform } from '@angular/core';

import { capitalizeRanks } from '../core/common/stp-utils';

@Pipe({
  name: 'geneRanks',
  pure: true,
})
export class GeneRanksPipe implements PipeTransform {
  transform(ranks: string[]): string {
    if (!ranks || ranks.length < 1) {
      return null;
    }

    return this.getCapitalizedRanks(ranks).join(', ');
  }

  protected getCapitalizedRanks(ranks: string[]): string[] {
    return capitalizeRanks(ranks);
  }
}
