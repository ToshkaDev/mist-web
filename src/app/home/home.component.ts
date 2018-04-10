import { Component, ViewChild, ComponentFactoryResolver, Type, OnInit } from '@angular/core';
import { MistDirective } from './mist.directive';
import { GenomesComponent } from '../genomes/genomes.component';
import { GenesComponent } from '../genes/genes.component';

@Component({
  selector: 'mist-home',
  styleUrls: ['./home.scss'],
  templateUrl: './home.component.pug',
})
export class HomeComponent {
  @ViewChild(MistDirective) adHost: MistDirective;
  selected = 'Genomes';


  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}


  ngOnInit() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(GenomesComponent);
    this.adHost.viewContainerRef.createComponent(componentFactory);
  }

  entityChanged(entity: any) {
    let componentToCreate: any = entity.value == "Genomes" ? GenomesComponent : GenesComponent;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentToCreate);
    let viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }

}
