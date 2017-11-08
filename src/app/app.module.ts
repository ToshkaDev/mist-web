import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatInputModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { metaReducers, reducers } from './app.reducers';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { GenomesComponent } from './genomes/genomes.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    GenomesComponent,
    HomeComponent,
    MainMenuComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MatInputModule,
    StoreModule.forRoot(reducers, { metaReducers}),
  ],
  providers: [],
})
export class AppModule { }
