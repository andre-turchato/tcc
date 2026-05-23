# Diagramas do Projeto Longevus

Esta pasta contém todos os diagramas do sistema em formato **PlantUML** (`.puml`).

## Como Renderizar os Diagramas

### Opção 1 — VS Code
Instale a extensão [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) e use `Alt+D` para preview.

### Opção 2 — Online
Copie o conteúdo de qualquer `.puml` em [https://www.plantuml.com/plantuml](https://www.plantuml.com/plantuml).

### Opção 3 — CLI
```bash
# Instalar
java -jar plantuml.jar diagrama.puml

# Gerar todos de uma vez
java -jar plantuml.jar docs/diagrams/*.puml -o renders/
```

---

## Diagramas Disponíveis

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `arquitetura.puml` | Componentes | Visão geral da arquitetura em camadas |
| `fluxo_etl.puml` | Atividade | Pipeline ETL do DATASUS ao Supabase |
| `sequencia.puml` | Sequência | Fluxo de requisição online (filtros → mapa) |
| `er.puml` | Entidade-Relacionamento | Modelo de dados do banco |
| `jornada_usuario.puml` | Swimlane | Jornada completa do profissional de saúde |
| `componentes_frontend.puml` | Componentes | Componentes React e suas dependências |
| `estado_filtros.puml` | Máquina de Estados | Estados dos filtros e do mapa coroplético |

---

## Diagramas a Adicionar (conforme implementação avança)

- [ ] `casos_de_uso.puml` — Casos de uso do sistema
- [ ] `deploy.puml` — Diagrama de implantação (Supabase + Vercel/Railway)
