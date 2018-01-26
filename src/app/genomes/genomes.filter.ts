export class GenomesFilter {
    readonly levels: number = 5;
    private mostSpecificLevel: string;

    // using two maps instead of just sending a number to resetFrom() for more robustness 
    readonly taxonmoyToRank: Map<string,number> = new Map()
    .set("phylum", 1)
    .set("clazz", 2)
    .set("orderr", 3)
    .set("family", 4)
    .set("genus", 5);
    readonly rankToTaxonomy: Map<number,string> = new Map()
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

    getMostSpecificLevel() {
        if (this.genus) {
            this.mostSpecificLevel = this.genus;
        } else if (this.family) {
            this.mostSpecificLevel = this.family;
        } else if (this.orderr) {
            this.mostSpecificLevel = this.orderr;
        } else if (this.clazz) {
            this.mostSpecificLevel = this.clazz;
        } else if (this.phylum) {
            this.mostSpecificLevel = this.phylum;
        } else {
            this.mostSpecificLevel = "defaultValue";
        }
        return this.mostSpecificLevel;
    }

    reset() {
        this.assembly_level = undefined;
        this.resetFrom();
    }

    resetFrom(highestlevel: string = null) {
        let startIndex = highestlevel ? this.taxonmoyToRank.get(highestlevel) : 0;
        for (let level = ++startIndex; level <= this.levels; level++) {
            this[this.rankToTaxonomy.get(level)] = undefined;
        }
    }
}