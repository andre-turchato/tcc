"""
etl/transformer.py — RF-02, RF-03, RF-04: Transformações dos dados do SIH/SUS.

Aplica as seguintes transformações ao DataFrame bruto:
  - RF-02: Filtro por municípios do Sudoeste do Paraná
  - RF-03: Criação da coluna de faixas etárias
  - RF-04: Criação da coluna de capítulos CID-10
"""

import logging

import pandas as pd

from config import MUNICIPIOS_CSV

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# RF-04 — Mapeamento completo dos capítulos do CID-10
# Chave: prefixo do código CID-10; Valor: numeral romano do capítulo
# ---------------------------------------------------------------------------
_CID_CAPITULOS: dict[tuple[str, str], str] = {
    # Capítulo I — Algumas doenças infecciosas e parasitárias (A00–B99)
    ("A", "B"): "I",
    # Capítulo II — Neoplasias (C00–D48)
    ("C", "D0", "D1", "D2", "D3", "D4"): "II",
    # Capítulo III — Doenças do sangue (D50–D89)
    ("D5", "D6", "D7", "D8"): "III",
    # Capítulo IV — Doenças endócrinas, nutricionais e metabólicas (E00–E89)
    ("E",): "IV",
    # Capítulo V — Transtornos mentais e comportamentais (F00–F99)
    ("F",): "V",
    # Capítulo VI — Doenças do sistema nervoso (G00–G99)
    ("G",): "VI",
    # Capítulo VII — Doenças do olho e anexos (H00–H59)
    ("H0", "H1", "H2", "H3", "H4", "H5"): "VII",
    # Capítulo VIII — Doenças do ouvido (H60–H95)
    ("H6", "H7", "H8", "H9"): "VIII",
    # Capítulo IX — Doenças do aparelho circulatório (I00–I99)
    ("I",): "IX",
    # Capítulo X — Doenças do aparelho respiratório (J00–J99)
    ("J",): "X",
    # Capítulo XI — Doenças do aparelho digestivo (K00–K93)
    ("K",): "XI",
    # Capítulo XII — Doenças da pele (L00–L99)
    ("L",): "XII",
    # Capítulo XIII — Doenças do sistema osteomuscular (M00–M99)
    ("M",): "XIII",
    # Capítulo XIV — Doenças do aparelho geniturinário (N00–N99)
    ("N",): "XIV",
    # Capítulo XV — Gravidez, parto e puerpério (O00–O99)
    ("O",): "XV",
    # Capítulo XVI — Afecções do período perinatal (P00–P96)
    ("P",): "XVI",
    # Capítulo XVII — Malformações congênitas (Q00–Q99)
    ("Q",): "XVII",
    # Capítulo XVIII — Sintomas, sinais e achados anormais (R00–R99)
    ("R",): "XVIII",
    # Capítulo XIX — Lesões, envenenamentos (S00–T98)
    ("S", "T"): "XIX",
    # Capítulo XX — Causas externas (V01–Y98)
    ("V", "W", "X", "Y"): "XX",
    # Capítulo XXI — Fatores que influenciam o estado de saúde (Z00–Z99)
    ("Z",): "XXI",
    # Capítulo XXII — Códigos para propósitos especiais (U00–U99)
    ("U",): "XXII",
}

# Índice plano: prefixo → capítulo (construído uma única vez)
_PREFIXO_PARA_CAPITULO: dict[str, str] = {
    prefixo: capitulo
    for prefixos, capitulo in _CID_CAPITULOS.items()
    for prefixo in prefixos
}


def _classificar_cid(codigo: str) -> str:
    """
    Retorna o capítulo CID-10 em numeral romano dado um código CID.

    A classificação ocorre pelo maior prefixo correspondente encontrado
    (prioridade: 2 caracteres sobre 1), cobrindo os capítulos que
    compartilham a mesma letra inicial (ex: D, H).

    Args:
        codigo (str): Código CID-10 (ex: 'J18', 'K35').

    Returns:
        str: Numeral romano do capítulo (ex: 'X', 'XI') ou 'Desconhecido'.
    """
    if not isinstance(codigo, str) or len(codigo) < 1:
        return "Desconhecido"
    codigo = codigo.strip().upper()
    # Tenta prefixo de 2 caracteres primeiro (ex: 'D5', 'H6')
    prefixo2 = codigo[:2]
    if prefixo2 in _PREFIXO_PARA_CAPITULO:
        return _PREFIXO_PARA_CAPITULO[prefixo2]
    # Tenta prefixo de 1 caractere (ex: 'J', 'K')
    prefixo1 = codigo[:1]
    if prefixo1 in _PREFIXO_PARA_CAPITULO:
        return _PREFIXO_PARA_CAPITULO[prefixo1]
    return "Desconhecido"


def _decodificar_idade_sih(valor: int) -> int:
    """
    Decodifica o campo IDADE do SIH/SUS, que utiliza prefixo de unidade.

    O campo IDADE no SIH/SUS é codificado da seguinte forma:
      - Dígito inicial 1xxx: idade em dias (xxx dias)
      - Dígito inicial 2xxx: idade em meses (xxx meses)
      - Dígito inicial 3xxx: idade em meses (valores 1–11 → meses)
      - Dígito inicial 4xxx: idade em anos (xxx anos, 1 a 99)
      - Dígito inicial 5xxx: idade em anos (100 ou mais)

    Para fins de análise, valores em dias/meses são convertidos para 0 anos,
    e a faixa "0-10" captura esses casos.

    Args:
        valor (int): Valor bruto do campo IDADE.

    Returns:
        int: Idade aproximada em anos inteiros.
    """
    if pd.isna(valor):
        return 0
    valor = int(valor)
    prefixo = valor // 1000
    numero = valor % 1000
    if prefixo == 4:
        return numero      # anos diretamente
    if prefixo == 5:
        return 100 + numero  # 100+ anos
    # prefixo 1 (dias), 2 (meses), 3 (meses < 1 ano) → 0 anos
    return 0


