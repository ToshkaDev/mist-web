import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Misc } from '../core/common/misc-enum';
 
@Injectable()
export class CookieChangedService {
  private cookieChangedSource = new Subject<string>();
  private isCookieAddedOrChangedSource = new Subject<boolean>();
  cookieChanged$ = this.cookieChangedSource.asObservable();
  isCookieAddedOrChanged$ = this.isCookieAddedOrChangedSource.asObservable();

  constructor(private cookieService: CookieService) {} 

  notify(message: string) {
    this.cookieChangedSource.next(message);
  }

  notifyOfChange() {
    this.isCookieAddedOrChangedSource.next(true);
  }
 
  getCookie(entity): string[] {
    return this.cookieService.get(`${Misc.COOKIE_PREFIX}${entity}`).split(',');
  }

  cookieIsSet(entity): boolean {
    return this.cookieService.check(`${Misc.COOKIE_PREFIX}${entity}`);
  }

  refreshCookieCounter(entity): string {
    let entityready = this.cookieIsSet(entity) && new Set(this.getCookie(entity)).size === 1 ? entity.replace(/s$/, '') : entity;
    return this.cookieIsSet(entity) ? `${new Set(this.getCookie(entity)).size} ${entityready}` : `0 ${entityready}`;
  }

}