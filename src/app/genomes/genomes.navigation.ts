import { GenomesFilter }  from './genomes.filter';

export class Navigation {
    constructor(
        public url: string, 
        public filter: GenomesFilter
    ){} 
}