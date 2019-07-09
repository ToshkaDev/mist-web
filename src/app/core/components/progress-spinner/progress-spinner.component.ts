import { Component, Input } from '@angular/core';

@Component({
    selector: 'mist-progress-spinner',
    styleUrls: ['./progress-spinner.scss'],
    templateUrl: './progress-spinner.pug',
})
export class ProgressSpinnerComponent {
    @Input() isSearchPerformed = false;
    @Input() isFetching = false;
    @Input() errorMessage = null;
    @Input() result;
}