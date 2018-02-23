import { Filter }  from '../core/common/navigation';

export default class GenomesFilter implements Filter {
    readonly levels: number = 6;
    private mostSpecificLevel: string;

    // using two maps instead of just sending a number to resetFrom() for more robustness 
    readonly taxonmoyToRank: Map<string,number> = new Map()
    .set("superkingdom", 1)
    .set("phylum", 2)
    .set("clazz", 3)
    .set("order", 4)
    .set("family", 5)
    .set("genus", 6);
    readonly rankToTaxonomy: Map<number,string> = new Map()
    .set(1, "superkingdom")
    .set(2,"phylum")
    .set(3,"clazz")
    .set(4,"order")
    .set(5,"family")
    .set(6,"genus");
    
    constructor(
        public superkingdom?: string, 
        public phylum?: string,
        public clazz?: string,
        public order?: string,
        public family?: string,
        public genus?: string,
        public assembly_level?: string
    ) {}

    getMostSpecificLevel() {
        if (this.genus) {
            this.mostSpecificLevel = this.genus;
        } else if (this.family) {
            this.mostSpecificLevel = this.family;
        } else if (this.order) {
            this.mostSpecificLevel = this.order;
        } else if (this.clazz) {
            this.mostSpecificLevel = this.clazz;
        } else if (this.phylum) {
            this.mostSpecificLevel = this.phylum;
        } else if (this.superkingdom) {
            this.mostSpecificLevel = this.superkingdom;
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