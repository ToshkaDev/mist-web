const fieldMap = new Map<string, string>([
    ["GENOMES", "name,superkingdom,phylum,class,order,family,genus,genbank_version,version,assembly_level"],
    ["GENOME", ""],
    ["GENES", "stable_id,version,names,locus,location,product&fields.Component=version,definition"],
    ["NEIGHBOUR_GENES",""],
    ["GENE","stable_id,aseq_id,version,start,stop,names,locus,old_locus,location,product,strand,length,cds_qualifiers,pseudo&fields.Component=version,definition&fields.Component.Genome=version&fields.Aseq"],
]);

export { fieldMap };
