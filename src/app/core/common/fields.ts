const fieldMap = new Map<string, string>([
    ["genomes", "id,name,taxonomy_id,superkingdom,phylum,class,order,family,genus,genbank_version,version,assembly_level"],
    ["genomes_shopcart", "id,name,taxonomy_id,superkingdom,phylum,class,order,family,genus,genbank_version,version,assembly_level"],
    ["genome", "&fields.WorkerModule"],
    ["genes", "id,stable_id,version,names,locus,location,product&fields.Component=version,definition&fields.Aseq"],
    ["genes_inside_genome", "id,stable_id,version,names,locus,location,product&fields.Aseq"],
    ["genes_shopcart", "id,stable_id,version,names,locus,location,product&fields.Component=version,definition&fields.Aseq"],
    ["scope", "id,version,name,assembly_level"],
    ["neighbour_genes", ""],
    ["gene","id,stable_id,aseq_id,version,start,stop,names,locus,old_locus,location,product,strand,length,cds_qualifiers,pseudo&fields.Component=version,definition&fields.Component.Genome=version&fields.Aseq&fields.SignalGene"],
    ["signal_genes","&fields.Gene=id,stable_id,version,names,locus,location,product&fields.Gene.Aseq"],
]);

export { fieldMap };
