import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GenomesComponent } from './genomes/genomes.component';
import { GenomeComponent } from './genome/genome.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'genomes', component: GenomesComponent },
  { path: 'genomes/:version', component: GenomeComponent },
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
