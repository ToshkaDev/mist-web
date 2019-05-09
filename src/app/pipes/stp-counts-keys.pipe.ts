import { Pipe, PipeTransform } from '@angular/core';

import { RankCounts } from '../core/services/mist-api.service';

@Pipe({name: 'stpCountsKeys', pure: true})
export class StpCountsKeysPipe implements PipeTransform {
  transform(object: {[key: string]: RankCounts}): string[] {
    return Object.keys(object)
      .filter((key) => key !== '$total')
      .sort();
  }
}
