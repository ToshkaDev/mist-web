export class GenomesFilter {
    readonly levels = 5;

    //using two maps instead of just sending a number to resetFrom() for more robustness 
    readonly taxonmoyToRang: Map<string,number> = new Map()
    .set("phylum", 1)
    .set("clazz", 2)
    .set("orderr", 3)
    .set("family", 4)
    .set("genus", 5);
    readonly rangToTaxonomy: Map<number,string> = new Map()
    .set(1,"phylum")
    .set(2,"clazz")
    .set(3,"orderr")
    .set(4,"family")
    .set(5,"genus");
    
    constructor(  
        public phylum?: string,
        public clazz?: string,
        public orderr?: string,
        public family?: string,
        public genus?: string,
        public assembly_level?: string
    ) {}

    reset() {
        this.assembly_level=undefined;
        this.resetFrom();
    }

    resetFrom(highestlevel: string = null) {
        let startIndex = highestlevel ? this.taxonmoyToRang.get(highestlevel) : 0;
        for (let level=++startIndex; level <= this.levels; level++) {
            this[this.rangToTaxonomy.get(level)] = undefined;
        }
    }
}