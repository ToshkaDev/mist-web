import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { Misc } from '../core/common/misc-enum';
 
@Injectable()
export class CartChangedService {
  private cartChangedSource = new Subject<string>();
  private isItemsAddedOrChangedSource = new Subject<boolean>();
  cartChanged$ = this.cartChangedSource.asObservable();
  isItemsAddedOrChanged$ = this.isItemsAddedOrChangedSource.asObservable();
  private webStorageLifeDays: number = 30; 
  private milliSecsInOneDay: number = 8.64e+7; 

  notify(message: string) {
    this.cartChangedSource.next(message);
  }

  notifyOfChange() {
    this.isItemsAddedOrChangedSource.next(true);
  }
 
  getWebStorageItemString(entity: string): string {
    let dateString = localStorage.getItem(`${Misc.SHOP_CART_PREFIX}${entity}time`);
    let date: number = dateString ? Date.parse(dateString) : null;
    // adding 5 to increase the 'now' value in very small ammount to show that now happend after the item was set
    let now: number = Date.parse(new Date().toUTCString()) + 5;
    if (!date)
      return null;
  
    // with additional precaution from crazy situation
    let timePassed = (now - date) > 0 ? (now - date)/this.milliSecsInOneDay : null;
    if (timePassed) {
      if (timePassed > this.webStorageLifeDays)
        return null;
    } else
        return null;
    return localStorage.getItem(`${Misc.SHOP_CART_PREFIX}${entity}`);
  }

  getWebStorageItem(entity: string): string[] {
    let items = this.getWebStorageItemString(entity);
    if (items) {
      return items.split(',');
    }
    return null;
  }

  setWebStorageItem(entity: string, ids: string) {
    localStorage.setItem(`${Misc.SHOP_CART_PREFIX}${entity}`, ids);
    let date = new Date().toUTCString();
    localStorage.setItem(`${Misc.SHOP_CART_PREFIX}${entity}time`, date);
  }

  removeWebStorageItem(entity: string) {
    localStorage.removeItem(`${Misc.SHOP_CART_PREFIX}${entity}`);
    localStorage.removeItem(`${Misc.SHOP_CART_PREFIX}${entity}time`);
  }

  webStorageItemIsSet(entity: string): boolean {
    return this.getWebStorageItemString(entity) ? true : false;
  }

  refreshWebStorageItemCounter(entity: string): string {
    let entityready = this.webStorageItemIsSet(entity) && new Set(this.getWebStorageItem(entity)).size === 1 ? entity.replace(/s$/, '') : entity;
    return this.webStorageItemIsSet(entity) ? `${new Set(this.getWebStorageItem(entity)).size} ${entityready}` : `0 ${entityready}`;
  }

}