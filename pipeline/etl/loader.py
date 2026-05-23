"""
etl/loader.py — RF-05: Carga dos dados transformados no Supabase (PostgreSQL).

Realiza UPSERT dos registros de internações e dos municípios do Sudoeste
do Paraná nas tabelas do banco, registrando o progresso em log.
"""

import logging

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from config import MUNICIPIOS_CSV, SUPABASE_DB_URL

logger = logging.getLogger(__name__)

# Tamanho do lote para inserção em massa (ajustável conforme o ambiente)
TAMANHO_LOTE: int = 1000


def _criar_engine():
    """
    Cria e retorna a engine SQLAlchemy conectada ao Supabase.

    Returns:
        sqlalchemy.engine.Engine: Engine de conexão com o banco.

    Raises:
        RuntimeError: Se a URL de conexão não estiver configurada.
    """
    if not SUPABASE_DB_URL or SUPABASE_DB_URL.startswith("postgresql://:"):
        raise RuntimeError(
            "Variáveis de ambiente de conexão com o Supabase não configuradas. "
            "Verifique o arquivo .env."
        )
    return create_engine(SUPABASE_DB_URL, pool_pre_ping=True)


def carregar_municipios() -> int:
    """
    Realiza o UPSERT dos municípios do Sudoeste do Paraná na tabela
    `municipios_sudoeste`.

    Lê os dados do arquivo CSV de referência e insere/atualiza os registros
    no banco, utilizando a cláusula ON CONFLICT DO UPDATE.

    Returns:
        int: Número de municípios processados.

    Raises:
        SQLAlchemyError: Em caso de erro durante a carga.
    """
    df_mun = pd.read_csv(MUNICIPIOS_CSV, dtype={"codigo_ibge": str})
    engine = _criar_engine()

    sql_upsert = text("""
        INSERT INTO municipios_sudoeste (codigo_ibge, nome, microrregiao)
        VALUES (:codigo_ibge, :nome, :microrregiao)
        ON CONFLICT (codigo_ibge) DO UPDATE
            SET nome         = EXCLUDED.nome,
                microrregiao = EXCLUDED.microrregiao
    """)

    total = 0
    try:
        with engine.begin() as conn:
            for _, row in df_mun.iterrows():
                conn.execute(sql_upsert, {
                    "codigo_ibge": str(row["codigo_ibge"]).strip(),
                    "nome": str(row["nome"]).strip(),
                    "microrregiao": str(row["microrregiao"]).strip() if pd.notna(row.get("microrregiao")) else None,
                })
                total += 1
    except SQLAlchemyError as exc:
        raise SQLAlchemyError(f"Erro ao carregar municípios: {exc}") from exc

    logger.info("Municípios carregados/atualizados: %d", total)
    return total


def carregar_internacoes(df: pd.DataFrame) -> int:
    """
    Realiza o UPSERT em lote dos registros de internações na tabela
    `internacoes`.

    Os registros são inseridos em lotes de tamanho TAMANHO_LOTE para
    evitar sobrecarga de memória. Não há chave única natural além do
    SERIAL, portanto é utilizado INSERT simples (idempotência garantida
    pelo controle de execução do pipeline por mês/ano).

    Args:
        df (pd.DataFrame): DataFrame transformado e pronto para carga.

    Returns:
        int: Total de registros inseridos.

    Raises:
        SQLAlchemyError: Em caso de erro durante a carga.
    """
    if df.empty:
        logger.warning("DataFrame vazio — nenhum registro para carregar.")
        return 0

    engine = _criar_engine()
    total_inseridos = 0

    # Colunas esperadas pela tabela internacoes
    colunas = [
        "municipio_codigo", "idade", "sexo", "faixa_etaria",
        "cid_principal", "cid_capitulo", "valor_total",
        "ano_competencia", "mes_competencia",
    ]

    # Verifica se todas as colunas necessárias estão presentes
    colunas_faltando = [c for c in colunas if c not in df.columns]
    if colunas_faltando:
        raise ValueError(
            f"Colunas ausentes no DataFrame: {colunas_faltando}"
        )

    df_carga = df[colunas].copy()
    total_registros = len(df_carga)
    num_lotes = (total_registros + TAMANHO_LOTE - 1) // TAMANHO_LOTE

    logger.info(
        "Iniciando carga de %d registros em %d lote(s) de até %d.",
        total_registros,
        num_lotes,
        TAMANHO_LOTE,
    )

    i = 0
    try:
        with engine.begin() as conn:
            for i in range(num_lotes):
                inicio = i * TAMANHO_LOTE
                fim = min(inicio + TAMANHO_LOTE, total_registros)
                lote = df_carga.iloc[inicio:fim]

                lote.to_sql(
                    name="internacoes",
                    con=conn,
                    if_exists="append",
                    index=False,
                    method="multi",
                )

                total_inseridos += len(lote)
                logger.info(
                    "Lote %d/%d — %d registros inseridos (total acumulado: %d).",
                    i + 1,
                    num_lotes,
                    len(lote),
                    total_inseridos,
                )
    except SQLAlchemyError as exc:
        raise SQLAlchemyError(
            f"Erro ao carregar internações no lote {i + 1}: {exc}"
        ) from exc

    logger.info("Carga concluída — total de %d registros inseridos.", total_inseridos)
    return total_inseridos
