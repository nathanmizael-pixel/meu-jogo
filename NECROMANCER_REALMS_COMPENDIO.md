# Necromancer Realms — Compêndio do Jogo

**Versão de referência:** `c7479c22`  
**Idioma do jogo:** Português do Brasil  
**Plataforma:** RPG dark-fantasy de navegador, construído em React, TypeScript e Vite.

> **Necromancer Realms** é um RPG de exploração tática em que o jogador assume Veyra, uma necromante errante. A proposta não é apenas derrotar monstros: o jogador mapeia territórios, entende inimigos, faz escolhas de estrada, constrói uma Cidadela, forma uma legião de mortos-vivos e decide que tipo de reino pretende erguer a partir dos mortos.

## 1. Visão geral do que está pronto

O jogo já possui um ciclo completo de **exploração regional, encontro, combate, recompensa, progressão e persistência**. A necromancia é o centro da experiência: chefes derrotados podem se tornar servos, a legião altera o combate, servos podem evoluir e uma morte permanente tem consequências reais.

| Área | Estado atual | Entrega principal |
|---|---|---|
| Campanha e exploração | Implementada | 11 regiões exploráveis, encontros, ciclos regionais, eventos e marcações de atlas |
| Combate | Implementado | Estação de Combate única, dano tático, postura, telegráficos e contrajogo |
| Necromancia | Implementada | Legião, servos evolutivos, morte permanente e ressurreição de chefes |
| Progressão | Implementada | Atributos, juramentos, XP adaptativo e evolução até o nível 70 |
| Conteúdo secundário | Implementado | Diário de Campo, Bestiário tático, equipamentos e Cidadela |
| Pós-campanha | Implementado | Novo Ciclo com modos de desafio e recompensas exclusivas |
| Apresentação | Implementada | Interface de manuscrito proibido, artes de chefes, ritos cinematográficos e áudio dinâmico |
| Persistência | Implementada | Save local, migração de estados antigos, rastreio de descobertas e preferências |

## 2. Estrutura narrativa e fantasia central

O jogador controla **Veyra, a Insepulta**, uma necromante que atravessa um continente ferido por cultos, túmulos, fortalezas quebradas e regiões onde a morte ainda exerce vontade própria. A identidade visual e narrativa é a de um **manuscrito necromântico de campo**: o mundo é apresentado como um atlas marcado, um dossiê de ameaças e uma coleção de registros que se tornam mais completos à medida que o jogador explora.

A necromancia não é apenas uma habilidade de dano. Ela é a regra que conecta combate, coleção, risco, progressão e mundo. Cada morto tem origem, afinidade, memória e utilidade tática. O jogador pode transformar derrotas em recursos, mas isso não elimina as consequências: servos também podem cair permanentemente, retornando ao Ossuário Caído e exigindo Fragmentos de Alma para uma ressurreição degradada.

## 3. Exploração, regiões e mapa

O jogo possui **onze regiões exploráveis**, cada uma com faixa de nível, arte cartográfica, identidade de clima, encontros próprios e regras ambientais. O atlas registra passagem, região atual e estágio de conhecimento; o jogador deixa de ver apenas um menu de mapas e passa a ler a campanha como uma expedição progressiva.

| Região | Identidade | Exemplos de impacto tático |
|---|---|---|
| Verge de Cinza | Limiar de vilas queimadas e sepulturas recentes | Porta de entrada da expedição e primeiros sinais de ameaça |
| Bosque Velado | Floresta fechada e névoa verde | Pressão de emboscada e ameaças ocultas |
| Terras Mortas | Ossuários, pedra cinzenta e rituais | Confrontos ligados a restos, túmulos e ruínas persistentes |
| Pântano de Vey | Lama, água escura e chuva venenosa | Condições tóxicas e inimigos de sustentação |
| Dorsal de Sal | Altas montanhas e vento de neve | Travessias severas e pressão de resistência |
| Território Dracônico | Caldeiras, ruínas massivas e lava | Ameaças de fogo, escala maior e risco elevado |
| Trono dos Titãs | Colossos e silêncio mineral | Confrontos de grande porte e progressão avançada |
| Cripta das Marés | Catacumbas submersas e sinos afogados | Ciclo de maré, inimigos aquáticos e retorno dos mortos |
| Jardim de Espinhos | Raízes, vidros partidos e rosas funerárias | Crescimento de espinhos e domínio gradual da arena |
| Observatório do Eclipse | Torre astral e constelações quebradas | Ciclo lunar, eclipse e regras mágicas alteradas |
| Cidadela do Sal Negro | Fortaleza mineral de uma ordem necromântica | Cristais, selos e desafios de chefe avançados |

