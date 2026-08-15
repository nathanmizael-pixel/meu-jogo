# Expansão do Atlas — Necromancer Realms

- [x] Auditar o modelo atual de regiões, inimigos, seleção de alvo e progressão.
- [x] Definir novas regiões exploráveis com requisitos de nível, bioma, clima e identidade narrativa.
- [x] Criar novos encontros com regras distintas de combate, incluindo elites, emboscadas e eventos de risco.
- [x] Adicionar inimigos desafiadores com atributos, variantes, recompensas e textos de combate próprios.
- [x] Integrar as novas regiões ao atlas, ao breadcrumb e ao botão de rota.
- [x] Integrar encontros e inimigos à expedição, ao alvo selecionado e ao registro de campo.
- [x] Gerar ou atualizar assets visuais necessários para as novas áreas sem placeholders.
- [x] Testar desbloqueios, exploração, combate, necromancia, quests e responsividade.
- [x] Executar a checagem de TypeScript e o build de produção.
- [ ] Salvar um checkpoint final da expansão e entregar a versão ao usuário.

## Memória do mundo e consequências persistentes

- [x] Auditar eventos de estrada, regiões, encontros, Atlas e estados já persistidos.
- [x] Definir marcos narrativos que possam criar abrigos, silenciar estradas ou transformar o estado de uma região.
- [x] Criar modelo persistente para escolhas mundiais, estruturas emergentes, reputação regional e linhas de consequência.
- [x] Integrar marcas narrativas e estruturas desbloqueadas ao Atlas, à Expedição e ao Diário de Campo.
- [x] Alterar encontros, recompensas e textos regionais segundo os marcos ativos.
- [x] Validar sequências de escolha, save/load/reset, efeitos no combate, desktop, mobile, TypeScript e build.
- [ ] Salvar checkpoint e entregar a memória do mundo.

## Facção persistente: Culto da Lua Velada

- [x] Auditar eventos de estrada, recompensas, encontros e estados de relacionamento persistentes.
- [x] Definir estágios de confiança, aparições regionais, relíquia, favor exigido e condições de traição.
- [x] Criar estado persistente do culto e gatilhos de avanço sem duplicar recompensas.
- [x] Integrar escolhas do culto aos eventos, Atlas, Expedição e Diário de Campo.
- [x] Implementar a relíquia, o favor de facção e o encontro de traição com consequências reais.
- [x] Validar aliança, ruptura, save/load/reset, TypeScript, build e responsividade.
- [ ] Salvar checkpoint e entregar a facção do culto.

## Reino reativo: chefes ressuscitados

- [x] Auditar ressurreições de chefes, memória do mundo, eventos de estrada e persistência já existentes.
- [x] Definir rumores, regiões de influência e consequências narrativas para cada chefe que Veyra ressuscitar.
- [x] Criar modelo persistente para a presença mundial dos soberanos ressuscitados.
- [x] Adicionar novos acontecimentos de estrada condicionados à ressurreição de cada chefe.
- [x] Exibir os rumores no Atlas, na Expedição e no Diário de Campo.
- [x] Validar ressurreições, eventos, save/load/reset, TypeScript, build e responsividade.
- [ ] Salvar checkpoint e entregar as reações do reino.

## Memórias dos Mortos: personagens da legião

- [x] Auditar servos, evolução, morte permanente, Diário de Campo, eventos e saves existentes.
- [x] Definir personagens-servos, memórias graduais, vínculos regionais, gatilhos e heranças narrativas.
- [x] Criar estado persistente para memórias desbloqueadas, conflitos e recompensas de legado.
- [x] Integrar as memórias à Necromancia, Expedição, Diário de Campo e acontecimentos de estrada.
- [x] Implementar missões de legado, diálogos, bônus e novas rotas ou eventos ligados a servos marcantes.
- [x] Validar progressão, bônus, morte, ressurreição, save/load/reset, TypeScript, build e responsividade.
- [ ] Salvar checkpoint e entregar os personagens da legião.

## Vínculos da legião: lealdade e conflito

- [x] Auditar servos marcantes, Memórias dos Mortos, escolhas de eventos e save atual.
- [x] Definir atributos de vínculo, limites narrativos, respostas e modificadores por servo.
- [x] Criar estado persistente de lealdade, medo, rancor, devoção, corrupção e confiança.
- [x] Mostrar barras e leituras relacionais no Códice da Legião e no Diário de Campo.
- [x] Implementar confrontos em acontecimentos de estrada, incluindo recusa, apoio e consequências reais.
- [x] Validar mudanças de vínculo, conflitos, bônus, save/load/reset, TypeScript, build e responsividade.
- [ ] Salvar checkpoint e entregar os vínculos da legião.

## Doutrinas inimigas: personalidade de combate

