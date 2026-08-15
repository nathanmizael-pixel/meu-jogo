# Necromancer Realms — Direção de design

## Abordagens consideradas

### Abordagem 1 — Gótico de Pergaminho Vivo
Uma interface de grimório de campo: preto-obsidiana, marfim de osso e violeta espectral, com mapas anotados, molduras talhadas e uma composição assimétrica de expedição. A experiência deve parecer um artefato jogável encontrado em um arquivo de guerra necromântica.

**Probability:** 0.07

### Abordagem 2 — Taverna Editorial
Um RPG de leitura confortável, com papel envelhecido, vermelho ferrugem, verde musgo e uma hierarquia de revista ilustrada. O foco seria o diário de viagem, os retratos de NPC e a narrativa por painéis.

**Probability:** 0.03

### Abordagem 3 — Catedral Astral
Uma fantasia contemplativa com azul noturno, vitrais e constelações, apresentando regiões como salas de uma catedral cósmica. A interface seria mais ritualística e serena, com destaque para o som e a contemplação.

**Probability:** 0.09

## Direção escolhida: Gótico de Pergaminho Vivo

### Design Movement
Dark fantasy editorial com linguagem de **field journal**, misturando cartografia de campanha, placas de metal oxidado e ornamentação de códice. A estética é assimétrica: o mundo ocupa o foco, enquanto as interfaces parecem instrumentos de navegação sobre ele.

### Core Principles
1. **O mundo primeiro:** cada painel deve parecer parte de uma expedição, nunca um dashboard genérico.
2. **Contraste de matéria:** obsidiana fosca, papel cinza-acinzentado, osso e uma chama violeta usada apenas para ações mágicas.
3. **Leitura tática:** estados de combate, XP, mana, ameaça e desbloqueios devem ser percebidos em um olhar.
4. **Ritual com resposta:** toda ação importante deixa um rastro visual breve — carimbo, pulso, fumaça, cinza ou mudança de clima.

### Color Philosophy
O fundo quase preto cria o silêncio de uma cripta e dá espaço para a informação. O marfim serve como tinta de mapa, não como branco puro; o teal oxidado identifica exploração e segurança; o âmbar marca recompensa e progressão; o violeta espectral aparece somente onde a necromancia está agindo. O **violeta cinza-espectral `#9d78ff`** é a assinatura da marca sem cair em neon.

### Layout Paradigm
Composição de expedição em três tensões: trilho lateral de navegação, palco central de região e coluna direita de estado. O jogo alterna foco entre o mapa ilustrado e a arena de combate, com cartões que se sobrepõem como placas de um atlas.

### Signature Elements
Linhas de contorno cartográficas atravessam o fundo; selos circulares marcam estados importantes; respiradouros de cinza/partículas aparecem nos momentos de necromancia. A iconografia mistura símbolos de osso, mapas e runas em silhuetas legíveis.

### Interaction Philosophy
Ataques e feitiços são imediatos, com feedback textual na área de atividade. Ações irreversíveis pedem confirmação. O cursor e os estados de hover devem parecer uma ferramenta de explorador: escaneiam, marcam e revelam.

### Animation
Usar pulsos curtos de opacity/transform para feedback de combate, entradas em cascata de 40–70ms nos cartões e pulso de 1.8s no sigilo ativo. Não animar layout nem usar zoom vindo de escala zero. Reduzir efeitos não essenciais sob `prefers-reduced-motion`.

### Typography System
**Cinzel** para títulos, regiões, chefes e números de nível; **Source Sans 3** para interface, objetivos, tooltips e registro de eventos. H1 usa tracking amplo; labels usam 0.18em; texto corrido fica entre 14–16px.

### Brand Essence
Um RPG isométrico de dark fantasy para quem quer construir um exército morto-vivo com escolhas táticas, exploração regional e progressão ritualística — diferente por tratar necromancia como uma disciplina de comando, não apenas como um feitiço.

**Personalidade:** ritualístico, tático, assombrado.

### Brand Voice
Headlines são curtas e evocativas. CTAs usam verbos de intenção (“marcar rota”, “erguer cadáver”, “abrir o grimório”), e o microcopy confirma estados sem dramatização vazia.

> “Toda sepultura é uma fronteira. Toda fronteira pode ser atravessada.”

> “O corpo caiu. A ordem permanece.”

### Wordmark & Logo
O símbolo é uma coroa de osso fundida a uma chama-sigilo crescente, com três lascas rúnicas em órbita. O wordmark respira como um nome de grimório: serifado, estreito e espaçado, nunca um texto padrão sem intervenção.

### Signature Brand Color
**Violeta cinza-espectral `#9d78ff`**, usado para energia, seleção ativa e efeitos de retorno dos mortos.