### 3.1. Ciclos regionais

As regiões não são apenas cenários diferentes. Cada uma possui um **ciclo ambiental persistente** que muda como o jogador planeja as ações. Na Cripta das Marés, a maré baixa pode revelar oportunidades, a maré alta fortalece ameaças aquáticas e a maré negra traz mortos de volta. No Jardim de Espinhos, as raízes crescem e transformam a arena em uma ameaça. No Observatório do Eclipse, o eclipse aumenta o poder sombrio, reduz a cura e altera o comportamento de inimigos.

O estado de cada ciclo é exibido como previsão e contrajogo. Assim, o jogador recebe informação suficiente para tomar uma decisão tática, mas não perde a sensação de risco.

### 3.2. Atlas e conhecimento territorial

O atlas grava regiões visitadas no save local. Cada território pode ser apresentado em três estágios:

| Estágio | Significado |
|---|---|
| **Região Velada** | O território ainda não foi explorado e oferece apenas informação limitada |
| **Região Mapeada** | A expedição já deixou marcas e o jogador vê referências mais claras |
| **Conhecimento Absoluto** | O território recebeu a leitura máxima do manuscrito e de seus registros |

O mapa também marca a rota atual com selo próprio e preserva a história de passagem da expedição.

## 4. Encontros, eventos de estrada e decisões

Os encontros são selecionados automaticamente dentro da progressão regional, evitando a necessidade de escolher manualmente um inimigo antes de cada batalha. A ameaça atual aparece acima das habilidades na Estação de Combate, mantendo o alvo e a decisão tática no mesmo lugar da interface.

Além de combates, o mundo possui **eventos de estrada persistentes**. Entre eles estão o cadáver que ainda respira, o sobrevivente salvo, o mercador de cinzas, o cartógrafo sob a chuva e o selo despedaçado. Cada decisão pode oferecer servo, ouro, equipamento, informação, missão, acesso futuro a loja ou risco narrativo. As escolhas ficam registradas e podem produzir consequência posterior.

## 5. Sistema de combate tático

O combate foi transformado de um modelo de “atacar até ganhar” para uma estação tática com decisões de recurso, postura, risco e resposta. A interface foi centralizada para que vida do inimigo, vida do jogador, mana, ameaça telegráfica e golpes fiquem visíveis sem que o jogador precise descer a página.

### 5.1. Tipos de dano e leitura do inimigo

O jogo trabalha com seis afinidades de dano: **físico, sombrio, fogo, gelo, veneno e sagrado**. Inimigos possuem fraquezas e resistências explícitas. O Bestiário complementa essa leitura ao revelar comportamento, espólios, postura e estratégia recomendada conforme a pesquisa avança.

### 5.2. Status, combos e postura

O sistema inclui efeitos como sangramento, queimadura, congelamento, corrupção, medo, atordoamento e maldição. Ataques e ritos podem criar combinações, por exemplo preparando uma condição com magia e explorando-a com um golpe ou servo.

Inimigos também utilizam **posturas** como vulnerável, protegida e enfurecida. A postura torna o combate legível: não basta maximizar dano; é preciso decidir quando interromper, quando gastar mana e quando abrir espaço para a legião.

### 5.3. Defesa, interrupção e telegráficos

O jogador possui bloqueio, esquiva e contra-ataque. Chefes anunciam golpes perigosos com telegráficos e, em vários casos, há uma janela para quebrar postura, usar uma ação de arena ou interromper a preparação inimiga.

O exemplo central é o Arauto da Maré preparando um dilúvio. Caso o jogador não responda ao telegráfico, a arena se torna mais hostil e a legião sofre dano. O sistema faz com que recursos e tempo sejam tão importantes quanto o dano bruto.

### 5.4. Dificuldade e utilidade dos servos

Os inimigos foram ajustados para representar ameaça real. A legião não é apenas decorativa: servos participam do dano, sustentação, controle, afinidade, execução e leitura da arena. Isso torna a composição da legião uma decisão estratégica, especialmente em dificuldades elevadas e no Novo Ciclo.

## 6. Chefes e arenas especiais

Cinco chefes possuem arenas e identidades próprias. Cada um é tratado como um pequeno espetáculo tático, com mecânicas, assinatura visual e ressurreição dedicada.

