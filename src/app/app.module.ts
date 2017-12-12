import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatButtonModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, 
  MatTableModule, MatPaginatorModule, MatCardModule} from '@angular/material';
  import {MatSelectModule} from '@angular/material/select';
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
import { GenomeComponent } from './genome/genome.component';
import { GenomeViewComponent } from './genome/genome.view.component';
import { GenomesEffects } from './genomes/genomes.effects';
import { GenomeEffects } from './genome/genome.effects';
import { HomeComponent } from './home/home.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    GenomesComponent,
    GenomeComponent,
    GenomesListComponent,
    GenomeViewComponent,
    HomeComponent,
    MainMenuComponent,
    SearchInputComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([GenomesEffects, GenomeEffects]),
    FormsModule,
    HttpModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    StoreModule.forRoot(reducers, { metaReducers}),
  ],
  providers: [
    MistApi,
  ],
})
export class AppModule { }
