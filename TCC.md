# ANÁLISE GEOESPACIAL DOS PADRÕES DE UTILIZAÇÃO DOS SERVIÇOS DE SAÚDE PÚBLICA NO SUDOESTE DO PARANÁ A PARTIR DE DADOS ABERTOS

**André Luiz Costa da Silva**

---

## Resumo

Este trabalho apresenta uma análise geoespacial dos padrões de utilização dos serviços de saúde pública no Sudoeste do Paraná, utilizando dados abertos do Sistema Único de Saúde (SUS). A pesquisa tem como objetivo identificar o perfil dos usuários, os principais motivos de busca por atendimentos hospitalares e os valores financeiros associados, por meio da aplicação de filtros dinâmicos por Classificação Internacional de Doenças (CID), sexo e faixa etária. Para isso, foram utilizadas técnicas de engenharia de software voltadas à extração, transformação e análise de dados, integradas a ferramentas de geoprocessamento para geração de mapas dinâmicos. Os resultados evidenciam a concentração territorial dos atendimentos e permitem discutir padrões de comportamento social relacionados ao acesso à saúde pública na região estudada.

**Palavras-chave:** saúde pública; dados abertos; engenharia de software; análise geoespacial; SUS.

## Abstract

This work presents a geospatial analysis of public health service usage patterns in the Southwest region of Paraná, Brazil, using open data from the Unified Health System (SUS). The study aims to identify user profiles, the main reasons for hospital admissions, and the associated financial values through dynamic filtering by International Classification of Diseases (ICD), sex, and age group.

To achieve this, software engineering techniques for data extraction, transformation, and analysis were combined with geoprocessing resources for the generation of dynamic maps. The resulting platform supports territorial interpretation of hospital admission patterns and contributes to data-driven decision-making in public health.

**Keywords:** public health; open data; software engineering; geospatial analysis; SUS.

---

## 1 Introdução

O Sistema Único de Saúde (SUS), é uma das principais políticas públicas brasileiras, destacando-se como caso de sucesso a nível global, garantindo acesso universal aos serviços de saúde. A grande quantidade de dados geradas diariamente através da interação entre usuários e serviços possibilita a realização de análises para compreensão do comportamento social relacionado ao uso dos serviços, além de possibilitar pontos de atenção para os municípios, para atuarem de maneira preventiva.

Nesse contexto, a engenharia de software desempenha papel fundamental ao viabilizar a extração, o tratamento e a análise de grandes volumes de dados públicos, permitindo transformar dados brutos em informações relevantes para um público que geralmente tem baixa afinidade com bases de dados. A utilização de técnicas de análise geoespacial potencializa esse processo ao possibilitar a visualização territorial dos fenômenos estudados de maneira mais acessível.

Diante disso, este trabalho propõe a análise de dados abertos do SUS com foco no Sudoeste do Paraná, buscando identificar padrões de utilização dos serviços de saúde pública, o perfil dos usuários, os principais motivos de busca e os valores financeiros associados aos atendimentos.

### 1.1 Objetivo Geral

Desenvolver uma plataforma de análise geoespacial capaz de extrair, transformar, armazenar e visualizar dados públicos de internações hospitalares do SUS, permitindo a identificação de padrões territoriais de utilização dos serviços de saúde no Sudoeste do Paraná.

### 1.2 Objetivos Específicos

- Estruturar um pipeline ETL para obtenção e tratamento dos dados do SIH/SUS;
- Consolidar os dados em banco relacional com suporte geoespacial;
- Disponibilizar uma API para consulta agregada por município;
- Implementar uma interface web interativa com filtros por capítulo CID-10, sexo e faixa etária;
- Apoiar a interpretação dos dados por profissionais de saúde com baixa afinidade técnica.

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

### 4.2 API Backend (Longevus API)

A camada de API foi implementada na pasta `backend/` utilizando **Node.js 20+** e o framework **Fastify**, escolhido por sua baixa latência, suporte nativo a rotas assíncronas e serialização JSON otimizada.

#### 4.2.1 Endpoints implementados

**`GET /api/indicadores`** (RF-06 e RF-07): Recebe os parâmetros opcionais `cid_capitulo`, `sexo` e `faixa_etaria`, valida seus valores e retorna dados agregados de internações por município no formato:

```json
{ "dados": [{ "codigo_ibge": "411850", "total_atendimentos": 1500, "valor_total": 250000.50 }] }
```

**`GET /api/geometria`** (RF-08): Serve o arquivo estático GeoJSON com a malha territorial dos municípios do Sudoeste do Paraná, adicionando o header `Cache-Control: max-age=86400` para aproveitamento de cache no cliente e em proxies intermediários.