| Chefe | Arena e contrajogo | Ressurreição |
|---|---|---|
| Guardião do Ossuário | Cadáveres-escudo, formação de mortos e ruptura do terreno | Vídeo ritual próprio integrado |
| Arauto da Maré | Água sobe e reduz o espaço da arena | Arte estática cinematográfica própria |
| Matriarca da Rosa Negra | Raízes se espalham e podem dominar o campo | Arte estática cinematográfica própria |
| Astrônomo Faminto | Constelações definem ataques e alteram o céu | Arte estática cinematográfica própria |
| Hierofante do Sal Negro | Cristais de sal podem ser destruídos ou explorados | Arte estática cinematográfica própria |

Somente chefes realmente derrotados ficam disponíveis para ressurreição. O rito bloqueia a HUD, atenua a ambiência, permite pular por botão ou tecla Escape e finaliza a criação do servo apenas quando termina ou é pulado. Há um bloqueio de conclusão única para impedir duplicação de servos. Cenas vistas são persistidas para que ressurreições posteriores não repitam a cena automaticamente.

## 7. Legião Necromântica e servos

Cada servo possui **classe, nível, raridade, afinidade, atributos, origem, aparência, passiva, habilidade ativa e caminho de evolução**. Essa estrutura transforma a legião em uma camada de coleção e buildcraft, e não apenas em uma lista de aliados.

Exemplos de decisões disponíveis incluem escolher servos de guarda para reduzir dano, usar entidades de afinidade correta contra uma fraqueza regional, preparar condições para combos ou sacrificar recursos por sobrevivência do grupo.

### 7.1. Evolução e morte permanente

Os mortos podem evoluir em árvores temáticas. Ao mesmo tempo, a morte de um servo é permanente por padrão: ele passa para o **Ossuário Caído**. É possível recuperar uma entidade importante por Fragmentos de Alma, mas o retorno é degradado. Isso faz com que manter um servo vivo seja um objetivo estratégico real.

## 8. Progressão do necromante e juramentos

Veyra progride por níveis, mana, vitalidade, atributos e juramentos. Os atributos centrais são **Poder, Vitalidade, Intelecto, Domínio e Corrupção**. O jogador escolhe um dos quatro caminhos de especialização:

| Juramento | Especialidade |
|---|---|
| Senhor dos Ossos | Quantidade, comando e eficiência da legião |
| Ceifador | Dano, execução e pressão ofensiva |
| Lich | Magia, maldições e economia de mana |
| Mestre das Almas | Sacrifício, fortalecimento e manipulação de servos |

Depois da escolha, os outros três juramentos deixam de ser exibidos e o caminho escolhido se torna a progressão principal. Esse juramento possui níveis contínuos até o **nível 70**, preservando especialização em vez de uma árvore genérica com escolhas dispersas.

### 8.1. XP adaptativo sem grind obrigatório

A progressão foi ajustada para valorizar a campanha e evitar repetição compulsória. XP agora considera diferença de nível, primeira vitória, descoberta, evento, Bestiário, relíquia, objetivo secundário, fraqueza explorada, risco enfrentado e preservação da legião.

| Regra | Efeito |
|---|---|
| Primeira vitória | Recompensa mais significativa para avanço natural |
| Diferença de nível | O risco apropriado recebe melhor retorno |
| Descoberta e evento | Explorar rende progresso real sem combate repetitivo |
| Repetição | Retorno diminui gradualmente em vez de virar fonte infinita de XP |
| Livro de Recompensas | O Grimório mostra a origem dos ganhos recentes |

A simulação da campanha principal das onze regiões encerra no nível 14 sem exigir repetição obrigatória. A quinta repetição equivalente rende aproximadamente 11% do valor da primeira, protegendo o ritmo da progressão.

## 9. Equipamentos, relíquias e buildcraft

O loadout possui seis espaços: **arma, armadura, relíquia, amuleto, grimório e artefato necromântico**. Há um catálogo inicial de itens, raridades, drops de chefe e interface de equipar e desequipar persistente.

Os equipamentos não funcionam apenas como números maiores. Eles alteram estilos de jogo: podem favorecer dano físico, rituais, legião, execução, postura, cura, mana ou Fragmentos de Alma. Exemplos incluem a Coroa do Rei Morto, que fortalece servos, o Grimório da Última Alma, que devolve mana diante de perdas, e a Foice do Carrasco, ligada a execução de inimigos debilitados.

## 10. Cidadela Necromântica

A Cidadela é o hub do necromante e começa como ruína, evoluindo visualmente para um reino funcional. Ela possui seis edifícios, cada um com cinco níveis e custos persistentes.

