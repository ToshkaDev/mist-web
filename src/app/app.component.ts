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
  // isCaltechLogoActive = false;
  // isSabanciLogoActive = false;
  isNetlifyLogoActive = false;

  header_color_mist = "#0B4F6C";
  footer_color_mist = "#DAD2BC";
  header_color_mist_metagenomes = "#48233C";
  footer_color_mist_metagenomes = "#DAD2BC";

  private styles = {
    'header': {'background-color': this.header_color_mist},
    'footer': {'background-color': this.footer_color_mist},
  };
  
  ngAfterContentInit() {
    Observable.fromEvent(this.nihLogo.nativeElement, 'mouseenter').subscribe(() => this.isNnihLogoActive = true);
    Observable.fromEvent(this.nihLogo.nativeElement, 'mouseleave').subscribe(() => this.isNnihLogoActive = false);

    Observable.fromEvent(this.osuLogo.nativeElement, 'mouseenter').subscribe(() => this.isOsuLogoActive = true);
    Observable.fromEvent(this.osuLogo.nativeElement, 'mouseleave').subscribe(() => this.isOsuLogoActive = false);

    Observable.fromEvent(this.netlifyLogo.nativeElement, 'mouseenter').subscribe(() => this.isNetlifyLogoActive = true);
    Observable.fromEvent(this.netlifyLogo.nativeElement, 'mouseleave').subscribe(() => this.isNetlifyLogoActive = false);
  }

  setStyles(database: any) {
    if (database === "mist") {
      this.styles.header['background-color'] = this.header_color_mist;
      this.styles.footer['background-color'] = this.footer_color_mist;
    } else if (database === "mist-metagenomes") {
      this.styles.header['background-color'] = this.header_color_mist_metagenomes;
      this.styles.footer['background-color'] = this.footer_color_mist_metagenomes;
    }
  }
}
