import { Component, Input } from '@angular/core';
import { ToggleChangedService } from './toggle-changed.service';

@Component({
    selector: 'protein-feature-toggler',
    styleUrls: ['./protein-feature-toggle.scss'],
    templateUrl: './protein-feature-toggle.pug',
})
export class ProteinFeatureToggleComponent {
    @Input() lcrChecked = false;
    @Input() coiledCoilesChecked = false;

    constructor(private toggleChanegsService: ToggleChangedService) {
        this.toggleChanegsService.lcrChanged$.subscribe(isChecked => this.lcrChecked = isChecked);
        this.toggleChanegsService.coiledCoilsChanged$.subscribe(isChecked => this.coiledCoilesChecked = isChecked);
    }

    lcrChanged($event) {
        this.toggleChanegsService.lcrChanged($event.checked);   
    }

    coiledCoilsChanged($event) {
        this.toggleChanegsService.coiledCoilsChanged($event.checked);
    }
}