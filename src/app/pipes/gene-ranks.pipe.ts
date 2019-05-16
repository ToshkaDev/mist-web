import { Pipe, PipeTransform } from '@angular/core';

import { capitalizeRanks, unabbreviateRanks } from '../core/common/stp-utils';

@Pipe({
  name: 'geneRanks',
  pure: true,
})
export class GeneRanksPipe implements PipeTransform {
  transform(ranks: string[], full: boolean): string {
    if (!ranks || ranks.length < 1) {
      return null;
    }

    if (full) {
      return unabbreviateRanks(ranks).join(', ');
    }

    return this.getCapitalizedRanks(ranks).join(', ');
  }

  protected getCapitalizedRanks(ranks: string[]): string[] {
    return capitalizeRanks(ranks);
  }
}
