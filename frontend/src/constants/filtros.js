// Opções de filtros disponíveis na sidebar

/** Capítulos do CID-10 */
export const OPCOES_CID = [
  { valor: '', rotulo: 'Todos' },
  { valor: 'I', rotulo: 'I — Doenças infecciosas e parasitárias' },
  { valor: 'II', rotulo: 'II — Neoplasias (tumores)' },
  { valor: 'III', rotulo: 'III — Doenças do sangue' },
  { valor: 'IV', rotulo: 'IV — Doenças endócrinas e metabólicas' },
  { valor: 'V', rotulo: 'V — Transtornos mentais e comportamentais' },
  { valor: 'VI', rotulo: 'VI — Doenças do sistema nervoso' },
  { valor: 'VII', rotulo: 'VII — Doenças do olho' },
  { valor: 'VIII', rotulo: 'VIII — Doenças do ouvido' },
  { valor: 'IX', rotulo: 'IX — Doenças do aparelho circulatório' },
  { valor: 'X', rotulo: 'X — Doenças do aparelho respiratório' },
  { valor: 'XI', rotulo: 'XI — Doenças do aparelho digestivo' },
  { valor: 'XII', rotulo: 'XII — Doenças da pele' },
  { valor: 'XIII', rotulo: 'XIII — Doenças do sistema osteomuscular' },
  { valor: 'XIV', rotulo: 'XIV — Doenças do aparelho geniturinário' },
  { valor: 'XV', rotulo: 'XV — Gravidez, parto e puerpério' },
  { valor: 'XVI', rotulo: 'XVI — Afecções perinatais' },
  { valor: 'XVII', rotulo: 'XVII — Malformações congênitas' },
  { valor: 'XVIII', rotulo: 'XVIII — Sintomas e sinais não classificados' },
  { valor: 'XIX', rotulo: 'XIX — Lesões e envenenamentos' },
  { valor: 'XX', rotulo: 'XX — Causas externas' },
  { valor: 'XXI', rotulo: 'XXI — Fatores que influenciam o estado de saúde' },
  { valor: 'XXII', rotulo: 'XXII — Códigos especiais' },
];

/** Opções de sexo */
export const OPCOES_SEXO = [
  { valor: '', rotulo: 'Ambos' },
  { valor: 'M', rotulo: 'Masculino' },
  { valor: 'F', rotulo: 'Feminino' },
];

/** Faixas etárias disponíveis */
export const OPCOES_FAIXA_ETARIA = [
  { valor: '', rotulo: 'Todas' },
  { valor: '0-10', rotulo: '0–10 anos' },
  { valor: '11-20', rotulo: '11–20 anos' },
  { valor: '21-30', rotulo: '21–30 anos' },
  { valor: '31-40', rotulo: '31–40 anos' },
  { valor: '41-50', rotulo: '41–50 anos' },
  { valor: '51-60', rotulo: '51–60 anos' },
  { valor: '61+', rotulo: '61+ anos' },
];

/** Estado inicial dos filtros (sem seleção) */
export const FILTROS_INICIAIS = {
  cid_capitulo: '',
  sexo: '',
  faixa_etaria: '',
};
