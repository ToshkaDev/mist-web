export interface Aseq {
    id: string;
    length: number;
    sequence: string;
    pfam31: pfamInterface[];
    agfam2: any[];
    ecf1: any[];
    segs: any[];
    coils: any[];
    tmhmm2?: {
      tms: [number, number][];
    }
}

export interface pfamInterface {
    name: string;
    score: number;
    bias: number;
    c_evalue: number;
    i_evalue: number;
    hmm_from: number;
    hmm_to: number;
    hmm_cov: string;
    ali_from: number;
    ali_to: number;
    ali_cov: string;
    env_from: number;
    env_to: number;
    env_cov: string;
    acc: number
}
