import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
 
@Injectable()
export class ToggleChangedService {
    private lcrChangedSource = new Subject<boolean>();
    private coiledCoilsChangedSource = new Subject<boolean>();
    lcrChanged$ = this.lcrChangedSource.asObservable();
    coiledCoilsChanged$ = this.coiledCoilsChangedSource.asObservable();

    lcrChanged(isChecked: boolean) {
        this.lcrChangedSource.next(isChecked);
    }

    coiledCoilsChanged(isChecked: boolean) {
        this.coiledCoilsChangedSource.next(isChecked);
    }
}