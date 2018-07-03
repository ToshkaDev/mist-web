import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GenomesListMain } from './genomes-list.main';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mist-genomes-list',
  templateUrl: './genomes-list.pug',
  styleUrls: ['./genomes-list.scss']
})
export class GenomesListComponent extends GenomesListMain {

}
