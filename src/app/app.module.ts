import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatIconModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { metaReducers, reducers } from './app.reducers';
import { SearchInputComponent } from './core/components/form/search-input.component';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { MistApi } from './core/services/mist-api.service';
import { GenomesListComponent } from './genomes/genomes-list.component';
import { GenomesComponent } from './genomes/genomes.component';
import { GenomesEffects } from './genomes/genomes.effects';
import { HomeComponent } from './home/home.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    GenomesComponent,
    GenomesListComponent,
    HomeComponent,
    MainMenuComponent,
    SearchInputComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([GenomesEffects]),
    FormsModule,
    HttpModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    StoreModule.forRoot(reducers, { metaReducers}),
  ],
  providers: [
    MistApi,
  ],
})
export class AppModule { }