- [x] Auditar famílias inimigas, posturas, telegráficos, IA tática e entradas do Bestiário.
- [x] Definir doutrinas de cultistas, mortos-vivos, bestas, magos e cavaleiros, incluindo contrajogadas claras.
- [x] Implementar prioridades de alvo, comportamentos coordenados e gatilhos de família no combate.
- [x] Exibir sinais de doutrina na Estação de Combate e progressão de conhecimento no Bestiário.
- [x] Associar domínio de doutrina a estratégias, recompensas e informações desbloqueáveis.
- [x] Validar IA, telegráficos, contrajogadas, Bestiário, TypeScript, build e responsividade.
- [ ] Salvar checkpoint e entregar as doutrinas inimigas.

## Combos de Legião: formações e sinergias

- [x] Auditar formação ativa, afinidades, servos, chefes ressuscitados e ações do combate.
- [x] Definir receitas de formação, sinergias elementais e técnicas de chefes, com custos e contrapartidas.
- [x] Criar detecção de composição e estado de combos disponíveis sem duplicar recompensas.
- [x] Implementar execução de técnicas coletivas e efeitos táticos na Estação de Combate.
- [x] Exibir receitas, condições seladas e combos ativos na Necromancia e na Estação de Combate.
- [x] Validar formação, custos, efeitos, save/load/reset, TypeScript, build e responsividade.
- [ ] Salvar checkpoint e entregar os Combos de Legião.

## Sinergias de Build: juramento, equipamento e legião

- [x] Auditar juramentos, efeitos de equipamento, relíquias, servos e gatilhos de combate existentes.
- [x] Definir receitas de build para Senhor dos Ossos, Lich, Ceifador e Mestre das Almas, com contrapartidas táticas.
- [x] Criar um catálogo de sinergias que detecte condições de juramento, itens equipados, relíquias e composição ativa.
- [x] Integrar bônus e gatilhos ao dano, mana, corrupção, quedas de servos, ressurreição e recompensas de combate.
- [x] Exibir receitas seladas, sinergias ativas e suas condições no Grimório e na Necromancia.
- [x] Validar persistência, equilíbrio, desktop/mobile, TypeScript e build de produção.
- [x] Salvar checkpoint e entregar as sinergias de build.

## Cidadela viva: interiores e base de Veyra

- [x] Auditar os seis edifícios, níveis de melhoria, ações atuais, navegação e estados persistentes da Cidadela.
- [x] Definir a planta navegável, a hierarquia visual e a identidade de Torre Arcana, Cripta da Legião, Forja Mortuária, Altar das Almas, Biblioteca e Jardim Profano.
- [x] Criar uma vista-base da Cidadela e interiores acessíveis por entrada e retorno, com atmosfera, objetos e personagens próprios.
- [x] Conectar Torre Arcana a ritos e juramentos; Cripta a servos e evolução; Forja a equipamentos; Altar a almas e ressurreições.
- [x] Conectar Biblioteca ao Bestiário e Jardim Profano aos recursos, preservando as melhorias já adquiridas.
- [x] Validar navegação, persistência, acessibilidade, desktop/mobile, TypeScript e build de produção.
- [x] Salvar checkpoint e entregar a Cidadela explorável.

## NPCs recorrentes: habitantes da Cidadela

- [x] Auditar interiores, estados de campanha, recursos e serviços existentes para conectar moradores sem duplicar fluxos.
- [x] Definir O Cartógrafo, a Mercadora de Cinzas, o Ferreiro Mortuário, a Sacerdotisa Exilada e o Servo Antigo, com voz, local e arco de campanha.
- [x] Criar dados persistentes de presença, estágio de diálogo, descobertas e interações concluídas para cada NPC.
- [x] Inserir cenas, retratos e escolhas nos interiores da Cidadela, com mudanças legíveis conforme a campanha avança.
- [x] Conectar cartografia ao Atlas, comércio ao Inventário, forja ao Arsenal, sacerdotisa aos ritos e servo às memórias de Veyra.
- [x] Validar custos, recompensas, save/load/reset, desktop/mobile, TypeScript e build de produção.
- [x] Salvar checkpoint e entregar os NPCs recorrentes.

## Campanha principal: os cinco atos de Veyra

- [x] Auditar regiões, chefes, Memórias dos Mortos, Culto, marcos mundiais, Novo Ciclo e estados de campanha existentes.
- [x] Definir os atos A Insepulta, Os Mortos Lembram, O Reino Submerso, Os Cinco e O Reino dos Mortos, com metas, revelações e sinais de progresso.
- [x] Criar estado persistente para capítulo, cenas vistas, decisões de legado, afinidade de desfecho e conclusão de campanha.
- [x] Integrar avanços e cenas aos encontros, regiões, ressurreições de chefes, habitantes, memórias e acontecimentos de estrada.
- [x] Criar o manuscrito da campanha, revelações de ato e o ritual de decisão final com finais distintos.
- [x] Conectar desfechos ao Novo Ciclo, preservando consequências e desbloqueios narrativos coerentes.
- [x] Validar progressão, save/load/reset, escolhas, finais, desktop/mobile, TypeScript e build de produção.
- [x] Salvar checkpoint e entregar a campanha principal.

