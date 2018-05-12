import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

export interface GenomeVersion {
    version: string
  }

@Injectable()
export class GenomeResolver implements Resolve<GenomeVersion> {
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GenomeVersion> {     
        return Promise.resolve({version: route.params.version});
  }

}