#### 4.2.2 Organização em camadas

O código está organizado em quatro camadas independentes:

- **Routes** — recebem a requisição HTTP e delegam para os services
- **Services** — aplicam a lógica de negócio (validação, cache, orquestração)
- **Repositories** — encapsulam o acesso ao banco de dados (Supabase)
- **Lib/Utils** — módulos transversais (cliente Supabase, cache, validadores, padronização de resposta)

#### 4.2.3 Cache in-memory (RF-09)

Para evitar sobrecarga no banco de dados com consultas repetidas, o endpoint `/api/indicadores` implementa cache **in-memory** com a biblioteca `node-cache`. A chave de cache é composta pelos três parâmetros de filtro:

```
indicadores:{cid_capitulo}:{sexo}:{faixa_etaria}
```

O TTL padrão é de 300 segundos (5 minutos), configurável via variável de ambiente `CACHE_TTL_SECONDS`. Ao reiniciar o servidor, o cache é limpo automaticamente.

#### 4.2.4 Fluxo de uma requisição

O diagrama de sequência abaixo ilustra o caminho completo de uma requisição do frontend até a resposta:

![Diagrama de Sequência](docs/diagrams/renders/sequencia.png)

> 📄 Código-fonte: [`docs/diagrams/sequencia.puml`](docs/diagrams/sequencia.puml)

### 4.3 Modelo de Dados

A geração dos mapas dinâmicos foi realizada por meio da aplicação de filtros por CID, sexo e faixa etária, possibilitando a visualização da concentração dos atendimentos e dos valores financeiros por município.

O processo de criação de tabelas no Supabase utilizou o seguinte modelo:

![Diagrama de Entidade-Relacionamento](docs/diagrams/renders/er.png)

> 📄 Código-fonte: [`docs/diagrams/er.puml`](docs/diagrams/er.puml)

### 4.4 Interface Web (Frontend)

A interface web do Longevus foi implementada como uma *Single Page Application* (SPA) utilizando React 18 com Vite como bundler. A aplicação consome os dois endpoints da API e apresenta os dados de forma visual e interativa ao profissional de saúde.

#### 4.4.1 React e Vite

O React foi escolhido por sua abordagem declarativa de construção de interfaces: a UI é descrita como função dos dados, e o framework se responsabiliza por atualizar o DOM de forma eficiente quando os dados mudam. O Vite oferece servidor de desenvolvimento com *Hot Module Replacement* (HMR) instantâneo e build otimizado via Rollup.

#### 4.4.2 Leaflet e Mapa Coroplético

O Leaflet é a principal biblioteca JavaScript para mapas interativos. Em conjunto com a camada `react-leaflet`, a geometria dos municípios retornada pelo endpoint `GET /api/geometria` é renderizada como um `GeoJSON` com estilo dinâmico. Cada município recebe uma cor proporcional ao seu `total_atendimentos` dentro de uma escala de cinco níveis, do amarelo (`#ffffb2`) ao vermelho escuro (`#bd0026`), implementada no utilitário `colorScale.js`. Municípios sem dados são exibidos em cinza neutro. Ao passar o mouse sobre um município, um tooltip exibe o nome, o total de atendimentos e o valor total em BRL.

#### 4.4.3 TanStack Query

O TanStack Query (React Query) é responsável pelo gerenciamento do ciclo de vida de todas as requisições HTTP. O hook `useGeometria` carrega o GeoJSON ao iniciar a aplicação, com cache de 1 hora no cliente. O hook `useIndicadores` é habilitado somente após o usuário clicar em "Atualizar Mapa", evitando requisições desnecessárias. A biblioteca gerencia automaticamente os estados de `loading`, `error` e `success`, que são repassados aos componentes visuais de feedback (`EstadoCarregamento`).

#### 4.4.4 Fluxo de Interação

O diagrama de estados abaixo descreve o comportamento da aplicação conforme o usuário interage com os filtros:

![Diagrama de Estados dos Filtros](docs/diagrams/renders/estado_filtros.png)

> 📄 Código-fonte: [`docs/diagrams/estado_filtros.puml`](docs/diagrams/estado_filtros.puml)

A estrutura de componentes do frontend é apresentada no diagrama a seguir:

![Diagrama de Componentes do Frontend](docs/diagrams/renders/componentes_frontend.png)

> 📄 Código-fonte: [`docs/diagrams/componentes_frontend.puml`](docs/diagrams/componentes_frontend.puml)

---

## 5 Jornada do Usuário