| Construção | Benefício principal |
|---|---|
| Torre Arcana | Amplia dano ritual e mana máxima |
| Cripta da Legião | Aumenta a capacidade de servos |
| Forja Mortuária | Fortalece dano físico, ritual e de servos |
| Altar das Almas | Reduz custo e melhora ressurreições |
| Biblioteca dos Mortos | Aumenta o ganho de XP por inimigo derrotado |
| Jardim Profano | Produz e amplia ganhos de ouro |

A Cidadela cria a sensação de território próprio: o personagem não apenas visita regiões, mas constrói uma base capaz de sustentar o Novo Ciclo.

## 11. Diário de Campo e missões secundárias

O **Diário de Campo** contém quinze missões secundárias distribuídas em cinco categorias: contratos, caçadas, relíquias perdidas, histórias de personagens e memórias de servos. O progresso é persistente e acompanha mortes, chefes, relíquias, eventos e recrutamentos.

As recompensas automáticas incluem XP, ouro, Fragmentos de Alma e equipamentos. A conclusão foi protegida contra cliques repetidos; cada missão entrega sua recompensa uma vez e utiliza valores equilibrados para não quebrar a progressão.

## 12. Bestiário tático

O Bestiário cobre quatorze ameaças e não é apenas um álbum visual. O conhecimento avança de **Avistado** para **Estudado** e, finalmente, **Completo**. Cada estágio revela mais informação, com recompensas pela pesquisa concluída.

| Estágio | Conteúdo revelado |
|---|---|
| Avistado | Registro inicial e identificação da ameaça |
| Estudado | Afinidades, comportamento, postura e espólios |
| Completo | Lore, animação, estratégia recomendada e recompensa de conclusão |

Essa camada recompensa exploração, observação e repetição moderada de maneira controlada, conectando o combate ao mundo.

## 13. Vereditos de vitória

O desfecho de combate pode conceder um veredito tático. O jogo registra participação da legião, ataques diretos, ritos, execuções e mortes de servos para reconhecer estilos diferentes de vitória.

| Veredito | Condição de destaque | Tipo de recompensa |
|---|---|---|
| Vitória Perfeita | Legião preservada | Recompensa adicional de precisão e sobrevivência |
| Vitória Brutal | Ênfase em execuções | Fragmentos de Alma e pressão ofensiva |
| Vitória Arcana | Uso focado em magia | Conhecimento e progresso místico |
| Vitória Necromântica | Legião e ritos no centro da estratégia | Recompensa especial de identidade necromântica |

## 14. Novo Ciclo e modos de desafio

Após a conclusão da campanha, o jogador pode iniciar um **Novo Ciclo**. O personagem, a legião, a Cidadela e o equipamento são preservados, enquanto encontros se tornam mais perigosos e novas recompensas surgem.

| Modo | Regra principal |
|---|---|
| Padrão | Reinício pós-campanha com escalonamento natural |
| Pesadelo | Chefes recebem fases e pressão adicional |
| Lich | Recursos são mais limitados |
| Iron Soul | Servos mortos não podem ser recuperados |

O Novo Ciclo inclui relíquias de eco, eventos adicionais e drops exclusivos de chefe. Não é apenas uma repetição numérica: ele apresenta uma nova camada de risco e preparação.

## 15. Interface, artes e identidade visual

A interface foi desenvolvida como um **manuscrito proibido**. Em vez de cartões genéricos, o jogo usa pergaminho, tinta, selos, mapas desenhados, placas de metal oxidado, dossiês lacrados e anotações de campo.

O estilo adotado é o **Gótico de Pergaminho Vivo**. A hierarquia atual privilegia a leitura “mundo → ameaça sentenciada → ordem tática”: primeiro o atlas e a prova de território, depois o inimigo, por fim os instrumentos de decisão. A Estação de Combate possui materiais diferentes para atlas, dossiê, recursos e regras de rota, evitando que tudo pareça o mesmo painel escuro.

O sigilo de coroa/chama funciona como marca recorrente em navegação, alvos, ritos e momentos de ação. Transições de página, escrita progressiva e respeito a `prefers-reduced-motion` completam a apresentação.

## 16. Cinemáticas de ressurreição

As ressurreições dos cinco chefes receberam infraestrutura cinematográfica modular. O Guardião do Ossuário possui um vídeo MP4 real com áudio. Arauto da Maré, Matriarca da Rosa Negra, Astrônomo Faminto e Hierofante do Sal Negro possuem artes estáticas 16:9 específicas, acompanhadas por sigilo, partículas, texto ritual, aproximação visual e suporte a redução de movimento.