## Style Decisions

Após a primeira revisão visual, toda superfície importante deve ler como uma camada de artefato — placa de atlas, pedaço de pergaminho, etiqueta de metal ou nota de campo — e não como um cartão escuro genérico. O sigilo de coroa de osso e chama é o carimbo recorrente da marca: aparece no wordmark, nos estados ativos, nos marcadores do mapa e nas ações necromânticas. O violeta `#9d78ff` permanece reservado para necromancia, seleção e ritual primário; teal, âmbar, osso e obsidiana mantêm significados táticos distintos.

Na expansão do atlas, as placas de encontro devem funcionar como documentos manuseados: cada uma recebe carimbo, regra de risco e recompensa em uma hierarquia própria. A semântica cromática foi mantida deliberada: teal indica rota e exploração, âmbar indica recompensa ou progressão, osso indica informação cartográfica e violeta sinaliza necromancia, seleção ou revelação mágica. As anotações “FOLHA DE CAMPO”, “NOTA DE MARGEM” e “CARIMBO // ROTA” tornam o campo de batalha parte do mesmo arquivo ritualístico do mapa.

Após a revisão das recompensas regionais, banners e painéis de relíquia assumem papéis materiais explícitos: selo de prêmio, placa de inventário e folha de registro. Cada estado de recompensa deve ser legível por cor e texto — âmbar para conquista, teal para registro persistente, violeta para poder ritual — mantendo a comunicação tática antes do ornamento.

Para o drop de relíquias, a revisão reforça uma regra adicional: o momento de conquista é uma folha ritual sobreposta ao atlas, com o sigilo como carimbo, âmbar como prêmio, violetas como energia e teal como permanência. Status, navegação e encontros devem carregar instrumentos, bordas e anotações de expedição, preservando a clareza sob movimento e sob `prefers-reduced-motion`.

## Style Decisions

O rebalanceamento de combate tornou a leitura tática uma camada visual do diário: ameaças recebem selos de registro, o alvo ativo recebe o sigilo recorrente e o cabeçalho do campo funciona como placa de frente de batalha. A dificuldade deve ser comunicada por risco, guarda absorvida e estado de formação, usando verbos de comando ritualístico em vez de microcopy genérica.

Após a revisão do bestiário e dos rituais animados, status, encontros e comandos de chefes passam a ser tratados como instrumentos manuseados de expedição: placas de atlas, registros selados, etiquetas metálicas e dossiês de risco. O sigilo deve ocupar escala legível no wordmark e retornar como carimbo de navegação, alvo e necromancia. O mapa regional continua a massa visual prioritária; dados de combate devem parecer anotações e provas presas a ele, não faixas neutras de um dashboard.

Após a revisão da Estação de Combate, o alvo automático é uma **frente de batalha**: recebe retrato, carimbo de dossiê, contornos cartográficos, selo de coroa de osso e uma ação física em âmbar claramente dominante. O violeta continua a indicar necromancia e seleção, o teal comunica telegráficos e segurança tática, e informações secundárias permanecem como anotações do documento de campo.

Na consolidação do arquivo bélico, os recursos, comandos e dossiês da Estação de Combate devem parecer placas de atlas e etiquetas de metal oxidado, não cartões de HUD. O alvo é sempre apresentado como uma ameaça sentenciada — retrato carimbado, traço cartográfico, evidências de afinidade e postura, além de uma ordem física âmbar dominante. O sigilo de coroa de osso e chama se repete na navegação ativa, no dossiê do alvo e nas ações de necromancia para fixar a autoria visual de Necromancer Realms.

Após a revisão do Diário de Campo, a frente central deve conter sempre uma prova material do mundo — fragmento de atlas, carimbo de sentença, contorno de mapa ou dossiê de ameaça — para que recursos e medidores pareçam anotados sobre a expedição, não o seu substituto. O sigilo de coroa de osso e chama passa a selar a navegação ativa, a ameaça sentenciada e a ordem física dominante. O violeta permanece estritamente ligado a mana, seleção e retorno necromântico; exploração e recompensas preservam o teal e o âmbar como semânticas principais.

Na revisão do Bestiário tático, o campo de batalha consolida-se como uma carta topográfica selada: suas superfícies declaram matéria por etiquetas, relevo, traços de atlas e carimbos, jamais como cartões escuros sem identidade. O sigilo cresce no wordmark e ativa a navegação, a sentença do alvo e os ritos de necromancia. A leitura ritual prioriza região, ameaça e ordem física em âmbar; mana, seleção e retorno permanecem violeta; rotas e segurança conservam o teal; informações cartográficas ficam em osso.

