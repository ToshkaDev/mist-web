export default class GenomeViewModel {
    private mainInfo: any[] = [];
    private taxonomy: any[] = [];
    private mainInfoFields: any[] = [
        {"name": "Organism", "value": "name"},
        {"name": "NCBI Taxonomy id", "value": "taxonomy_id"},
        {"name": "Assembly level", "value": "assembly_level"}, 
        {"name": "Genbank version", "value": "genbank_version", "ftp_path": "ftp_path"}, 
        {"name": "Submitter", "value": "submitter"}, 
        {"name": "Bioproject", "value": "bioproject"}, 
        {"name": "Biosample", "value": "biosample"}, 
        {"name": "Master project", "value": "wgs_master"}, 
        {"name": "Refseq Category", "value": "refseq_category"}
    ];
    private taxonomyFields: any[] = [
        {"level": "superkingdom", "value": "superkingdom"}, 
        {"level": "phylum", "value": "phylum"}, 
        {"level": "class", "value": "class"},
        {"level": "order", "value": "order"},
        {"level": "family", "value":"family"},
        {"level": "genus", "value": "genus"}
    ];
    
    constructor(genomeData: any) {
        if (genomeData) {
            this.initializeProperties(genomeData, this.mainInfo, this.mainInfoFields);
            this.initializeProperties(genomeData, this.taxonomy, this.taxonomyFields);
        }
    }

    // Do not display elements if their values in the response object are null
    private initializeProperties(genomeData: any, property: any[], fields: any[]) {
        for (let element of fields) {
            if (element.value in genomeData && genomeData[element.value]) {
                element.value = genomeData[element.value];
                if (element.ftp_path && genomeData.ftp_path)
                    element.ftp_path = genomeData.ftp_path;
                property.push(element);
            }
        }
    }
}