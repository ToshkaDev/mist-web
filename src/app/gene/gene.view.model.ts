import _ from "lodash";

export default class GeneViewModel {
    private proteinInfo: any[] = [];
    private geneInfo: any[] = [];
    private geneInfoFields: any[] = [
        {"name": "Mist Id", "value": "stable_id"},
        {"name": "Source", "value": "Component.definition", "additional": "Component.Genome.version"},
        {"name": "Locus", "value": "locus"},
        {"name": "Old Locus", "value": "old_locus"},
        {"name": "Location", "value": "location", "additional": "Component.version"},
        {"name": "Strand", "value": "strand"}
    ];

    private proteinInfoFields: any[] = [
        {"name": "Protein Accession", "value": "version"}, 
        {"name": "Protein", "value": "length", "additional": "Aseq.length"},
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
             if (elementValue) {
                if (element.name === "Source") {
                    element.value = elementValue;
                    element.genome_version = _.get(geneData, element.additional);
                } else if (element.name === "Protein") {
                    let additional = _.get(geneData, element.additional);
                    element.value = `${additional} aa ` + `(${elementValue} bp)`
                } else if (element.name === "Names") {
                    element.value = _.get(geneData, element.value).join(" ");
                } else if (element.name === "Location") {
                    let additional = _.get(geneData, element.additional);
                    element.value = `${additional} [${elementValue}]`
                } else {
                    element.value = elementValue;
                }
                property.push(element);
            }
        }
    }
}