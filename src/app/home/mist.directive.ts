import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ad-host]',
})
export class MistDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}