Na revisão de manuscrito proibido, a interface passa a declarar o avanço territorial como uma leitura de página: **Região desconhecida**, **A região foi mapeada** e **Conhecimento absoluto adquirido**. Cada estágio muda selo, borda, tinta, nota de margem e registro do Atlas. As transições de página e escrita entram apenas como resposta curta e são desativadas com `prefers-reduced-motion`; papel, manchas rituais, anotações e selos aprofundam a materialidade sem disputar a prioridade da ameaça, da rota e da decisão tática.

Após a revisão do manuscrito, toda Estação de Combate passa a abrir com uma **prova de mundo**: um fragmento de atlas com arte da ameaça, coordenada de campo, selo e frente sentenciada. Recursos e comandos recebem nomes materiais — placa oxidada, folha ritual e dossiê selado — em vez de surgirem como retângulos neutros. A coroa de osso e chama cresce no wordmark, permanece no item ativo da navegação e retorna sobre a ameaça marcada; violeta continua exclusivo de selo, mana, seleção e rito.

Na revisão de vereditos táticos, a carta da ameaça passa a dominar a ordem de leitura: primeiro região e prova de campo, depois a ameaça sentenciada e, por fim, instrumentos e medidores tratados como anotações de apoio. A prova de mundo usa mapa rasgado, relevo cartográfico, arte de ameaça e selo ampliado. Trilho de navegação, alvo ativo e momentos necromânticos repetem a coroa de osso e chama como marca de autoria; painéis secundários assumem funções materiais distintas para reduzir a aparência de HUD homogêneo.

Na revisão da progressão adaptativa, a prova de mundo continua soberana: a ameaça, o fragmento cartográfico, a coordenada e o selo de sentença leem antes das barras e instrumentos. A Estação de Combate distingue explicitamente o **atlas rasgado**, a **placa de metal oxidado**, o **dossiê selado** e a **nota de campo** por matéria, textura e borda. A coroa de osso e chama ganha escala de autoria no wordmark, no item ativo do trilho, na ameaça marcada e em ritos necromânticos; violeta continua reservado à energia, seleção e retorno, enquanto âmbar, teal e osso mantêm papéis de ação, rota e informação.

Na revisão da direção sonora, a leitura global de combate foi consolidada como **mundo → ameaça sentenciada → ordem tática → registros**. Atlas e terreno usam pergaminho/relevo, ameaças usam dossiê carimbado, recursos são etiquetas de ledger e comandos são placas oxidadas. A coroa de osso e chama é o único carimbo de autoria recorrente e o violeta permanece exclusivo para seleção, mana e necromancia, evitando que se torne decoração genérica.

Na revisão das sinergias de build, o Grimório recebe um novo documento material: o **pacto de convergência**. Suas receitas apresentam juramento, artefatos e papéis de legião como condições de um selo, nunca como uma lista neutra de atributos. Cada receita selada fica em osso, âmbar oxidado e tinta de campo; o violeta cinza-espectral só desperta em pactos ativos, custos de mana, corrupção e retorno necromântico. A ameaça e o atlas continuam soberanos na Expedição; o painel de build funciona como uma folha de instruções para a próxima formação, não como HUD concorrente.

Na Cidadela, cada interior deve provar materialmente que é um lugar distinto: arte específica, coordenada de câmara, selo local e evidência de uso substituem a leitura por cabeçalho genérico. O pátio e as melhorias passam a ser registros de expedição manipulados — com identidades, custos e consequências legíveis — em vez de cartões escuros equivalentes. O sigilo de coroa de osso e chama atua como carimbo de comando nos estados ativos; violeta continua exclusivo de mana, seleção, necromancia e retorno ritual, enquanto entradas e obras físicas utilizam âmbar e osso.

Na crônica dos cinco atos, a campanha abre como um dossiê recuperado: coordenada, sentença e coroa aparecem antes do progresso. O Diário é uma folha de campo com selo e contorno cartográfico; o Novo Ciclo é um decreto oxidado. O sigilo ganha presença cerimonial nos atos ativos e na escolha de desfecho, enquanto o violeta fica limitado a revelações inscritas, magia e sentença final.

Na revisão das doutrinas de reino, cada rota deve declarar uma prova física de seu lugar antes de mostrar métricas: Expedição é um atlas e uma ameaça; Cidadela é uma câmara, selo local e evidência ritual; Grimório é um pacto; Diário é uma página recuperada. O selo de coroa de osso e chama é reservado aos pontos de autoridade — wordmark, navegação ativa, ameaça sentenciada e altares/ritos — e a paleta mantém disciplina: violeta para mana, seleção e necromancia; teal para rota e segurança; âmbar para ação e recompensa; osso para a informação cartográfica.
