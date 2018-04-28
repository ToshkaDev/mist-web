import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GenomesComponent } from './genomes/genomes.component';
import { GenomeComponent } from './genome/genome.component';
import { GenesComponent } from './genes/genes.component';
import { GeneComponent } from './gene/gene.component';
import { HomeComponent } from './home/home.component';
import { HelpComponent } from './home/help.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'help', component: HelpComponent },
  { path: 'genomes', component: GenomesComponent },
  { path: 'genomes/:version', component: GenomeComponent },
  { path: 'genes', component: GenesComponent },
  { path: 'genes/:stable_id', component: GeneComponent },
];

@NgModule({
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true },
    ),
  ],
})
export class AppRoutingModule {}
