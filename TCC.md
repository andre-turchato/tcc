# ANÁLISE GEOESPACIAL DOS PADRÕES DE UTILIZAÇÃO DOS SERVIÇOS DE SAÚDE PÚBLICA NO SUDOESTE DO PARANÁ A PARTIR DE DADOS ABERTOS

**André Luiz Costa da Silva**

---

## Resumo

Este trabalho apresenta uma análise geoespacial dos padrões de utilização dos serviços de saúde pública no Sudoeste do Paraná, utilizando dados abertos do Sistema Único de Saúde (SUS). A pesquisa tem como objetivo identificar o perfil dos usuários, os principais motivos de busca por atendimentos hospitalares e os valores financeiros associados, por meio da aplicação de filtros dinâmicos por Classificação Internacional de Doenças (CID), sexo e faixa etária. Para isso, foram utilizadas técnicas de engenharia de software voltadas à extração, transformação e análise de dados, integradas a ferramentas de geoprocessamento para geração de mapas dinâmicos. Os resultados evidenciam a concentração territorial dos atendimentos e permitem discutir padrões de comportamento social relacionados ao acesso à saúde pública na região estudada.

**Palavras-chave:** saúde pública; dados abertos; engenharia de software; análise geoespacial; SUS.

---

## 1 Introdução

O Sistema Único de Saúde (SUS), é uma das principais políticas públicas brasileiras, destacando-se como caso de sucesso a nível global, garantindo acesso universal aos serviços de saúde. A grande quantidade de dados geradas diariamente através da interação entre usuários e serviços possibilita a realização de análises para compreensão do comportamento social relacionado ao uso dos serviços, além de possibilitar pontos de atenção para os municípios, para atuarem de maneira preventiva.

Nesse contexto, a engenharia de software desempenha papel fundamental ao viabilizar a extração, o tratamento e a análise de grandes volumes de dados públicos, permitindo transformar dados brutos em informações relevantes para um público que geralmente tem baixa afinidade com bases de dados. A utilização de técnicas de análise geoespacial potencializa esse processo ao possibilitar a visualização territorial dos fenômenos estudados de maneira mais acessível.

Diante disso, este trabalho propõe a análise de dados abertos do SUS com foco no Sudoeste do Paraná, buscando identificar padrões de utilização dos serviços de saúde pública, o perfil dos usuários, os principais motivos de busca e os valores financeiros associados aos atendimentos.

---

## 2 Saúde Pública, Dados Abertos e Comportamento Social

O estado atual da saúde pública está diretamente relacionado às condições sociais, econômicas e demográficas da população. O acesso aos serviços de saúde e os motivos de busca por atendimento refletem aspectos do comportamento social, alimentar e profissional, além da organização territorial.

A política de dados abertos no Brasil tem ampliado o acesso a informações governamentais, permitindo que pesquisadores utilizem bases públicas para análises diversas. No âmbito da saúde, o DATASUS disponibiliza dados administrativos e epidemiológicos que possibilitam estudos sobre o uso do SUS em diferentes regiões do país, possibilitando extração com base em município, sexo, idade e Classificação Internacional de Doenças (CID).

A análise desses dados, quando associada a recortes geográficos e demográficos, contribui para a compreensão das desigualdades regionais e dos padrões de demanda por serviços de saúde específicos.

---

## 3 Engenharia de Software Aplicada à Análise Geoespacial

A engenharia de software aplicada à análise de dados públicos envolve a definição de processos sistemáticos para extração, transformação, armazenamento e análise das informações. Neste trabalho, adotou-se um pipeline de engenharia de dados que integra banco de dados relacional, processamento analítico e visualização geoespacial.

O uso de sistemas de informações geográficas (SIG) possibilita a geração de mapas dinâmicos, os quais facilitam a interpretação dos dados e a identificação de padrões territoriais, por parte dos profissionais de saúde. A aplicação de filtros por CID, sexo e faixa etária permite análises segmentadas, evidenciando diferentes comportamentos sociais no uso dos serviços de saúde.

### 3.1 Arquitetura do Sistema

O sistema Longevus é composto por três camadas principais, conforme ilustrado no diagrama abaixo:

![Diagrama de Arquitetura](docs/diagrams/renders/arquitetura.png)

> 📄 Código-fonte: [`docs/diagrams/arquitetura.puml`](docs/diagrams/arquitetura.puml)

A separação em camadas garante que cada componente evolua de forma independente, facilitando a manutenção e testabilidade do sistema.

---

## 4 Metodologia

O estudo foi delimitado à região do Sudoeste do Paraná, considerando dados de internações hospitalares do SUS.

Os dados foram obtidos a partir do Sistema de Informações Hospitalares do SUS (SIH/SUS), por meio dos arquivos reduzidos referentes ao estado do Paraná. As variáveis analisadas incluíram município de residência, idade, sexo, diagnóstico principal (CID-10) e valor total pago pela internação.

