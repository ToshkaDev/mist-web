import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GenomesComponent } from './genomes/genomes.component';
import { GenomeComponent } from './genome/genome.component';
import { GenesComponent } from './genes/genes.component';
import { GeneComponent } from './gene/gene.component';
import { HomeComponent } from './home/home.component';
import { HelpComponent } from './home/help.component';
import { ShopCartComponent } from './shop-cart/shop-cart.component';
import { GenomeResolver } from './genome/genome.resolver';
import { GeneResolver } from './gene/gene.resolver';
import { SignalGenesComponent } from './genome/signal_genes/signal_genes.component';

const routes: Routes = [
  { path: '',
    data: { breadcrumbs: 'Home' },
    children: [
      {
        path: '',
        component: HomeComponent
      },
      { path: 'help',
        component: HelpComponent,
        data: { breadcrumbs: 'Help' }
      },
      {
        path: 'shop-cart',
        component: ShopCartComponent,
        data: { breadcrumbs: 'Shopping Cart' }
      },
      {
        path: 'genomes',
        data: { breadcrumbs: 'Genomes' },
        children: [
          {
            path: '',
            component: GenomesComponent
          },
          {
            path: ':version',
            data: { breadcrumbs: '{{ genome.version }}' },
            resolve: { genome: GenomeResolver },
            children: [
              {
                path: '',
                component: GenomeComponent
              },
              {
                path: 'signal-genes',
                component: SignalGenesComponent,
                data: { breadcrumbs: 'Signal Genes' }
              }
            ]
          },
        ],
      },
      {
        path: 'genes',
        data: { breadcrumbs: 'Genes' },
        children: [
          {
            path: '',
            component: GenesComponent
          },
          {
            path: ':stable_id',
            component: GeneComponent,
            data: { breadcrumbs: '{{ gene.stableId }}' },
            resolve: { gene: GeneResolver }
          }
        ]
      }
    ]
  }
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
