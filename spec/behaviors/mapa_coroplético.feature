# language: pt

Funcionalidade: Mapa Coroplético Interativo
  Como um profissional de saúde do Sudoeste do Paraná
  Quero visualizar um mapa colorido com dados de internações
  Para identificar padrões de utilização dos serviços de saúde por município

  Cenário: Exibição inicial do mapa
    Dado que o usuário acessa o sistema Longevus
    Quando o mapa é carregado
    Então os municípios do Sudoeste do Paraná devem ser renderizados
    E todos os municípios devem estar coloridos com a escala padrão

  Cenário: Aplicação de filtro por CID e sexo
    Dado que o usuário seleciona o capítulo CID "X" (Doenças respiratórias)
    E seleciona o sexo "Masculino"
    Quando clica em "Atualizar Mapa"
    Então o mapa deve atualizar em menos de 2 segundos
    E os municípios devem ser coloridos conforme o total de atendimentos filtrados
    E municípios com mais atendimentos devem aparecer em vermelho
    E municípios com menos atendimentos devem aparecer em amarelo

  Cenário: Tooltip ao passar o mouse
    Dado que o mapa está renderizado com dados
    Quando o usuário passa o mouse sobre um município
    Então deve aparecer um tooltip com:
      | Campo               | Exemplo           |
      | Nome do município   | Francisco Beltrão |
      | Total atendimentos  | 1.500             |
      | Valor total         | R$ 250.000,50     |

  Cenário: Nenhum resultado para os filtros
    Dado que o usuário seleciona filtros sem registros correspondentes
    Quando clica em "Atualizar Mapa"
    Então todos os municípios devem aparecer sem coloração
    E uma mensagem "Nenhum dado encontrado para os filtros selecionados" deve ser exibida
