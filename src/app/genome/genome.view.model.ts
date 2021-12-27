export interface genomeScopeInterface {
    name: string,
    refSeqVersion: string
}

export default class GenomeViewModel {
    private genome: genomeScopeInterface = {'name': null, 'refSeqVersion': null};
    private objectKeys = Object.keys;
    private mainInfo: any[] = [];
    private taxonomy: any[] = [];
    private workerModules: any = {
        "Stp": "unknown",
        "agfam2": "unknown",
        "segs": "unknown",
        "pfam31": "unknown",
        "ecf1": "unknown",
        "coils": "unknown",
        "tmhmm2": "unknown",
        "GeneClusters": "unknown",
        "Taxonomy": "unknown",
        "NCBICoreData": "unknown",
    };

    private workerModulesTooltips: any = {
        "Stp": "Signal transduction proteins prediction and classification is not complete.",
        "agfam2": "Prediction using MiST signal transduction-specific HMM profiles is not complete.",
        "segs": "Low-complexity regions prediction is not complete.",
        "pfam31": "Pfam domains prediction is not complete.",
        "ecf1": "Extracytoplasmic function sigma factors prediction is not complete.",
        "coils": "Coiled-coils prediction is not complete.",
        "tmhmm2": "Transmembrane Predictions with TMHMM is not complete.",
        "GeneClusters": "Gene neighborhoods identification is not complete.",
        "Taxonomy": "Taxonomic classification is not complete.",
        "NCBICoreData": "NCBI core genomic data parsing is not complete."
    };
    private mainInfoFields: any[] = [
        {"name": "Organism", "value": "name"},
        {"name": "NCBI Taxonomy Id", "value": "taxonomy_id"},
        {"name": "Assembly level", "value": "assembly_level"},
        {"name": "RefSeq version", "value": "version", "ftp_path": "ftp_path"},
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
            this.initializeWorkerModulesStates(genomeData.WorkerModules);
        }
    }

    private getWorkerModuelStyle(state: string): any {
        return state === "done"
            ? {"color": "white", "background-color": "#28b8bd"}
            : {"color": "white", "background-color": "#C0BDBD"};
    }

    private initializeWorkerModulesStates(workerModules: any[]) {
        for (let workerModule of workerModules) {
            let workerModuleName = workerModule.module.replace("AseqCompute:", "");
            this.workerModules[workerModuleName] = workerModule.state;
            if (workerModule.state === "done" && this.workerModulesTooltips.hasOwnProperty(workerModuleName))
              this.workerModulesTooltips[workerModuleName] = this.workerModulesTooltips[workerModuleName].replace("is not complete.", "is complete.");
        }
    }

    // Do not display elements if their values in the response object are null
    private initializeProperties(genomeData: any, property: any[], fields: any[]) {
        for (let element of fields) {
            if (element.value in genomeData && genomeData[element.value]) {
                element.value = genomeData[element.value];
                if (element.ftp_path && genomeData.ftp_path)
                    element.ftp_path = genomeData.ftp_path.replace("ftp://", "https://");
                if (element.name === "Organism")
                    this.genome.name = element.value;
                if (element.name === "RefSeq version")
                    this.genome.refSeqVersion = element.value;
                property.push(element);
            }
        }
    }
}
