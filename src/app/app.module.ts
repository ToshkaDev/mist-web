import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { 
  MatButtonModule, 
  MatIconModule, 
  MatInputModule, 
  MatProgressSpinnerModule, 
  MatTableModule, 
  MatPaginatorModule, 
  MatCardModule, 
  MatCheckboxModule, 
  MatExpansionModule,
  MatToolbarModule,
} from '@angular/material';

import {MatSelectModule} from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { D3Service } from 'd3-ng2-service';

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
import { GenesComponent } from './genes/genes.component';
import { GeneComponent } from './gene/gene.component';
import { GenesListComponent } from './genes/genes-list.component';
import { GeneViewComponent } from './gene/gene.view.component';
import { AseqComponent } from './gene/aseq/aseq.component';
import { AseqViewComponent } from  './gene/aseq/aseq.view.component';
import { GenomesEffects } from './genomes/genomes.effects';
import { GenomeEffects } from './genome/genome.effects';
import { GenesEffects } from './genes/genes.effects';
import { GeneEffects } from './gene/gene.effects';
import { HomeComponent } from './home/home.component';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    GenomesComponent,
    GenomeComponent,
    GenesComponent,
    GenomesListComponent,
    GenomeViewComponent,
    GenesListComponent,
    GeneComponent,
    GeneViewComponent,
    AseqComponent,
    AseqViewComponent,
    HomeComponent,
    MainMenuComponent,
    SearchInputComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([GenomesEffects, GenomeEffects, GenesEffects, GeneEffects]),
    FormsModule,
    HttpModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    StoreModule.forRoot(reducers, { metaReducers}),
  ],
  providers: [
    MistApi, D3Service
  ],
})
export class AppModule { }
