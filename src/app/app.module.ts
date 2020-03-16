import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


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
  MatGridListModule,
  MatListModule,
  MatChipsModule,
  MatDialogModule,
  MatTooltipModule,
  MatSlideToggleModule
} from '@angular/material';

import {MatSelectModule} from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { D3Service } from 'd3-ng2-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { metaReducers, reducers } from './app.reducers';
import { SearchInputComponent } from './core/components/form/search-input.component';
import { MainMenuComponent } from './core/components/main-menu/main-menu.component';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs';
import { MistApi } from './core/services/mist-api.service';
import { GenomesListComponent } from './genomes/genomes-list.component';
import { GenomesComponent } from './genomes/genomes.component';
import { GenomeComponent } from './genome/genome.component';
import { GenomeViewComponent } from './genome/genome.view.component';
import { GenesComponent } from './genes/genes.component';
import { GeneComponent } from './gene/gene.component';
import { GenesListComponent } from './genes/genes-list.component';
import { GeneViewComponent } from './gene/gene.view.component';
import { AseqComponent } from  './gene/aseq/aseq.component';
import { NeighborGenes } from './gene/neighbor-genes/neighbor-genes.component';
import { NeighborGenesView } from  './gene/neighbor-genes/neighbor-genes.view.component';
import { GenomeEffects } from './genome/genome.effects';
import { GeneEffects } from './gene/gene.effects';
import { HomeComponent } from './home/home.component';
import { HelpComponent } from './home/help.component';
import { GenomeResolver } from './genome/genome.resolver';
import { GeneResolver } from './gene/gene.resolver';
import { SelectButtonsComponent } from './core/components/cart-related/select-buttons.component';
import { ShopCartComponent } from './shop-cart/shop-cart.component';
import { ShopCartGenesComponent } from './shop-cart/shop-cart.genes.component';
import { ShopCartGenomesComponent } from './shop-cart/shop-cart.genomes.component';
import { ShopCartGenesList } from './shop-cart/shop-cart.genes.list.component';
import { ShopCartGenomesList } from './shop-cart/shop-cart.genomes.list.component';
import { MistEffects } from './core/common/mist-effects';
import { CartChangedService } from './shop-cart/cart-changed.service';
import { ScopeService } from './core/components/main-menu/scope.service';
import { GenesScopeComponent } from './genes/scope/genes-scope.component';
import { GenesScopeListComponent } from './genes/scope/genes-scope-list.component';
import { GoogleCharts } from './core/services/google-charts.service';
import { StProfileComponent } from '../app/core/components/st-profile/st-profile.component';
import { ReplacePipe } from './core/common/util';
import { SignalGenesComponent } from './genome/signal_genes/signal_genes.component';
import { MajorModeTableComponent } from './core/components/major-mode-table/major-mode-table.component';
import { ChemotaxisTableComponent } from './core/components/chemotaxis-table/chemotaxis-table.component';
import { GeneRanksPipe } from './pipes/gene-ranks.pipe';
import { StpCountsKeysPipe } from './pipes/stp-counts-keys.pipe';
import { ChemotaxisCountLinksComponent } from './core/components/chemotaxis-count-links/chemotaxis-count-links.component';
import { ProgressSpinnerComponent } from './core/components/progress-spinner/progress-spinner.component';
import { ProteinFeatureToggleComponent } from './core/components/protein-feature-toggle/protein-feature-toggle.component';
import { ToggleChangedService } from './core/components/protein-feature-toggle/toggle-changed.service';

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
    NeighborGenes,
    NeighborGenesView,
    HomeComponent,
    HelpComponent,
    MainMenuComponent,
    SearchInputComponent,
    SelectButtonsComponent,
    ShopCartComponent,
    ShopCartGenesComponent,
    ShopCartGenomesComponent,
    ShopCartGenesList,
    ShopCartGenomesList,
    GenesScopeComponent,
    GenesScopeListComponent,
    StProfileComponent,
    SignalGenesComponent,
    MajorModeTableComponent,
    ChemotaxisTableComponent,
    ReplacePipe,
    GeneRanksPipe,
    StpCountsKeysPipe,
    ChemotaxisCountLinksComponent,
    ProgressSpinnerComponent,
    ProteinFeatureToggleComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([MistEffects, GenomeEffects, GeneEffects]),
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
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
    MatGridListModule,
    MatListModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    StoreModule.forRoot(reducers, { metaReducers}),
    McBreadcrumbsModule.forRoot()
  ],
  providers: [
    MistApi, D3Service, GenomeResolver, GeneResolver, CartChangedService, ScopeService, GoogleCharts, ToggleChangedService
  ],
})
export class AppModule { }