### 4.1 Pipeline de Dados (ETL)

Após a extração, os dados passaram por etapas de limpeza e transformação, utilizando a linguagem Python, incluindo a criação de faixas etárias e o agrupamento dos códigos CID-10 por capítulos. Em seguida, os dados foram armazenados em banco de dados relacional com suporte geoespacial, permitindo consultas analíticas e integração com a base cartográfica dos municípios.

O fluxo completo do pipeline ETL é descrito no diagrama a seguir:

#### 4.1.1 Implementação do Pipeline

O pipeline ETL foi implementado na pasta `pipeline/` utilizando Python 3.10+, organizado em três módulos principais dentro do pacote `etl/`:

**Extração (`etl/extractor.py` — RF-01):** Utiliza a biblioteca `pysus` para realizar o download automático dos arquivos `.dbc` do SIH/SUS diretamente do FTP do DATASUS, referentes ao estado do Paraná. O módulo aceita parâmetros de ano e mês de competência via linha de comando e retorna um `pandas.DataFrame` com os dados brutos.

**Transformação (`etl/transformer.py` — RF-02, RF-03, RF-04):** Aplica três transformações sequenciais ao DataFrame bruto: (i) filtro dos registros pelo código IBGE do município de residência (`MUNIC_RES`), mantendo apenas os 42 municípios do Sudoeste do Paraná listados em `data/municipios_sudoeste.csv`; (ii) decodificação e classificação da idade bruta do SIH/SUS (que utiliza prefixo de unidade) em faixas etárias padronizadas (`0-10`, `11-20`, `21-30`, `31-40`, `41-50`, `51-60`, `61+`); e (iii) mapeamento do campo `DIAG_PRINC` (CID-10) para o capítulo correspondente em numeral romano (I a XXII), cobrindo todos os capítulos da Classificação Internacional de Doenças.

**Carga (`etl/loader.py` — RF-05):** Conecta ao Supabase via `sqlalchemy` utilizando variáveis de ambiente configuradas no arquivo `.env`. Realiza o UPSERT dos municípios na tabela `municipios_sudoeste` e a inserção em lotes na tabela `internacoes`, registrando o progresso em log a cada lote processado.

**Orquestração (`main.py`):** O script de entrada aceita argumentos `--ano` e `--mes` via CLI e executa as três etapas em sequência, registrando início, fim e total de registros processados. Exemplo de uso:

```bash
python main.py --ano 2023 --mes 6
```

![Diagrama de Fluxo ETL](docs/diagrams/renders/fluxo_etl.png)

> 📄 Código-fonte: [`docs/diagrams/fluxo_etl.puml`](docs/diagrams/fluxo_etl.puml)

### 4.2 Fluxo de Requisição (Online)

Durante o uso do sistema, o fluxo de dados entre frontend, API e banco segue a sequência ilustrada abaixo:

![Diagrama de Sequência](docs/diagrams/renders/sequencia.png)

> 📄 Código-fonte: [`docs/diagrams/sequencia.puml`](docs/diagrams/sequencia.puml)

### 4.3 Modelo de Dados

A geração dos mapas dinâmicos foi realizada por meio da aplicação de filtros por CID, sexo e faixa etária, possibilitando a visualização da concentração dos atendimentos e dos valores financeiros por município.

O processo de criação de tabelas no Supabase utilizou o seguinte modelo:

![Diagrama de Entidade-Relacionamento](docs/diagrams/renders/er.png)

> 📄 Código-fonte: [`docs/diagrams/er.puml`](docs/diagrams/er.puml)

---

## 5 Jornada do Usuário

O sistema foi projetado para profissionais de saúde com baixa afinidade técnica. A jornada completa do usuário dentro da plataforma Longevus é apresentada abaixo:

![Jornada do Usuário](docs/diagrams/renders/jornada_usuario.png)

> 📄 Código-fonte: [`docs/diagrams/jornada_usuario.puml`](docs/diagrams/jornada_usuario.puml)

---

## Referências

- BRASIL. Ministério da Saúde. DATASUS – Departamento de Informática do SUS. Disponível em: https://datasus.saude.gov.br.
- BRASIL. Lei nº 8.080, de 19 de setembro de 1990. Dispõe sobre as condições para a promoção, proteção e recuperação da saúde.
- IBGE – Instituto Brasileiro de Geografia e Estatística. Bases cartográficas municipais. Disponível em: https://www.ibge.gov.br.
- KITCHIN, R. *The Data Revolution: Big Data, Open Data, Data Infrastructures and Their Consequences*. London: Sage, 2014.
- PRESSMAN, R. S.; MAXIM, B. R. *Engenharia de Software: Uma Abordagem Profissional*. Porto Alegre: McGraw-Hill, 2016.
