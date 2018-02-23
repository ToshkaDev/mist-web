import _ from "lodash";

export default class GeneViewModel {
    private proteinInfo: any[] = [];
    private geneInfo: any[] = [];

    private geneInfoFields: any[] = [
        {"name": "Source", "value": `Component.definition`, "genome_version": "Component.Genome.version"}, 
        {"name": "Locus", "value": "locus"},
        {"name": "Old Locus", "value": "old_locus"},
        {"name": "Location", "value": "location"},
        {"name": "Strand", "value": "strand"}
    ];

    private proteinInfoFields: any[] = [
        {"name": "Protein Accession", "value": "version"}, 
        {"name": "Protein", "value": "length"},
        {"name": "Product", "value": "product"}, 
        {"name": "EC", "value": "cds_qualifiers.EC_number"}, 
        {"name": "Pseudo", "value": "pseudo"}, 
        {"name": "Names", "value": "names"}
    ];


    constructor(geneData: any) {
        if (geneData) {
            this.initializePropertis(geneData, this.proteinInfo, this.proteinInfoFields);
            this.initializePropertis(geneData, this.geneInfo, this.geneInfoFields);
        }
    }

    // Do not display elements if their values in the response object are null
    private initializePropertis(geneData: any, property: any[], fields: any[]) {
        for (let element of fields) {
            let elementValue = _.get(geneData, element.value);
            let genomeVersion = _.get(geneData, element.genome_version);
             if (elementValue) {
                element.value = elementValue;
                if (genomeVersion) {
                    element.genome_version = genomeVersion;
                } else if (element.name === "Protein") {
                    element.value = `${Math.floor(element.value/3)} aa ` + `(${element.value} bp)`
                } else if (element.name === "Names") {
                    element.value = elementValue.join(" ");
                }
                property.push(element);
            }
        }
    }
}