## Doutrinas de reino: escolhas que definem o final

- [x] Auditar eventos, escolhas de legado, campanha, Culto, habitantes, Cidadela, legião e ritos finais já persistentes.
- [x] Definir Reino da Morte, Reino da Ordem, Reino da Alma e Reino da Corrupção, com valores, identidade visual, bônus e contrapartidas.
- [x] Criar estado persistente de afinidade, limiares de doutrina, decisões marcantes e escolha soberana final.
- [x] Integrar ganhos de afinidade a eventos, memórias, habitantes, ressurreições, servos e decisões da campanha.
- [x] Alterar Cidadela, diálogos, reações de NPCs, comportamento da legião e textos de mundo pela doutrina dominante.
- [x] Integrar doutrina ao rito final, forma do chefe final, desfecho e legado do Novo Ciclo.
- [x] Validar progressão, save/load/reset, escolhas, desktop/mobile, TypeScript e build de produção.
- [x] Salvar checkpoint e entregar as doutrinas de reino.

## Reputação de facções: o nome de Veyra

- [ ] Auditar Vilas, Mercadores, Cultistas, Igreja e Mortos, além de comércio, eventos, missões, diálogos e recompensas existentes.
- [ ] Definir faixas de reputação, títulos relacionais, limiares de aliança/hostilidade e consequências para cada facção.
- [ ] Criar estado persistente de reputação, histórico de atos e modificadores derivados por facção.
- [ ] Integrar ganhos e perdas de reputação às decisões de estrada, memórias, ressurreições, doutrinas e moradores da Cidadela.
- [ ] Conectar reputação a preços, estoque, eventos, missões, diálogos, recompensas e variantes de inimigos.
- [ ] Exibir o Livro de Reputação no Diário e comunicar mudanças de relação com clareza.
- [ ] Validar economia, save/load/reset, limiares, desktop/mobile, TypeScript e build de produção.
- [ ] Salvar checkpoint e entregar o sistema de reputação.

## Recompensas regionais

- [x] Auditar o inventário, os espólios atuais, a progressão de XP e o save local.
- [x] Definir um item único e um bônus de experiência para cada nova região.
- [x] Conceder recompensas por encontro vencido sem duplicar itens únicos.
- [x] Exibir item, bônus e progresso no registro de campo e no Inventário.
- [x] Persistir recompensas, XP e estado de coleta no save local.
- [x] Testar vitórias comuns, elites, chefes, duplicatas e carregamento do save.
- [x] Executar a checagem de TypeScript, o build e a revisão responsiva.

## Animação de drop de relíquias

- [x] Auditar o ponto de concessão da relíquia e o feedback atual de toast/registro.
- [x] Definir a sequência de drop, brilho, partículas, texto e duração do estado.
- [x] Implementar overlay de recompensa com relíquia, bônus de XP e ouro de primeiro clear.
- [x] Adicionar brilho, partículas e movimento de entrada sem depender de imagem externa.
- [x] Respeitar `prefers-reduced-motion` e manter leitura clara em mobile.
- [x] Testar conclusão inédita, recompensa repetida, fechamento e persistência.
- [x] Executar TypeScript/build e revisar visualmente em desktop/mobile.

## Balanceamento de combate e servos

- [x] Auditar dano do jogador, dano dos inimigos, retaliação, vida e duração dos encontros.
- [x] Definir papéis dos servos, escalonamento por quantidade e limite de segurança para o jogador.
- [x] Ajustar inimigos comuns, elites e chefes para exigirem decisões e uso de recursos.
- [x] Implementar contribuição real dos servos em dano, proteção e efeitos de suporte.
- [x] Comunicar no combate quanto cada servo contribuiu e quais riscos foram mitigados.
- [x] Testar combates com zero, um, dois e vários servos, incluindo chefes e regras especiais.
- [x] Executar TypeScript/build e revisar visualmente em desktop/mobile.

## Catálogo visual e chefes ressuscitáveis

- [x] Auditar nomes, imagens, regiões, itens, monstros e chefes existentes.
- [x] Definir um nome e uma imagem coerente para cada região, item e monstro exibido.
- [x] Integrar os assets disponíveis a monstros, chefes, itens e mapas sem placeholders.
- [x] Restringir a ressurreição aos chefes derrotados pelo jogador.
- [x] Criar habilidades próprias para cada chefe ressuscitado.
- [x] Integrar habilidades dos chefes à barra de comandos, mana e registro de campo.
- [x] Exibir imagens, nomes, estados de derrota e habilidades no atlas, Inventário e Necromancia.
- [x] Testar carregamento, legibilidade em desktop/mobile, persistência de estado e responsividade.
- [x] Executar TypeScript/build e revisar visualmente em desktop/mobile.

