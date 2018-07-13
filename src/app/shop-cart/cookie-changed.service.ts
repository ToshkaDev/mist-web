import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
 
@Injectable()
export class CookieChangedService {

  private cookieChangedSource = new Subject<string>();

  cookieChanged$ = this.cookieChangedSource.asObservable();

  notify(message: string) {
    this.cookieChangedSource.next(message);
  }
 
}