O sistema foi projetado para profissionais de saúde com baixa afinidade técnica. A jornada completa do usuário dentro da plataforma Longevus é apresentada abaixo:

![Jornada do Usuário](docs/diagrams/renders/jornada_usuario.png)

> 📄 Código-fonte: [`docs/diagrams/jornada_usuario.puml`](docs/diagrams/jornada_usuario.puml)

---

## 6 Resultados e Discussão

### 6.1 Implementação da Plataforma

O principal resultado deste trabalho foi a implementação funcional da plataforma Longevus, composta por pipeline ETL em Python, banco de dados PostgreSQL/PostGIS no Supabase, API REST em Node.js/Fastify e frontend web em React com mapa coroplético. A solução construída materializa, em um único fluxo, todas as etapas necessárias para transformar dados públicos brutos em visualizações analíticas acessíveis.

Do ponto de vista da engenharia de software, o trabalho demonstrou a viabilidade da separação em camadas, permitindo que coleta, processamento, disponibilização e visualização dos dados fossem desenvolvidos de forma modular. Essa organização favoreceu manutenção, evolução incremental e reaproveitamento dos componentes, além de permitir que a lógica analítica permanecesse desacoplada da interface de usuário.

### 6.2 Contribuições Técnicas

Na camada de dados, o pipeline implementado automatiza a obtenção dos arquivos do DATASUS, filtra os municípios de interesse e padroniza variáveis importantes para análise, como faixa etária e capítulo CID-10. Essa etapa reduz o esforço manual necessário para preparar bases públicas, além de tornar o processo reproduzível para novas competências mensais.

Na camada de serviços, a API backend centraliza as regras de validação e agregação, expondo consultas simplificadas para o frontend. A adoção de cache in-memory para o endpoint de indicadores reduz consultas repetidas ao banco e melhora a responsividade percebida pelo usuário durante a exploração dos filtros.

Na camada de apresentação, a interface web entrega o resultado analítico de forma visual. O uso de mapa coroplético com tooltip e filtros combinados permite observar diferenças territoriais entre municípios, identificar concentrações de atendimentos e explorar recortes específicos por perfil populacional. Com isso, o sistema amplia o potencial de uso dos dados por gestores e profissionais da saúde no apoio à leitura exploratória do território.

### 6.3 Limitações Observadas

Embora o trabalho não substitua análises epidemiológicas aprofundadas, ele fornece uma base tecnológica sólida para investigação inicial de padrões espaciais. Entre as limitações observadas, destacam-se a dependência da atualização periódica das bases do DATASUS, a qualidade dos registros administrativos de origem e a necessidade de evolução contínua da base cartográfica e dos indicadores analíticos disponíveis.

---

## 7 Considerações Finais

Este trabalho evidenciou que a combinação entre dados abertos, engenharia de software e análise geoespacial pode produzir instrumentos relevantes para a compreensão do uso dos serviços públicos de saúde. Ao integrar ETL, armazenamento estruturado, API e visualização interativa, o sistema Longevus transforma uma base de dados complexa em uma ferramenta mais acessível para consulta e interpretação.

Como contribuição prática, o projeto entrega uma aplicação que permite filtrar e visualizar internações hospitalares do SUS no Sudoeste do Paraná sob diferentes recortes analíticos. Como contribuição acadêmica, demonstra uma aplicação concreta de conceitos de engenharia de software, arquitetura em camadas, processamento de dados e geotecnologias em um problema real de interesse público.

Como continuidade, o trabalho pode evoluir com a incorporação de séries históricas, novos indicadores epidemiológicos, exportação de relatórios, autenticação de perfis institucionais e ampliação do recorte geográfico. Ainda assim, a versão atual já estabelece uma base consistente para futuras pesquisas e para apoio a processos de tomada de decisão orientados por dados.

---

## Referências

- BRASIL. Ministério da Saúde. DATASUS – Departamento de Informática do SUS. Disponível em: https://datasus.saude.gov.br.
- BRASIL. Lei nº 8.080, de 19 de setembro de 1990. Dispõe sobre as condições para a promoção, proteção e recuperação da saúde.
- IBGE – Instituto Brasileiro de Geografia e Estatística. Bases cartográficas municipais. Disponível em: https://www.ibge.gov.br.
- KITCHIN, R. *The Data Revolution: Big Data, Open Data, Data Infrastructures and Their Consequences*. London: Sage, 2014.
- PRESSMAN, R. S.; MAXIM, B. R. *Engenharia de Software: Uma Abordagem Profissional*. Porto Alegre: McGraw-Hill, 2016.