## Retratos e rituais animados

- [x] Auditar monstros, espectros e chefes que ainda compartilham imagem ou não têm retrato próprio.
- [x] Definir retratos individuais para cada espécie disponível no bestiário.
- [x] Integrar retratos compostos de espectros, chefes e monstros sem placeholders.
- [x] Criar feedback de impacto para ataque físico, magia e habilidades de chefes.
- [x] Criar animação ritual de ressurreição para chefes derrotados.
- [x] Respeitar movimento reduzido e preservar legibilidade em mobile.
- [x] Testar imagens, composição desktop/mobile e TypeScript/build.

## Retratos originais de chefes

- [x] Auditar os chefes existentes e as artes atualmente associadas a cada um.
- [x] Definir uma composição visual original para cada chefe, com silhueta, arma, magia e cenário próprios.
- [x] Criar retratos vetoriais de chefe de fantasia sombria de mesa, sem logos, personagens ou arte oficial de terceiros.
- [x] Integrar cada retrato ao bestiário, à Necromancia, aos comandos e aos overlays de ressurreição.
- [x] Testar corte, contraste e legibilidade dos retratos em desktop e mobile.
- [x] Executar TypeScript/build e revisar visualmente em desktop/mobile.

## Habilidade reutilizável para RPG dark-fantasy

- [x] Mapear o fluxo reutilizável de expansão, arte, combate, necromancia, validação e entrega.
- [x] Inicializar a habilidade com a estrutura oficial e escrever instruções acionáveis.
- [x] Validar o pacote da habilidade e entregar o arquivo instalável.

## Reforma tática do combate

 - [x] Auditar a resolução atual de dano, turnos, magia, servos, chefes e registros de combate.
 - [x] Modelar tipos de dano, afinidades, status, posturas, ações defensivas e cadeias de combo.
 - [x] Implementar dano elemental, resistências, fraquezas, status e interações de combo.
 - [x] Implementar bloqueio, esquiva, contra-ataque, posturas e escolhas de risco de mana.
 - [x] Implementar telegráficos, interrupções e o Dilúvio Abissal do Arauto da Maré.
 - [x] Atualizar o campo de batalha, os comandos e o registro para comunicar estados táticos.
 - [x] Testar vitórias, derrotas, salvamento, responsividade, TypeScript e build de produção.
- [x] Salvar checkpoint e entregar a versão tática do combate.

## Correção urgente de dano e sobrevivência

- [x] Reproduzir o bloqueio de dano e auditar alvo, eventos de clique e resolução de turnos.
- [x] Corrigir o fluxo que impede causar dano aos inimigos.
- [x] Rebalancear dano, vida, defesa e retaliação no início do jogo.
- [x] Validar vitórias, derrota, retirada e salvamento em encontros iniciais.
- [x] Salvar checkpoint e entregar a correção.

## Necromancia estratégica: legião dos mortos

- [x] Auditar os servos, chefes ressuscitados, formação, salvamento e interface atuais.
- [x] Modelar classe, nível, raridade, atributos, afinidade, origem, passivas, ativas e trilhas de evolução.
- [x] Implementar o códice de servos e a árvore de evolução com requisitos de nível e fragmentos.
- [x] Implementar morte permanente, registro dos caídos e ressurreição com perda de atributos.
- [x] Adicionar fragmentos de alma como recurso de recuperação e evolução.
- [x] Integrar passivas, habilidades ativas e atributos dos servos ao combate tático.
- [x] Atualizar Necromancia, Expedição e save/load para os novos estados da legião.
- [x] Testar evolução, perda, ressurreição, combate, persistência, desktop e mobile.
- [x] Salvar checkpoint e entregar a legião necromântica.

## Estação única de combate

- [x] Auditar os cards, barras e comandos de combate atualmente dispersos.
- [x] Unificar alvo, vida inimiga, vida, mana, estados e golpes em uma única estação de batalha.
- [x] Remover redundâncias visuais e preservar apenas ações contextuais essenciais.
- [x] Ajustar leitura, foco e responsividade em desktop e mobile.
- [x] Validar dano, recursos, troca de alvo e comandos de batalha.
- [x] Salvar checkpoint e entregar a estação única de combate.

## Combate compacto sem rolagem

- [x] Medir os blocos que empurram ataques e ritos para fora do primeiro enquadramento.
- [x] Compactar recursos, leitura do alvo, postura e telegráficos sem remover funções.
- [x] Manter todos os golpes, ritos e reações acessíveis no campo de combate.
- [x] Validar altura, interação e responsividade em desktop e mobile.
- [x] Salvar checkpoint e entregar a versão compacta.

## Progressão profunda do Necromante

