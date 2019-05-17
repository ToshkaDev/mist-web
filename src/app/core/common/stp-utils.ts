export enum PrimaryRank {
  ecf = 'ecf',
  ocp = 'ocp',
  tcp = 'tcp',
  chemotaxis = 'chemotaxis',
  other = 'other',
}

export enum SecondaryRank {
  chea = 'chea',
  cheb = 'cheb',
  checx = 'checx',
  ched = 'ched',
  cher = 'cher',
  chev = 'chev',
  chew = 'chew',
  chez = 'chez',
  hhk = 'hhk',
  hk = 'hk',
  hrr = 'hrr',
  rr = 'rr',
  mcp = 'mcp',
  other = 'other',
}

export const PrimaryRankMap = {
  [PrimaryRank.chemotaxis]: 'Chemotaxis',
  [PrimaryRank.ecf]: 'ECP',
  [PrimaryRank.ocp]: 'OCP',
  [PrimaryRank.other]: 'Other',
  [PrimaryRank.tcp]: 'TCP',
};

export const PrimaryRankNameMap = {
  [PrimaryRank.chemotaxis]: 'Chemotaxis',
  [PrimaryRank.ecf]: 'Extracytoplasmic Function Sigma Factor',
  [PrimaryRank.ocp]: 'One-component protein',
  [PrimaryRank.other]: 'Other',
  [PrimaryRank.tcp]: 'Two-component protein',
};

export const SecondaryRankMap = {
  [SecondaryRank.chea]: 'CheA',
  [SecondaryRank.cheb]: 'CheB',
  [SecondaryRank.checx]: 'CheCX',
  [SecondaryRank.ched]: 'CheD',
  [SecondaryRank.cher]: 'CheR',
  [SecondaryRank.chev]: 'CheV',
  [SecondaryRank.chew]: 'CheW',
  [SecondaryRank.chez]: 'CheZ',
  [SecondaryRank.hhk]: 'HHK',
  [SecondaryRank.hk]: 'HK',
  [SecondaryRank.hrr]: 'HRR',
  [SecondaryRank.mcp]: 'MCP',
  [SecondaryRank.other]: 'Other',
  [SecondaryRank.rr]: 'RR',
};

export const SecondaryRankNameMap = {
  [SecondaryRank.chea]: 'CheA',
  [SecondaryRank.cheb]: 'CheB',
  [SecondaryRank.checx]: 'CheCX',
  [SecondaryRank.ched]: 'CheD',
  [SecondaryRank.cher]: 'CheR',
  [SecondaryRank.chev]: 'CheV',
  [SecondaryRank.chew]: 'CheW',
  [SecondaryRank.chez]: 'CheZ',
  [SecondaryRank.hhk]: 'Hybrid histidine kinase',
  [SecondaryRank.hk]: 'Histidine kinase',
  [SecondaryRank.hrr]: 'Hybrid response regulator',
  [SecondaryRank.mcp]: 'Methyl-accepting chemotaxis protein',
  [SecondaryRank.other]: 'Other',
  [SecondaryRank.rr]: 'Response regulator',
};

export const capitalizeRanks = (ranks: string[]): string[] => {
  const numRanks = ranks.length;
  if (!numRanks) {
    return [];
  }

  const result = [...ranks];
  result[0] = PrimaryRankMap[ranks[0]] || ranks[0];
  if (numRanks > 1) {
    result[1] = SecondaryRankMap[ranks[1]] || ranks[1];
  }
  return result;
};

export const unabbreviateRanks = (ranks: string[]): string[] => {
  const numRanks = ranks.length;
  if (!numRanks) {
    return [];
  }

  const result = [...ranks];
  result[0] = PrimaryRankNameMap[ranks[0]] || ranks[0];
  if (numRanks > 1) {
    result[1] = SecondaryRankNameMap[ranks[1]] || ranks[1];
  }
  return result;
};
