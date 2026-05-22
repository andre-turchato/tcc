# language: pt

Funcionalidade: Filtros da Sidebar
  Como um profissional de saúde
  Quero filtrar os dados por CID, sexo e faixa etária
  Para analisar segmentos específicos da população

  Cenário: Filtros disponíveis ao carregar
    Dado que o usuário acessa o sistema
    Então a sidebar deve exibir os seguintes filtros:
      | Filtro       | Tipo       |
      | CID-10       | Drop-down  |
      | Sexo         | Drop-down  |
      | Faixa Etária | Drop-down  |
    E o botão "Atualizar Mapa" deve estar visível

  Cenário: Seleção de faixa etária
    Dado que o usuário abre o drop-down de Faixa Etária
    Então as seguintes opções devem estar disponíveis:
      | Opção |
      | 0-10  |
      | 11-20 |
      | 21-30 |
      | 31-40 |
      | 41-50 |
      | 51-60 |
      | 61+   |

  Cenário: Limpeza dos filtros
    Dado que o usuário selecionou filtros e atualizou o mapa
    Quando clica em "Limpar Filtros"
    Então todos os drop-downs devem voltar para o estado padrão ("Todos")
    E o mapa deve atualizar com todos os dados
