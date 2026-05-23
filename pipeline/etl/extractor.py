"""
etl/extractor.py — RF-01: Extração dos dados do SIH/SUS via DATASUS.

Utiliza a biblioteca pysus para realizar o download e leitura dos
arquivos .dbc do Sistema de Informações Hospitalares (SIH/SUS),
retornando um DataFrame pandas com os dados brutos.
"""

import logging

import pandas as pd

from config import ESTADO_DATASUS

logger = logging.getLogger(__name__)


def extrair_dados(ano: int, mes: int) -> pd.DataFrame:
    """
    Extrai os dados brutos do SIH/SUS para o estado do Paraná.

    Realiza o download do arquivo .dbc correspondente ao ano e mês
    informados diretamente do FTP do DATASUS, utilizando a biblioteca
    pysus, e retorna um DataFrame pandas com os registros brutos.

    Args:
        ano (int): Ano de competência (ex: 2023).
        mes (int): Mês de competência (ex: 6).

    Returns:
        pd.DataFrame: DataFrame com os dados brutos do SIH/SUS.

    Raises:
        RuntimeError: Se o download ou leitura do arquivo falhar.
    """
    # Importação local para evitar erro de importação caso pysus não esteja
    # instalado durante execução de testes unitários
    try:
        from pysus.online_data.SIH import download
    except ImportError as exc:
        raise ImportError(
            "A biblioteca pysus não está instalada. "
            "Execute: pip install pysus"
        ) from exc

    logger.info(
        "Iniciando extração SIH/SUS — estado: %s, ano: %d, mês: %02d",
        ESTADO_DATASUS,
        ano,
        mes,
    )

    try:
        # O pysus retorna um objeto Parquet ou lista de arquivos;
        # usamos .to_dataframe() para obter o DataFrame pandas
        arquivos = download(ESTADO_DATASUS, year=ano, month=mes, group="RD")
    except Exception as exc:
        raise RuntimeError(
            f"Falha ao baixar dados do DATASUS para {ESTADO_DATASUS} "
            f"{ano}/{mes:02d}: {exc}"
        ) from exc

    # Suporte às versões do pysus que retornam lista ou objeto único
    if isinstance(arquivos, list):
        if not arquivos:
            raise RuntimeError(
                f"Nenhum arquivo encontrado para {ESTADO_DATASUS} {ano}/{mes:02d}."
            )
        dfs = []
        for arq in arquivos:
            try:
                dfs.append(arq.to_dataframe())
            except AttributeError:
                # Versões mais antigas retornam o DataFrame diretamente
                dfs.append(arq)
        df = pd.concat(dfs, ignore_index=True)
    else:
        try:
            df = arquivos.to_dataframe()
        except AttributeError:
            df = arquivos

    if df.empty:
        logger.warning(
            "O arquivo do SIH/SUS para %s %d/%02d está vazio.",
            ESTADO_DATASUS,
            ano,
            mes,
        )

    logger.info("Extração concluída — %d registros brutos obtidos.", len(df))
    return df
