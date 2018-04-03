import { Component, OnInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'mist-aseq',
    templateUrl: './aseq.pug'
  })
  export class AseqComponent implements OnInit {
    @Input() private gene$: Observable<any>;

    ngOnInit() {

    }

  }