def _classificar_faixa_etaria(idade: int) -> str:
    """
    Retorna a faixa etária padronizada com base na idade em anos.

    Faixas definidas:
      0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+

    Args:
        idade (int): Idade em anos.

    Returns:
        str: String da faixa etária correspondente.
    """
    if idade <= 10:
        return "0-10"
    if idade <= 20:
        return "11-20"
    if idade <= 30:
        return "21-30"
    if idade <= 40:
        return "31-40"
    if idade <= 50:
        return "41-50"
    if idade <= 60:
        return "51-60"
    return "61+"


def _carregar_codigos_municipios() -> set[str]:
    """
    Carrega os códigos IBGE dos municípios do Sudoeste do Paraná a partir
    do arquivo CSV de referência.

    Returns:
        set[str]: Conjunto de códigos IBGE (strings de 6 dígitos).
    """
    df_mun = pd.read_csv(MUNICIPIOS_CSV, dtype={"codigo_ibge": str})
    return set(df_mun["codigo_ibge"].str.strip())


def filtrar_municipios(df: pd.DataFrame) -> pd.DataFrame:
    """
    RF-02 — Filtra o DataFrame mantendo apenas registros cujo código IBGE
    do município de residência (MUNIC_RES) pertence ao Sudoeste do Paraná.

    O campo MUNIC_RES no SIH/SUS possui 6 dígitos. O CSV utiliza o mesmo
    padrão de 6 dígitos.

    Args:
        df (pd.DataFrame): DataFrame bruto do SIH/SUS.

    Returns:
        pd.DataFrame: DataFrame filtrado pelos municípios do Sudoeste do PR.
    """
    codigos = _carregar_codigos_municipios()
    # Garante que a coluna seja tratada como string sem zeros à esquerda perdidos
    df = df.copy()
    df["MUNIC_RES"] = df["MUNIC_RES"].astype(str).str.strip().str.zfill(6)
    antes = len(df)
    df = df[df["MUNIC_RES"].isin(codigos)].reset_index(drop=True)
    logger.info(
        "Filtro de municípios: %d → %d registros (%d removidos).",
        antes,
        len(df),
        antes - len(df),
    )
    return df


def criar_faixa_etaria(df: pd.DataFrame) -> pd.DataFrame:
    """
    RF-03 — Cria a coluna `faixa_etaria` a partir do campo IDADE bruto do
    SIH/SUS, decodificando o prefixo de unidade antes de classificar.

    Args:
        df (pd.DataFrame): DataFrame com a coluna IDADE no formato SIH/SUS.

    Returns:
        pd.DataFrame: DataFrame com a coluna `faixa_etaria` adicionada.
    """
    df = df.copy()
    df["idade_anos"] = df["IDADE"].apply(_decodificar_idade_sih)
    df["faixa_etaria"] = df["idade_anos"].apply(_classificar_faixa_etaria)
    logger.info("Coluna 'faixa_etaria' criada com sucesso.")
    return df


def criar_cid_capitulo(df: pd.DataFrame) -> pd.DataFrame:
    """
    RF-04 — Cria a coluna `cid_capitulo` a partir do campo DIAG_PRINC (CID-10),
    mapeando cada código para o respectivo capítulo em numeral romano.

    Args:
        df (pd.DataFrame): DataFrame com a coluna DIAG_PRINC.

    Returns:
        pd.DataFrame: DataFrame com a coluna `cid_capitulo` adicionada.
    """
    df = df.copy()
    df["cid_capitulo"] = df["DIAG_PRINC"].apply(_classificar_cid)
    logger.info("Coluna 'cid_capitulo' criada com sucesso.")
    return df


def transformar(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aplica todas as transformações ao DataFrame bruto do SIH/SUS.

    Etapas executadas em ordem:
      1. Filtro por municípios do Sudoeste do Paraná (RF-02)
      2. Criação da coluna de faixas etárias (RF-03)
      3. Criação da coluna de capítulos CID-10 (RF-04)
      4. Seleção e renomeação das colunas finais

    Args:
        df (pd.DataFrame): DataFrame bruto do SIH/SUS.

    Returns:
        pd.DataFrame: DataFrame transformado e pronto para carga.
    """
    logger.info("Iniciando transformações — %d registros.", len(df))

    # RF-02: filtro de municípios
    df = filtrar_municipios(df)

    # RF-03: faixas etárias
    df = criar_faixa_etaria(df)

    # RF-04: capítulos CID-10
    df = criar_cid_capitulo(df)

    # Seleção e renomeação para o esquema da tabela `internacoes`
    df_final = pd.DataFrame({
        "municipio_codigo": df["MUNIC_RES"],
        "idade": df["idade_anos"].astype(int),
        "sexo": df["SEXO"].astype(str).str.strip().str.upper(),
        "faixa_etaria": df["faixa_etaria"],
        "cid_principal": df["DIAG_PRINC"].astype(str).str.strip().str.upper(),
        "cid_capitulo": df["cid_capitulo"],
        "valor_total": pd.to_numeric(df["VAL_TOT"], errors="coerce").fillna(0.0),
        "ano_competencia": df["ANO_CMPT"].astype(int) if "ANO_CMPT" in df.columns else 0,
        "mes_competencia": df["MES_CMPT"].astype(int) if "MES_CMPT" in df.columns else 0,
    })

    logger.info("Transformações concluídas — %d registros prontos para carga.", len(df_final))
    return df_final
