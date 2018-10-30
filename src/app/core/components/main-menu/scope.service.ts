import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
 
@Injectable()
export class ScopeService {

  private selectedScopeSource = new Subject<string>();
  private selectedScopeGenomeNameSource = new Subject<string>();
  private putScopeGenomeNameSource = new Subject<any>();

  selectedScope$ = this.selectedScopeSource.asObservable();
  selectedScopeGenomeName$ = this.selectedScopeGenomeNameSource.asObservable();
  putScopeGenomeName$ = this.putScopeGenomeNameSource.asObservable();

  select(scopeElement: string) {
    this.selectedScopeSource.next(scopeElement);
  }

  selectGenomeName(scopeElement: string) {
    this.selectedScopeGenomeNameSource.next(scopeElement);
  }

  putScope(scopeElement: any) {
    this.putScopeGenomeNameSource.next(scopeElement);
  }
 
}