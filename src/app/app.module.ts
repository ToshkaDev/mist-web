import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GenomesComponent } from './genomes/genomes.component';

const routes: Routes = [
  { path: 'genomes', component: GenomesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    GenomesComponent,
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
})
export class AppModule { }
