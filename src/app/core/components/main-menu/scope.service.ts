import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
 
@Injectable()
export class ScopeService {

  private scopeSource = new Subject<boolean>();
  private selectedScopeSource = new Subject<string>();

  scope$ = this.scopeSource.asObservable();
  selectedScope$ = this.selectedScopeSource.asObservable();

  change(state: boolean) {
    this.scopeSource.next(state);
  }

  select(scopeElement: string) {
    this.selectedScopeSource.next(scopeElement);
  }
 
}