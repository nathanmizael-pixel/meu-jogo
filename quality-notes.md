# Final Polish & Review — registro de validação

## Teste de fluxo principal

O jogo carregou no navegador com título, favicon, arte hero e texto em português. O shell exibiu o trilho lateral, a barra de recursos, o campo de batalha e o registro de campo sem erros visíveis.

O combate foi validado em sequência: um ataque reduziu a vitalidade do Saqueador de Marga e também reduziu a vitalidade da personagem; a Lança óssea consumiu 12 mana e causou dano adicional; o golpe final marcou o inimigo como derrotado, adicionou 34 XP e concedeu 12 ouro.

O fluxo de necromancia foi validado: o cadáver apareceu como corpo aguardando ritual, o botão “Erguer cadáver” consumiu 18 mana e o exército passou de 1/2 para 2/2 servos, exibindo o Saqueador como recém-erguido. O limite do exército também ficou explícito após o ritual.

Durante a navegação do mapa, a primeira geração assíncrona de duas artes regionais apresentou um estado temporário de placeholder. O caso foi identificado na revisão visual e corrigido regenerando os assets e apontando o código para as novas URLs persistentes antes da entrega.

O atlas foi validado com as sete regiões visíveis, uma região aberta no nível inicial, seis regiões seladas com níveis explícitos, coordenadas, rota anotada e detalhe do bioma. O Grimório foi validado com Lança óssea, Drenar vida e Véu de ossos bloqueado até o nível 3, além dos botões de preparação para retornar ao campo.

O Inventário exibiu equipamento, peso 03/12, Selo do Guardião e Lâmina enferrujada. Quests exibiu a missão principal “Silencie o Guardião do Ossuário”, seus dois objetivos, a condição de nível para abrir o Bosque Velado, as recompensas e a side quest bloqueada pela história.

O primeiro clique automatizado foi capturado antes da atualização assíncrona do React; após aguardar 120 ms, o modal “Como jogar” montou corretamente no DOM e ficou legível, com passos de explorar, confrontar e persistir, além de Restaurar ciclo e Entendi.

Após o carregamento completo dos assets regenerados, a tela de Quests exibiu a nova arte do Guardião do Ossuário sem placeholder. A captura final confirmou a tela de expedição em desktop e a mesma experiência em viewport móvel de 390×844, com navegação horizontal, hero legível, combate e registro de campo empilhados.

## Observação de produto

O build e a checagem TypeScript passaram após a primeira implementação e após a revisão visual. O bundle do frontend permanece funcional; o aviso de tamanho de chunk é de otimização futura, não bloqueia o carregamento nem o fluxo jogável desta entrega estática.