- [x] Auditar o nivelamento, XP, grimório, combate, legião e persistência atuais.
- [x] Modelar Poder, Vitalidade, Intelecto, Domínio e Corrupção, com efeitos claros por ponto.
- [x] Implementar pontos de atributo, pontos de talento e migração de saves existentes.
- [x] Criar as árvores Senhor dos Ossos, Ceifador, Lich e Mestre das Almas.
- [x] Conectar atributos e talentos a dano, vida, mana, status, servos e rituais.
- [x] Criar um grimório visual para consultar e investir na progressão.
- [x] Validar ganho de XP, escolhas, efeitos, combate, save/load e telas desktop/mobile.
- [x] Salvar checkpoint e entregar a progressão profunda.

## Alvo automático e identificação superior

- [x] Auditar a troca atual de alvo, morte de inimigos e posição do card de identificação.
- [x] Selecionar automaticamente o primeiro monstro vivo e avançar ao próximo após cada derrota.
- [x] Mover nome, tipo e vitalidade do alvo para acima dos golpes e ritos.
- [x] Validar sequência de mortes, dano, leitura desktop/mobile e persistência.
- [x] Salvar checkpoint e entregar a automação de alvos.

## Juramentos iniciais e maestria até nível 70

- [x] Auditar especializações, escolha inicial, nivelamento, efeitos de combate e save/load.
- [x] Modelar os quatro juramentos como escolha inicial exclusiva com trilha contínua até o nível 70.
- [x] Criar níveis de juramento, requisitos de nível, marcos e escalonamento de bônus por caminho.
- [x] Integrar os bônus contínuos de cada juramento a atributos, ritos e formação da legião.
- [x] Atualizar o Grimório para escolha inicial, progresso atual e próximos marcos até o nível 70.
- [x] Migrar saves existentes sem juramento escolhido e validar persistência, desktop e mobile.
- [x] Executar TypeScript, build e testes de progressão; checkpoint final pendente.

## Foco no juramento selado

- [x] Revisar a lista de árvores exibida antes e depois da escolha inicial.
- [x] Ocultar os três juramentos não escolhidos após o selo e manter apenas o caminho ativo.
- [x] Validar a escolha inicial, o Grimório selado, TypeScript e o build de produção.
- [ ] Salvar checkpoint e entregar a simplificação visual.

## Identidades mecânicas regionais

- [x] Auditar regiões, encontros, regras especiais e a resolução atual de turnos.
- [x] Definir um ciclo ambiental legível e uma decisão de preparação para cada região.
- [x] Implementar maré, espinhos, eclipse e demais condições regionais no combate e na exploração.
- [x] Comunicar previsão, estado atual, consequência e contrajogo na Expedição e na Estação de Combate.
- [x] Validar efeitos, persistência, desktop, mobile, TypeScript e build.
- [ ] Salvar checkpoint e entregar a expansão regional.

## Eventos de estrada e decisões persistentes

- [x] Auditar exploração, save local, quest log e superfícies de interação da Expedição.
- [x] Definir eventos de estrada, escolhas, recompensas, riscos e consequências futuras.
- [x] Implementar eventos aleatórios regionais com opções de ressuscitar, saquear, ajudar ou seguir viagem.
- [x] Criar retornos persistentes: missão, loja, informação, recompensa e possível traição.
- [x] Exibir histórico de decisões e estados futuros no registro de campo.
- [x] Validar sorteio, escolhas, persistência, desktop, mobile, TypeScript e build.
- [ ] Salvar checkpoint e entregar a expansão de eventos.

## Atlas de passagens registradas

- [x] Auditar o estado atual da região, os saves legados e a renderização dos nós do mapa.
- [x] Registrar cada região visitada sem confundir território atual, visitado e ainda inexplorado.
- [x] Criar marcas de atlas para primeira passagem, retorno e rota atual.
- [x] Validar persistência, contraste desktop/mobile, TypeScript e build.
- [ ] Salvar checkpoint e entregar o atlas marcado.

## Arenas especiais de chefe

- [x] Auditar chefes, telegráficos, estados, objetivos existentes e a resolução de dano.
- [x] Definir fases, objetivos ambientais e contrajogos para Guardião, Arauto, Matriarca, Astrônomo e Hierofante.
- [x] Implementar cadáveres-escudo, inundação, raízes, constelações e cristais como elementos de arena interativos.
- [x] Exibir estado da arena, ameaças e comandos de resposta na Estação de Combate.
- [x] Validar vitórias, falhas, fases, save/load, desktop, mobile, TypeScript e build.
- [ ] Salvar checkpoint e entregar as arenas de chefe.

## Correção de conclusão de side quest

- [x] Auditar o botão, o estado de conclusão e a concessão atual de XP.
- [x] Bloquear conclusões repetidas e migrar saves que possam ter o estado inconsistente.
- [x] Recalibrar a recompensa de XP da side quest para o estágio inicial da campanha.
- [x] Validar cliques repetidos, save/load, ganho de nível, TypeScript e build.
- [ ] Salvar checkpoint e entregar a correção.

## Equipamentos e buildcraft necromântico

