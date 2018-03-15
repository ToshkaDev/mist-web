export enum Fields {
    GENOMES_FIELDS = "name,superkingdom,phylum,class,order,family,genus,genbank_version,version,assembly_level",
    GENOME_FIELDS = "",
    GENES_FIELDS = "stable_id,version,names,locus,location,product&fields.Component=version,definition",
    GENE_FIELDS = "stable_id,version,start,stop,names,locus,old_locus,location,product,strand,length,cds_qualifiers,pseudo&fields.Component=version,definition&fields.Component.Genome=version",
}