import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

export interface GeneVersion {
    stableId: string
  }

@Injectable()
export class GeneResolver implements Resolve<GeneVersion> {
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GeneVersion> {     
        return Promise.resolve({stableId: route.params.stable_id});
  }

}