Se um vídeo não estiver disponível, o jogo utiliza uma animação de fallback de aproximadamente 4,2 segundos. A cena pode ser pulada; a criação do servo só é confirmada uma vez, depois da conclusão ritual. O estado de cenas vistas é salvo para impedir repetição não desejada.

## 17. Sistema de áudio e música

O jogo utiliza um diretor sonoro baseado em Web Audio, dividido em quatro buses: **música, ambiente, efeitos e interface**. O mixer permite controlar cada categoria de maneira persistente, além de silenciar o sistema por completo. O áudio é ativado por gesto explícito do usuário, respeitando as regras de navegadores modernos.

### 17.1. Biblioteca musical real

Foram geradas e integradas **vinte e uma faixas instrumentais originais**. Dez correspondem a cenas dinâmicas de exploração, tensão, combate comum, elite, chefe, fase final, eventos, ritos, vitória e derrota. As outras onze são trilhas regionais exclusivas, roteadas para os territórios exploráveis.

O diretor troca faixas com crossfade, utiliza loop nas cenas contínuas, aplica ducking durante ritos e preserva o sintetizador procedural como fallback se um arquivo externo falhar. Música regional é usada na exploração, enquanto música de cena assume prioridade em combate, eventos e ritos.

| Categoria | Funcionamento |
|---|---|
| Música | Trilhas instrumentais reais por região e estado de jogo |
| Ambiente | Perfis locais de água, vento, correntes, sussurros e materiais regionais |
| Efeitos | Golpes, magia, defesa, servo, crítico, morte, recompensa e interface |
| Interface | Retorno auditivo para comandos, navegação e ações de manuscrito |

O painel exibe o comando **“Toque para despertar o som”** quando o navegador ainda não liberou áudio. Após o primeiro gesto, a cena pendente é iniciada automaticamente.

## 18. Persistência, compatibilidade e qualidade

O estado principal é salvo em `localStorage`. São persistidos personagem, vida, mana, XP, legião, servos caídos, equipamentos, Cidadela, regiões visitadas, eventos, missões, Bestiário, juramento, modos de Novo Ciclo, cenas de ressurreição vistas, telemetria de XP e preferências de áudio.

Os sistemas novos foram integrados de forma compatível com saves existentes. Há proteção contra duplicação em recompensas, missões concluídas, conhecimento de Bestiário, ressurreições e criação de servos. O projeto foi validado com TypeScript e builds de produção após as entregas principais.

## 19. Arquitetura técnica resumida

| Camada | Responsabilidade |
|---|---|
| `Home.tsx` | Estado principal, fluxo de combate, navegação, save/load e integração dos sistemas |
| `gameData.ts` | Catálogo de regiões, inimigos, chefes, itens, servos, encontros e configurações narrativas |
| Componentes | Grimório, Bestiário, Diário, Novo Ciclo, ressurreições e painéis especializados |
| `useAdaptiveSoundscape.ts` | Diretor de áudio, buses, música real, ambiente, efeitos, mixer e fallback |
| CSS temático | Materiais de manuscrito, atlas, ritos, combate, áudio e responsividade |
| `xpProgression.ts` | Curva adaptativa, redução de repetição e telemetria de recompensas |

## 20. Estado atual e próximos caminhos

O Necromancer Realms já é uma experiência jogável de RPG tático dark-fantasy com campanha, pós-campanha, legião, combate de contrajogo, conteúdo secundário, audiovisual e save persistente. O foco das próximas iterações pode migrar de fundação de sistemas para densidade de conteúdo e acabamento.

| Próximo passo possível | Resultado esperado |
|---|---|
| Novos inimigos e encontros por região | Mais variedade entre as rotas e maior profundidade de Bestiário |
| Missões narrativas de servos | Dar voz e memória às unidades importantes da legião |
| Temas musicais longos adicionais | Ampliar a variação de exploração e de arenas especiais |
| Galeria de ritos no Bestiário | Permitir rever cinematográficas já desbloqueadas |
| Mais relíquias e builds | Aumentar a diversidade de estratégias no Novo Ciclo |

---

**Resumo final:** o projeto deixou de ser apenas um protótipo de combate e se tornou um RPG de navegador com identidade própria. O jogador explora um atlas vivo, enfrenta inimigos que exigem leitura tática, comanda mortos com consequências reais, constrói uma base, coleciona conhecimento e atravessa uma campanha com progressão, som e apresentação integrados.
