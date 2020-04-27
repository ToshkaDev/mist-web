import { Component, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { faTwitterSquare, faGitter } from '@fortawesome/free-brands-svg-icons';
import { faBook, faEnvelopeSquare, faLeaf } from '@fortawesome/free-solid-svg-icons'
import { faLifeRing } from '@fortawesome/free-regular-svg-icons'

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.pug',
})
export class AppComponent implements AfterContentInit {
  @ViewChild('nihLogo') nihLogo: ElementRef;
  @ViewChild('osuLogo') osuLogo: ElementRef;
  @ViewChild('caltechLogo') caltechLogo: ElementRef;
  @ViewChild('sabanciLogo') sabanciLogo: ElementRef;
  @ViewChild('netlifyLogo') netlifyLogo: ElementRef;

  faLifeRing = faLifeRing;
  faEnvelopeSquare = faEnvelopeSquare;
  faBook = faBook;
  faGitter = faGitter;
  faTwitterSquare = faTwitterSquare;
  faTrend = faLeaf;

  isNnihLogoActive = false;
  isOsuLogoActive = false;
  isCaltechLogoActive = false;
  isSabanciLogoActive = false;
  isNetlifyLogoActive = false;

  ngAfterContentInit() {
    Observable.fromEvent(this.nihLogo.nativeElement, 'mouseenter').subscribe(() => this.isNnihLogoActive = true);
    Observable.fromEvent(this.nihLogo.nativeElement, 'mouseleave').subscribe(() => this.isNnihLogoActive = false);

    Observable.fromEvent(this.osuLogo.nativeElement, 'mouseenter').subscribe(() => this.isOsuLogoActive = true);
    Observable.fromEvent(this.osuLogo.nativeElement, 'mouseleave').subscribe(() => this.isOsuLogoActive = false);

    Observable.fromEvent(this.caltechLogo.nativeElement, 'mouseenter').subscribe(() => this.isCaltechLogoActive = true);
    Observable.fromEvent(this.caltechLogo.nativeElement, 'mouseleave').subscribe(() => this.isCaltechLogoActive = false);

    Observable.fromEvent(this.sabanciLogo.nativeElement, 'mouseenter').subscribe(() => this.isSabanciLogoActive = true);
    Observable.fromEvent(this.sabanciLogo.nativeElement, 'mouseleave').subscribe(() => this.isSabanciLogoActive = false);

    Observable.fromEvent(this.netlifyLogo.nativeElement, 'mouseenter').subscribe(() => this.isNetlifyLogoActive = true);
    Observable.fromEvent(this.netlifyLogo.nativeElement, 'mouseleave').subscribe(() => this.isNetlifyLogoActive = false);
  }

}
