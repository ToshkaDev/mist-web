import _ from "lodash";

export enum TypeNames {
    PFAM = "pfam",
    LOW_COMPL_SEGS = "lowComplSegs",
    COILED_COILS = "coiledCoils",
    TM_HMM = "tmHmm",
    SEQUENCE = "sequence"
}

export class AseqViewModel {
    private pfam: any = {"type": TypeNames.PFAM, "value": []};
    private lowComplSegs: any = {"type": TypeNames.LOW_COMPL_SEGS, "value": []};
    private coiledCoils: any = {"type": TypeNames.COILED_COILS, "value": []};
    private tmHmm: any = {"type": TypeNames.TM_HMM, "value": []};
    private sequence: any = {"type": TypeNames.SEQUENCE, "value": []};
    private sequenceLineLen = 60;

    private activeHeaders: any[];
    private activeProperties: any;

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

    private typeNameToProperties: Map<string, any> = new Map([
        [TypeNames.PFAM, this.pfam],
        [TypeNames.LOW_COMPL_SEGS, this.lowComplSegs],
        [TypeNames.COILED_COILS, this.coiledCoils],
        [TypeNames.TM_HMM, this.tmHmm],
        [TypeNames.SEQUENCE, this.sequence]
    ]);

    //TODO
    private coiledCoilsHeaders: Map<string, any[]>;
    //TODO
    private tmHmmHeaders: Map<string, any[]>;

    //ADD here other headers when they done
    private typeNameToHeaders: Map<string, any[]> = new Map([
        [TypeNames.PFAM, this.pfamHeaders],
        [TypeNames.LOW_COMPL_SEGS, this.lowComplSegsHeaders],
        [TypeNames.SEQUENCE, []]
    ]);

    constructor(aseqData: any) {
        if (aseqData) {
            this.initializeProperties(aseqData.pfam30, this.pfam, this.pfamHeaders);
            this.initializeLowComplSegsProperties(aseqData.segs, this.lowComplSegs);
            this.initializeSequencesProperties(aseqData.sequence, this.sequence);
        }
    }

    private initializeSequencesProperties(sequence: string, property: any) {
        let stringWithSpaceChars = "";
        let piece = Math.floor(sequence.length/this.sequenceLineLen);
        for (var i = 0; i < piece; i++) {
            stringWithSpaceChars = stringWithSpaceChars + " " + sequence.substring(i*this.sequenceLineLen, (i+1)*this.sequenceLineLen);
        }
        stringWithSpaceChars = stringWithSpaceChars + " " + sequence.substring(i*this.sequenceLineLen, sequence.length);
        property.value.push([stringWithSpaceChars.trim()]);
    }


    private initializeProperties(pfamData: any[], property: any, headers: any[])  {
        for (let index in pfamData) {
            let properties = [];
            let elementToPush;
            for (let element of headers) {
                if (element.name === "#")
                    elementToPush = +index+1+'.';
                else 
                    elementToPush = _.get(pfamData[index], element.value);
                properties.push(elementToPush);
            }
            property.value.push(properties);    
        }
    }

    private initializeLowComplSegsProperties(segs: any[], property: any) {
        for (let index in segs) {
            let properties = [];
            properties.push(+index+1+'.', segs[index][0], segs[index][1]);
            property.value.push(properties);
        }
    }

    public getSequence(): string {
        return String(this.sequence.value[0]);
    }

    changeActiveHeaders(dataTypeName: string) {
        this.activeHeaders = this.typeNameToHeaders.get(dataTypeName);
    }

    changeActiveProperties(dataTypeName: string) {
        this.activeProperties = this.typeNameToProperties.get(dataTypeName);
    }

}