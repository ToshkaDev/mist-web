import _ from "lodash";

export default class AseqViewModel {
    private pfam: any[] = [];
    private lowComplSegs: any[] = [];
    private coiledCoils: any[] = [];
    private tmHmm: any[] = [];

    private activeHeaders: any[];
    private activeProperties: any[];

    private pfamHeaders: any[] = [
        {"name": "#", "value": "number"},
        {"name": "Name", "value": "name"},
        {"name": "Score", "value": "score"},
        {"name": "Bias", "value": "bias"},
        {"name": "Cond. E-value", "value": "c_evalue"},
        {"name": "Ind. E-value", "value": "i_evalue"},
        {"name": "HMM start", "value": "hmm_from"},
        {"name": "HMM stop", "value": "hmm_to"},
        {"name": "HMM cov.", "value": "hmm_cov"},
        {"name": "Start", "value": "ali_from"},
        {"name": "Stop", "value": "ali_to"},
        {"name": "Env start", "value": "env_from"},
        {"name": "Env stop", "value": "env_to"},
        {"name": "Env cov.", "value": "env_cov"},
        {"name": "Acc", "value": "acc"}
    ];
    private lowComplSegsHeaders: any[] = [
        {"name": "#"},
        {"name": "Start"},
        {"name": "Stop"}
    ];

    private typeNameToProperties: Map<string, any[]> = new Map([
        ["pfam", this.pfam],
        ["lowComplSegs", this.lowComplSegs],
        ["coiledCoils", this.coiledCoils],
        ["tmHmm", this.tmHmm]
    ]);

    //TODO
    private coiledCoilsHeaders: Map<string, any[]>;
    //TODO
    private tmHmmHeaders: Map<string, any[]>;

    //ADD here other headers when they done
    private typeNameToHeaders: Map<string, any[]> = new Map([
        ["pfam", this.pfamHeaders],
        ["lowComplSegs", this.lowComplSegsHeaders]
    ]);

    constructor(aseqData: any) {
        if (aseqData) {
            this.initializeProperties(aseqData.pfam30, this.pfam, this.pfamHeaders);
            this.initializeLowComplSegsProperties(aseqData.segs, this.lowComplSegs);
        }
    }

    private initializeProperties(pfamData: any[], property: any[], fields: any[])  {
        for (let index in pfamData) {
            let properties = [];
            let elementToPush;
            for (let element of fields) {
                if (element.name === "#")
                    elementToPush = +index+1;
                else 
                    elementToPush = _.get(pfamData[index], element.value);
                properties.push(elementToPush);
            }
            property.push(properties);    
        }
    }

    private initializeLowComplSegsProperties(segs: any[], property: any[]) {
        for (let index in segs) {
            let properties = [];
            let elementToPush;
            properties.push(+index+1, segs[index][0], segs[index][1]);
            property.push(properties);
        }
    }

    changeActiveHeaders(dataTypeName: string) {
        this.activeHeaders = this.typeNameToHeaders.get(dataTypeName);
    }

    changeActiveProperties(dataTypeName: string) {
        this.activeProperties = this.typeNameToProperties.get(dataTypeName);
    }

}