- [x] Auditar inventário, relíquias, equipamentos atuais, atributos e fórmulas de combate.
- [x] Definir os slots de arma, armadura, relíquia, amuleto, grimório e artefato necromântico.
- [x] Criar catálogo de equipamentos, raridades, efeitos passivos e sinergias de build.
- [x] Implementar equipar, desequipar, persistir loadout e comunicar bônus ativos.
- [x] Conectar dano de servos, recuperação de mana, execução e outros efeitos ao combate.
- [x] Validar troca de itens, saves legados, desktop, mobile, TypeScript e build.
- [ ] Salvar checkpoint e entregar a expansão de equipamentos.

## Cidadela Necromântica

- [x] Auditar progressão, legião, equipamentos, recursos e navegação para integrar o hub.
- [x] Definir Torre Arcana, Cripta, Forja, Altar das Almas, Biblioteca e Jardim Profano com níveis e custos.
- [x] Criar o estado persistente da Cidadela, melhorias e os bônus passivos de cada construção.
- [x] Implementar a tela visual da ruína que se torna reino e os controles de aprimoramento.
- [x] Conectar melhorias a magias, servos, forja, conhecimento inimigo e produção de recursos.
- [x] Validar custos, progressão, save/load, desktop, mobile, TypeScript e build.
- [ ] Salvar checkpoint e entregar a Cidadela Necromântica.

## Missões e objetivos secundários

- [x] Auditar quests, inimigos, relíquias, servos e progresso persistente atual.
- [x] Definir contratos, caçadas, relíquias perdidas, histórias e memórias de servos.
- [x] Implementar metas rastreáveis, recompensas únicas e conclusão persistente.
- [x] Criar um Diário de Campo com filtros, progresso e retornos narrativos.
- [x] Conectar mortes, descobertas, itens e servos aos objetivos secundários.
- [x] Validar recompensas, save/load, desktop, mobile, TypeScript e build.
- [x] Salvar checkpoint e entregar a expansão de missões.

## Bestiário tático e conhecimento de ameaça

- [x] Auditar os cartões de bestiário, catálogo de inimigos, combate e dados salvos existentes.
- [x] Definir níveis de conhecimento por descoberta, confronto e derrota de cada inimigo.
- [x] Modelar desbloqueios graduais de afinidades, comportamento, espólios, lore e estratégia.
- [x] Integrar o progresso de conhecimento a encontros, mortes e chefes derrotados com persistência.
- [x] Criar a interface do Bestiário tático com indicadores de pesquisa e conteúdo bloqueado.
- [x] Validar desbloqueios, save/load, desktop, mobile, TypeScript e build.
- [x] Salvar checkpoint e entregar a expansão do Bestiário.

## Manuscrito necromântico premium

- [x] Auditar a linguagem visual da Expedição, do Atlas, do Diário e dos estados de descoberta existentes.
- [x] Definir materiais de página, tinta, selo, mancha ritual e anotações manuscritas para a interface.
- [x] Criar estágios narrativos para regiões: desconhecida, mapeada e conhecimento absoluto.
- [x] Integrar cartografia desenhada, etiquetas de pesquisa e selos de progresso aos painéis principais.
- [x] Adicionar microanimações de virar página, escrita gradual e carimbos, respeitando movimento reduzido.
- [x] Validar contraste, hierarquia, desktop, mobile, TypeScript e build.
- [x] Salvar checkpoint e entregar a revisão premium de interface.

## Paisagem sonora adaptativa

- [x] Auditar a arquitetura atual de áudio, controles, regiões, ciclos ambientais, combates e chefes.
- [x] Definir motivos musicais, ambientes e assinaturas sonoras originais para cada bioma e chefe.
- [x] Implementar um motor de áudio adaptativo com volume, pausa e preferência persistente.
- [x] Conectar ambientes, rituais, criaturas e transições dos ciclos regionais aos gatilhos de som.
- [x] Criar transições sonoras de ameaça e assinaturas para os chefes, incluindo o eclipse do Observatório.
- [x] Validar interação por gesto, silêncio, performance, desktop, mobile, TypeScript e build.
- [x] Salvar checkpoint e entregar a camada sonora.

## Estados táticos de vitória e derrota

- [x] Auditar o fim dos combates, o cálculo de espólios, o histórico e as métricas disponíveis.
- [x] Definir os critérios de vitória perfeita, brutal, arcana e necromântica, além dos estados de derrota.
- [x] Registrar durante cada combate mortes de servos, execuções, ritos e ataques diretos.
- [x] Conceder bônus únicos de XP, ouro, fragmentos e conhecimento sem duplicação de recompensa.
- [x] Criar um veredito ritual visual para vitória e derrota com resumo das ações táticas.
- [x] Validar critérios, saves, combate, responsividade, TypeScript e build.
- [x] Salvar checkpoint e entregar os estados táticos.

## Novo Ciclo e modos de desafio

