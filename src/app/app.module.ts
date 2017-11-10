import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatInputModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { metaReducers, reducers } from './app.reducers';
import { SearchInputComponent } from './core/components/form/search-input.component';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { MistApi } from './core/services/mist-api.service';
import { GenomesComponent } from './genomes/genomes.component';
import { GenomesEffects } from './genomes/genomes.effects';
import { HomeComponent } from './home/home.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    GenomesComponent,
    HomeComponent,
    MainMenuComponent,
    SearchInputComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([GenomesEffects]),
    HttpModule,
    MatInputModule,
    StoreModule.forRoot(reducers, { metaReducers}),
  ],
  providers: [
    MistApi,
  ],
})
export class AppModule { }