- [x] Auditar conclusão de campanha, escalonamento de encontros, chefes, recursos e morte de servos.
- [x] Definir o Novo Ciclo, variantes de conteúdo e regras dos modos Pesadelo, Lich e Iron Soul.
- [x] Implementar estado persistente de ciclo, modo ativo e modificadores de combate, economia e ressurreição.
- [x] Criar encontros e relíquias exclusivas do Novo Ciclo, além de regras ampliadas para chefes.
- [x] Construir a interface de seleção, status e avisos de desafio no manuscrito.
- [x] Validar progressão, limites de recursos, morte permanente, save/load, desktop, mobile, TypeScript e build.
- [x] Salvar checkpoint e entregar o Novo Ciclo.

## Cinemáticas de ressurreição de chefes

- [x] Auditar a ressurreição atual, os chefes elegíveis, o save, a camada sonora e os comandos que precisam ser bloqueados.
- [x] Definir as cinco configurações de cinematica, os pontos reservados para vídeos e o fallback ritual sem vídeo.
- [x] Criar um componente reutilizável com carregamento sob demanda, pular, erro seguro e conclusão única.
- [x] Integrar a cena ao fluxo existente para só efetivar a ressurreição depois da cena ou do fallback.
- [x] Persistir cenas vistas e reduzir repetições, sem permitir duplicação de chefes ou de servos.
- [x] Aplicar HUD bloqueada, efeitos de energia, fumaça, vinheta, áudio atenuado, acessibilidade e responsividade.
- [x] Validar vídeos ausentes, pular, save/load, desktop, mobile, TypeScript e build.
- [x] Salvar checkpoint e entregar as cinemáticas de ressurreição.

## Vídeos cinematográficos reais de ressurreição

- [x] Auditar os dados canônicos, as afinidades e as assinaturas táticas dos cinco chefes.
- [x] Gerar e integrar o MP4 animado do Guardião do Ossuário, com áudio, duração de 8 segundos e reprodução verificada.
- [ ] Gerar e integrar o MP4 animado do Arauto da Maré quando a cota de vídeo estiver disponível.
- [ ] Gerar e integrar o MP4 animado da Matriarca da Rosa Negra quando a cota de vídeo estiver disponível.
- [ ] Gerar e integrar o MP4 animado do Astrônomo Faminto quando a cota de vídeo estiver disponível.
- [ ] Gerar e integrar o MP4 animado do Hierofante do Sal Negro quando a cota de vídeo estiver disponível.
- [x] Preservar o fallback ritual, o botão de pular, a conclusão única e a persistência de cenas vistas.
- [ ] Validar o fluxo completo da ressurreição com os cinco MP4s integrados.

## Artes cinematográficas estáticas de ressurreição

- [x] Confirmar a identidade canônica do Arauto da Maré, Matriarca da Rosa Negra, Astrônomo Faminto e Hierofante do Sal Negro.
- [x] Gerar arte 16:9 original para a ressurreição do Arauto da Maré.
- [x] Gerar arte 16:9 original para a ressurreição da Matriarca da Rosa Negra.
- [x] Gerar arte 16:9 original para a ressurreição do Astrônomo Faminto.
- [x] Gerar arte 16:9 original para a ressurreição do Hierofante do Sal Negro.
- [x] Mapear somente as quatro artes no catálogo de ressurreição, sem alterar o Guardião do Ossuário.
- [x] Aprimorar a apresentação com efeitos específicos, transição, pulo, fallback e redução de movimento.
- [x] Validar as quatro cenas por inspeção dos assets, mapeamento no catálogo, TypeScript, build e captura responsiva; a lógica já validada de criação, save/load e conclusão única permaneceu inalterada.
- [ ] Salvar checkpoint e entregar as artes cinematográficas integradas.

## Progressão adaptativa de XP sem grind
- [x] Auditar a curva atual, fontes de XP, níveis recomendados e dados persistidos no save.
- [x] Definir uma curva moderada de XP por nível e o orçamento de progressão das 11 regiões.
- [x] Aplicar escala por diferença de nível, bônus por primeira vitória e redução gradual de conteúdo repetido.
- [x] Integrar XP de descoberta, encontro especial, evento, bestiário, relíquia e objetivos secundários sem duplicação.
- [x] Conceder bônus opcionais de desempenho por fraqueza explorada, risco e legião preservada.
- [x] Exibir um detalhamento de ganho e uma celebração compacta para vitórias importantes e subidas de nível.
- [x] Persistir a nova telemetria de vitórias, descobertas e repetição com migração de saves existentes.
- [x] Simular a campanha das 11 regiões e validar que a rota principal encerra no nível 14 sem repetição obrigatória; a quinta repetição rende 11% da primeira vitória equivalente.
- [x] Validar TypeScript, build, combate, necromancia, save/load, desktop e mobile.
- [ ] Salvar checkpoint e entregar o sistema de progressão adaptativa.

## Música dinâmica e efeitos sonoros contextuais
- [x] Auditar o motor Web Audio existente, preferências, perfil regional e todos os pontos de ação que precisam de áudio.
- [x] Definir cenas de exploração, tensão, combate comum, elite, chefe, fase final, vitória, derrota e evento.
- [x] Criar um gerenciador central com buses separados para música, ambiente, efeitos e interface, com ducking e transições suaves.
- [x] Mapear efeitos próprios para golpes, tipos de magia, ritos, servos, chefes, críticos, mortes, níveis e recompensas.
- [x] Integrar cenas e efeitos a combate, eventos, exploração, necromancia, ressurreição, progressão e interface.
- [x] Criar controles persistentes de volume e silêncio independentes para música, efeitos e ambiente.
- [x] Respeitar desbloqueio por gesto, movimento reduzido, prevenção de sobreposição e desempenho web.
- [x] Validar TypeScript, build, transições, vitória, derrota, eventos, habilidades, saves, desktop e mobile.
- [x] Salvar checkpoint e entregar o sistema sonoro expandido.

## Correção de desbloqueio de áudio

- [x] Reproduzir a ausência de som e auditar o estado do contexto Web Audio após o primeiro gesto.
- [x] Corrigir inicialização, retomada e disparo da cena musical inicial dentro de uma interação permitida pelo navegador.
- [x] Garantir que música, ambiente e efeitos respeitem os controles persistentes sem permanecer em silêncio indevido.
- [x] Validar desbloqueio, troca de cena, música e efeitos em desktop e mobile; executar TypeScript e build.
- [ ] Salvar checkpoint e entregar a correção de áudio.

## Biblioteca de músicas instrumentais reais

- [x] Definir a identidade musical, duração e ponto de loop de cada cena dinâmica.
- [x] Gerar faixa instrumental de exploração para os territórios conhecidos.
- [x] Gerar faixa instrumental de tensão para ameaças próximas e encontros revelados.
- [x] Gerar faixa instrumental de combate comum e outra de combate elite.
- [x] Gerar faixa instrumental de chefe e outra para a fase final.
- [x] Gerar faixas instrumentais de evento, ritual, vitória e derrota.
- [x] Hospedar todas as faixas como assets persistentes do projeto.
- [x] Conectar a biblioteca ao bus musical com pré-carregamento, crossfade, loop seguro e fallback procedural.
- [x] Validar cenas, troca de faixa, mixer, silêncio, falha de arquivo, TypeScript e build.
- [ ] Salvar checkpoint e entregar a biblioteca musical integrada.

## Trilhas regionais exclusivas

- [x] Gerar e integrar trilha própria para Verge de Cinza.
- [x] Gerar e integrar trilha própria para Vila de Marga.
- [x] Gerar e integrar trilha própria para Bosque dos Ossos.
- [x] Gerar e integrar trilha própria para Cripta das Marés.
- [x] Gerar e integrar trilha própria para Jardim de Espinhos.
- [x] Gerar e integrar trilha própria para Observatório do Eclipse.
- [x] Gerar e integrar trilha própria para Pântano da Febre.
- [x] Gerar e integrar trilha própria para Cidadela Partida.
- [x] Gerar e integrar trilha própria para Vale dos Sussurros.
- [x] Gerar e integrar trilha própria para Ruínas de Veyra.
- [x] Gerar e integrar trilha própria para Catedral do Sal.
- [x] Validar a troca regional, loops, mistura com ambientes e o mixer persistente.

## Compêndio escrito do Necromancer Realms

- [x] Consolidar sistemas, regiões, progressão, necromancia, combate, conteúdo, interface e áudio já implementados.
- [x] Redigir o documento estruturado em português com funcionalidades, estado atual e pontos de expansão.
- [x] Revisar e entregar o compêndio ao jogador.

## Exploração ramificada e escolhas de rota

- [x] Auditar viagem regional, encontros, eventos, marcas de atlas e formato do save.
- [x] Definir rotas segura, amaldiçoada e desconhecida para as 11 regiões, com identidade, custo e recompensa próprios.
- [x] Criar interface de bifurcação antes da viagem, com leitura clara de risco, espólio e consequência possível.
- [x] Implementar a rota segura com menor perigo, menor recompensa e progresso consistente.
- [x] Implementar a estrada amaldiçoada com inimigos fortalecidos, desgaste possível da legião e recompensas superiores.
- [x] Implementar o caminho desconhecido com evento raro, chefe opcional e relíquia única quando disponível.
- [x] Persistir escolhas, usar o caminho escolhido para encontros e registrar ramificações no atlas.
- [x] Conectar rotas a XP, Bestiário, Diário, equipamentos, Fragmentos de Alma e eventos já existentes.
- [x] Validar equilíbrio, save/load, ausência de duplicação, desktop, mobile, TypeScript e build.
- [ ] Salvar checkpoint e entregar a exploração ramificada.
