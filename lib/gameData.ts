/* Necromancer Realms — conteúdo do atlas. A estética de grimório cartográfico guia nomes, metadados e hierarquia visual. */
import type { LucideIcon } from "lucide-react";
import { Castle, Compass, Crown, Droplets, Flame, Flower2, Map, Moon, Mountain, Orbit, Skull, Waves, Wind } from "lucide-react";

// Estilo do arquivo: Gótico de Pergaminho Vivo — dados táticos curtos, rituais e úteis ao campo.
export type Tab = "expedition" | "map" | "bestiary" | "necromancy" | "grimoire" | "inventory" | "quests" | "citadel" | "cycle";
export type RegionId = "ashen" | "darkwood" | "deadlands" | "swamp" | "mountain" | "dragon" | "titan" | "tideCrypt" | "thornGarden" | "eclipse" | "blackSalt";
export type EncounterKind = "patrol" | "ambush" | "ritual" | "elite" | "siege" | "boss";
export type EncounterRule = "standard" | "tide" | "thorns" | "veil" | "siege";
export type DamageType = "physical" | "shadow" | "fire" | "ice" | "poison" | "holy";
export type StatusType = "bleed" | "burn" | "freeze" | "corruption" | "fear" | "stun" | "curse";
export type EnemyPosture = "neutral" | "guarded" | "vulnerable" | "enraged" | "channeling";

export type NecromancerAttribute = "power" | "vitality" | "intellect" | "dominion" | "corruption";
export type NecromancerAttributes = Record<NecromancerAttribute, number>;
export type SpecializationId = "bone-lord" | "reaper" | "lich" | "soul-master";

export type NecromancerTalent = {
  id: string; name: string; tier: number; requiredLevel: number; description: string; effect: string;
};

export type OathMilestone = {
  level: number; title: string; effect: string;
};

export type SpecializationTree = {
  id: SpecializationId; name: string; title: string; description: string; accent: DamageType; talents: NecromancerTalent[]; milestones: OathMilestone[];
};

export type CombatStatus = { type: StatusType; turns: number; stacks?: number };

export type EnemyIntent = {
  id: string; name: string; description: string; turnsLeft: number; postureToBreak: number;
  damage: number; servantDamage?: number; damageType: DamageType; applies?: StatusType;
};

export type PlayerState = {
  level: number; xp: number; xpToNext: number; hp: number; maxHp: number; mana: number; maxMana: number;
  power: number; spellSlots: number; gold: number; army: string[]; equipment: string[]; relics: string[];
  legion: Servant[]; soulFragments: number; fallenServants: FallenServant[];
  attributes: NecromancerAttributes; attributePoints: number; talentPoints: number; talents: string[]; specialization: SpecializationId | null;
  equipped: Partial<Record<EquipmentSlot, string>>;
};

export type EquipmentSlot = "weapon" | "armor" | "relic" | "amulet" | "grimoire" | "artifact";
export type CitadelBuildingId = "tower" | "crypt" | "forge" | "altar" | "library" | "garden";
export type CitadelState = { buildings: Record<CitadelBuildingId, number> };
export type CitadelBuilding = {
  id: CitadelBuildingId; name: string; title: string; description: string; benefit: string; art: string;
  baseGold: number; baseSouls?: number; maxLevel: number;
};
export type EquipmentEffect = {
  physicalDamagePct?: number; ritualDamagePct?: number; servantDamagePct?: number; servantGuard?: number;
  maxHp?: number; maxMana?: number; manaCostReduction?: number; manaOnServantFallPct?: number;
  executeThreshold?: number; healingPct?: number; postureDamage?: number; soulFragmentsOnBoss?: number;
};
export type EquipmentItem = {
  id: string; name: string; slot: EquipmentSlot; rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  source: string; description: string; effectText: string; effect: EquipmentEffect; art: string;
};

export type ChallengeModeId = "standard" | "nightmare" | "lich" | "iron-soul";
export type ChallengeMode = {
  id: ChallengeModeId; name: string; seal: string; description: string; risk: string; reward: string; icon: LucideIcon;
};
export type NewCycleState = {
  cycle: number; mode: ChallengeModeId; completedCycles: number; bossRelicsClaimed: string[];
};

export type ServantRole = "guard" | "assault" | "support" | "arcanist";
export type ServantRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ServantStats = { guard: number; damage: number; sustain: number; arcana: number };

export type ServantAbility = {
  id: string; name: string; description: string; kind: "assault" | "support" | "break" | "reveal";
  cost: number; damage?: number; heal?: number; damageType: DamageType; status?: StatusType; turns?: number;
};

export type ServantEvolution = { id: string; name: string; requiredLevel: number; fragmentCost: number; description: string; stats: ServantStats; passive: string; active: ServantAbility; art: string };

export type ServantTemplate = {
  id: string; name: string; role: ServantRole; rarity: ServantRarity; affinity: DamageType; origin: string; art: string;
  equipment: string; passive: string; stats: ServantStats; active: ServantAbility; evolutions: ServantEvolution[]; bossId?: string;
};

export type Servant = {
  uid: string; templateId: string; name: string; role: ServantRole; rarity: ServantRarity; affinity: DamageType; origin: string;
  level: number; xp: number; stars: number; stats: ServantStats; passive: string; active: ServantAbility; equipment: string; art: string;
  evolutionStage: number; maxHp: number; hp: number; revivalDebt: number; bossId?: string; cooldown?: number;
};

export type FallenServant = Servant & { fallenAt: string; cause: string };

export type BossAbility = {
  id: string; name: string; description: string; cost: number; damage: number; effect: string;
  heal?: number; kind: "assault" | "support" | "reveal" | "break"; damageType: DamageType;
  appliesStatus?: StatusType; statusTurns?: number;
};

export type Enemy = {
  id: string; name: string; kind: string; level: number; hp: number; maxHp: number; atk: number; xp: number;
  loot: string; variant: string; trait: string; art: string; elite?: boolean; boss?: boolean; ability?: BossAbility;
  damageType?: DamageType; weaknesses?: DamageType[]; resistances?: DamageType[]; statusOnHit?: StatusType;
  posture?: EnemyPosture; postureHp?: number; maxPosture?: number; postureTurns?: number; statuses?: CombatStatus[];
  intent?: EnemyIntent; telegraph?: EnemyIntent; telegraphUsed?: boolean;
};

export type BestiaryDossier = {
  lore: string;
  behavior: string;
  strategy: string;
  animation: string;
};

export type Region = {
  id: RegionId; name: string; kicker: string; description: string; level: string; tone: string; weather: string;
  unlockAt: number; landmark: string; coordinates: string; art: string; encounterIds: string[];
};

export type RegionPhase = {
  id: string; name: string; duration: number; detail: string; counterplay: string;
  damageType?: DamageType; damageMultiplier?: number; enemyDamageMultiplier?: number; healingMultiplier?: number;
  thornDamage?: number; raiseDead?: boolean; revealEnemies?: boolean; postureBonus?: number;
};

export type RegionCycle = {
  title: string; identity: string; preparation: string; exploration: string; phases: RegionPhase[];
};

export type RoadEventEffect = {
  gold?: number; xp?: number; hp?: number; mana?: number; soulFragments?: number;
  equipment?: string; servantTemplateId?: string; setFlag?: string;
  bondDeltas?: Record<string, Partial<Record<"loyalty" | "fear" | "rancor" | "devotion" | "corruption" | "trust", number>>>;
};

export type RoadEventChoice = {
  id: string; label: string; ritual: string; description: string; consequence: string; effect: RoadEventEffect;
};

export type RoadEvent = {
  id: string; regionIds: RegionId[] | "all"; title: string; subtitle: string; description: string;
  omen: string; art: string; requiresFlags?: string[]; excludeFlags?: string[]; requiresRaisedBossIds?: string[]; choices: RoadEventChoice[];
};

export type SecondaryQuestCategory = "contract" | "hunt" | "relic" | "story" | "servant_memory";
export type SecondaryQuestCondition =
  | { type: "kill"; enemyId: string; count: number }
  | { type: "boss_defeated"; bossId: string }
  | { type: "relic_owned"; relicId: string }
  | { type: "relics_owned"; count: number }
  | { type: "event_flag"; flag: string }
  | { type: "servant_recruited"; templateId: string }
  | { type: "servant_memory"; memoryId: string };
export type SecondaryQuestReward = { xp?: number; gold?: number; equipment?: string; soulFragments?: number };
export type SecondaryQuest = {
  id: string; category: SecondaryQuestCategory; seal: string; title: string; description: string; objective: string;
  condition: SecondaryQuestCondition; reward: SecondaryQuestReward; art: string;
};

export type BossArenaPhase = { name: string; detail: string; threat: string };
export type BossArena = {
  bossId: string; title: string; seal: string; terrain: string; objective: string; counterplay: string;
  maxProgress: number; cyclic?: boolean; phases: BossArenaPhase[];
  action: { label: string; ritual: string; cost: number; description: string };
};

export type Encounter = {
  id: string; regionId: RegionId; name: string; type: string; kind: EncounterKind; ruleKey: EncounterRule;
  description: string; rule: string; danger: string; reward: string; enemyIds: string[];
};

export type RegionalReward = {
  regionId: RegionId; itemId: string; name: string; category: string; description: string; effect: string;
  xpBonus: number; firstClearGold: number; tone: string; art: string;
};

export const assets = {
  hero: "/manus-storage/necromancer-realms-hero_7e5b7b59.png",
  region: "/manus-storage/necromancer-realms-region-v2_eba72c1f.png",
  boss: "/manus-storage/necromancer-realms-boss-v2_b0dd0542.png",
  tideCrypt: "/manus-storage/necromancer-realms-tide-crypt_407e516e.png",
  thornGarden: "/manus-storage/necromancer-realms-thorn-garden_15232b99.png",
  eclipse: "/manus-storage/necromancer-realms-eclipse-observatory_aab64ec6.png",
  blackSalt: "/manus-storage/necromancer-realms-black-salt-citadel_d1c3bb56.png",
  mapAshen: "/manus-storage/necromancer-realms-map-ashen_f82ebf19.png",
  mapDarkwood: "/manus-storage/necromancer-realms-map-darkwood_5c172452.png",
  mapDeadlands: "/manus-storage/necromancer-realms-map-deadlands_3797101e.png",
  mapSwamp: "/manus-storage/necromancer-realms-map-swamp_db8b8f71.png",
  mapMountain: "/manus-storage/necromancer-realms-map-mountain_df620a96.png",
  sigil: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='7' fill='%230b0d12'/%3E%3Ccircle cx='32' cy='32' r='25' fill='none' stroke='%23d8b66b' stroke-width='1.6'/%3E%3Cpath d='M16 39c6-1 9-7 10-15l6 7 6-7c1 8 4 14 10 15M20 25l5-9 7 8 7-8 5 9M24 42l8 8 8-8M32 24v23' fill='none' stroke='%23ead7a1' stroke-width='2.1' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M32 48c-5-7 0-13 0-18 5 5 5 11 0 18Z' fill='%239d78ff' stroke='%23d8b66b' stroke-width='1'/%3E%3Ccircle cx='32' cy='12' r='2' fill='%239d78ff'/%3E%3C/svg%3E",
};

export type ResurrectionCinematic = {
  bossId: string;
  title: string;
  announcement: string;
  seal: string;
  invocation: string;
  completion: string;
  fallbackDetail: string;
  accent: "bone" | "tide" | "thorn" | "eclipse" | "salt";
  poster: string;
  /** URL de MP4 real adicionada futuramente via armazenamento do projeto. Nunca presumir arquivo local. */
  videoSrc?: string;
};

/**
 * Pontos oficiais para as cinco cenas de chefe. Quando os MP4 finais existirem,
 * preencha apenas `videoSrc` com a URL de armazenamento correspondente.
 */
export const resurrectionCinematics: Record<string, ResurrectionCinematic> = {
  warden: {
    bossId: "warden", title: "Guardião do Ossuário", announcement: "RESSUSCITADO", seal: "OSSOS RECLAMADOS", accent: "bone", poster: assets.boss,
    invocation: "As mortalhas estremecem. O osso reconhece uma voz abaixo da terra.",
    completion: "O Guardião do Ossuário responde ao selo de Veyra.",
    fallbackDetail: "As paredes funerárias se abrem; uma coroa de fêmures se fecha sobre a nova forma.",
    videoSrc: "/manus-storage/resurrection-warden_133d1dea.mp4",
  },
  "tide-herald": {
    bossId: "tide-herald", title: "Arauto da Maré", announcement: "RESSUSCITADO", seal: "MARÉ INVERTIDA", accent: "tide", poster: "/manus-storage/resurrection-tide-herald_70e3a1ef.png",
    invocation: "A água negra sobe contra a gravidade. Correntes procuram um pulso impossível.",
    completion: "O Arauto da Maré retorna quando o abismo aceita o vínculo.",
    fallbackDetail: "Correntes encharcadas giram em silêncio até uma lâmina de maré quebrar a superfície.",
    // videoSrc: "<URL real do MP4 arauto-mare.mp4>",
  },
  "rose-matriarch": {
    bossId: "rose-matriarch", title: "Matriarca da Rosa Negra", announcement: "RESSUSCITADA", seal: "RAIZ COROADA", accent: "thorn", poster: "/manus-storage/resurrection-rose-matriarch_c99302b1.png",
    invocation: "Espinhos rasgam o pergaminho. A seiva escura grava um novo juramento.",
    completion: "A Matriarca da Rosa Negra floresce novamente sob comando.",
    fallbackDetail: "Raízes negras atravessam a sombra, trançando uma coroa viva ao redor da serva.",
    // videoSrc: "<URL real do MP4 matriarca-rosa-negra.mp4>",
  },
  "starved-astronomer": {
    bossId: "starved-astronomer", title: "Astrônomo Faminto", announcement: "RESSUSCITADO", seal: "CÉU DEVORADO", accent: "eclipse", poster: "/manus-storage/resurrection-starved-astronomer_3cb4f45b.png",
    invocation: "O relógio astronômico para. Uma constelação se dobra até caber dentro do selo.",
    completion: "O Astrônomo Faminto volta a calcular sob a lua morta.",
    fallbackDetail: "Pontos de luz são puxados para uma órbita impossível e revelam a nova silhueta do Astrônomo.",
    // videoSrc: "<URL real do MP4 astronomo-faminto.mp4>",
  },
  "black-salt-hierophant": {
    bossId: "black-salt-hierophant", title: "Hierofante do Sal Negro", announcement: "RESSUSCITADO", seal: "SAL ETERNO", accent: "salt", poster: "/manus-storage/resurrection-black-salt-hierophant_4b27bc0d.png",
    invocation: "Cristais de sal negro rangem. O juramento antigo volta a ter peso.",
    completion: "O Hierofante do Sal Negro ajoelha-se diante do selo ressurgido.",
    fallbackDetail: "Cristais flutuam, se quebram e reconstroem uma máscara coroada de sal escuro.",
    // videoSrc: "<URL real do MP4 hierofante-sal-negro.mp4>",
  },
};

export const initialNewCycleState: NewCycleState = { cycle: 0, mode: "standard", completedCycles: 0, bossRelicsClaimed: [] };

export const challengeModes: ChallengeMode[] = [
  { id: "standard", name: "Novo Ciclo", seal: "A COROA RETORNA", description: "A expedição recomeça em uma fronteira que recorda cada vitória. Ameaças escalam e eventos velados despertam.", risk: "+45% vitalidade inimiga · +25% dano inimigo", reward: "Relíquias de eco · eventos do ciclo · variantes coroadas", icon: Crown },
  { id: "nightmare", name: "Modo Pesadelo", seal: "TRÊS FASES SOB A LUA", description: "Chefes recebem duas fases de pressão além de seus ritos conhecidos. Cada arena prolonga sua sentença.", risk: "+70% vitalidade inimiga · chefes com 2 fases adicionais", reward: "+40% XP de ciclo · relíquias coroadas", icon: Moon },
  { id: "lich", name: "Modo Lich", seal: "A FOME DO FILACTÉRIO", description: "Mana, cura e fragmentos se tornam escassos. Vencer depende de uma leitura precisa de postura e ambiente.", risk: "Mana máxima reduzida · custos rituais elevados · cura limitada", reward: "+50% Fragmentos de Alma · foco arcano exclusivo", icon: Flame },
  { id: "iron-soul", name: "Modo Iron Soul", seal: "NENHUM NOME RETORNA", description: "A Cripta fecha suas portas: todo servo que cai permanece no Ossuário até o fim do ciclo.", risk: "Ressurreição de servos bloqueada · +55% dano inimigo", reward: "+60% ouro · selo de Ferro-Alma", icon: Skull },
];

export const newCycleRoadEvents: RoadEvent[] = [
  {
    id: "echo-cartographer", regionIds: "all", title: "O cartógrafo sem olhos", subtitle: "MARGENS QUE SE MOVEM", art: assets.mapDeadlands,
    description: "Uma figura encapuzada raspa do próprio rosto um mapa que mostra trilhas que não existiam no primeiro ciclo.", omen: "A tinta nova exige um preço, mas também revela um caminho que o reino tentou esconder.",
    choices: [
      { id: "read", label: "Ler as margens", ritual: "CARTA REESCRITA", description: "Aceite a rota que cresce sob seus dedos.", consequence: "+36 XP e +1 Fragmento de Alma; o atlas aprende uma cicatriz nova.", effect: { xp: 36, soulFragments: 1, setFlag: "cycle-cartographer-read" } },
      { id: "burn", label: "Queimar o mapa", ritual: "TINTA FUNERÁRIA", description: "Recuse a trilha e transforme o papel em foco ritual.", consequence: "+20 mana e uma proteção breve contra a névoa.", effect: { mana: 20, setFlag: "cycle-cartographer-burned" } },
    ],
  },
  {
    id: "crowned-echo", regionIds: ["deadlands", "eclipse", "blackSalt"], title: "Eco de uma coroa", subtitle: "UMA MORTE ANTERIOR", art: assets.blackSalt,
    description: "Uma sombra usa sua própria silhueta e oferece um juramento que só existe depois que o mundo já foi vencido uma vez.", omen: "O segundo reino não premia repetição: ele pede uma forma nova de sobreviver.",
    choices: [
      { id: "bind", label: "Vincular o eco", ritual: "COROA REPETIDA", description: "Prenda a memória derrotada à sua legião.", consequence: "+28 XP, +18 ouro e um selo de persistência.", effect: { xp: 28, gold: 18, setFlag: "cycle-echo-bound" } },
      { id: "dismiss", label: "Dissolver o eco", ritual: "NOME RASURADO", description: "Recuse o reflexo e conserve a própria vontade.", consequence: "+3 Fragmentos de Alma. A sombra não retorna.", effect: { soulFragments: 3, setFlag: "cycle-echo-dismissed" } },
    ],
  },
];

export const roadEvents: RoadEvent[] = [
  {
    id: "last-breath", regionIds: ["ashen", "deadlands"], title: "O cadáver ainda respira", subtitle: "UM PULSO SOB A CINZA", art: assets.mapAshen,
    description: "Entre carruagens queimadas, um jovem coberto de sal abre os olhos. Há um selo de viagem no pescoço e uma súplica que ainda não escolheu um destino.",
    omen: "O gesto deixará uma marca. A estrada lembra quem foi poupado e quem foi saqueado.",
    choices: [
      { id: "raise", label: "Ressuscitá-lo", ritual: "VÍNCULO INCERTO", description: "Prenda o último alento a um osso obediente.", consequence: "Um servo desconhecido entra na legião e poderá cobrar sua história depois.", effect: { servantTemplateId: "marga-respirant", setFlag: "pilgrim-saved" } },
      { id: "loot", label: "Saquear o corpo", ritual: "MÃO VAZIA", description: "Leve o ouro e o anel antes que o pulso desapareça.", consequence: "+35 ouro e um anel; alguém pode descobrir o que foi feito aqui.", effect: { gold: 35, equipment: "Anel do Peregrino", setFlag: "pilgrim-pillaged" } },
      { id: "leave", label: "Deixá-lo", ritual: "PASSO SILENCIOSO", description: "A estrada já tem mortos demais para mais um juramento.", consequence: "Nenhum ganho imediato. A caravana seguirá sem seu nome.", effect: { setFlag: "pilgrim-left" } },
    ],
  },
  {
    id: "pilgrim-return", regionIds: "all", title: "O homem que voltou", subtitle: "ACAMPAMENTO ENCONTRADO", art: assets.hero,
    description: "O viajante salvo reconhece o sigilo de Veyra entre as tendas. Ele não tem mais pulso, mas carrega um mapa, uma caixa de mercadorias e uma carta que nunca entregou.",
    omen: "O primeiro ato regressou. Escolha que espécie de aliado ele será no seu atlas.", requiresFlags: ["pilgrim-saved"], excludeFlags: ["pilgrim-returned"],
    choices: [
      { id: "mission", label: "Aceitar a missão", ritual: "CARTA ENTREGUE", description: "Receba a rota do mensageiro e uma dívida de estrada.", consequence: "+55 XP, uma Carta da Pedreira e uma futura rota de favor.", effect: { xp: 55, equipment: "Carta da Pedreira", setFlag: "pilgrim-returned" } },
      { id: "trade", label: "Abrir a loja", ritual: "MESA DE ESCAMBO", description: "Troque ouro por um mapa que contorna patrulhas mortas.", consequence: "-20 ouro, Mapa de Atalhos e uma informação para o próximo caminho.", effect: { gold: -20, equipment: "Mapa de Atalhos", setFlag: "pilgrim-returned" } },
      { id: "listen", label: "Ouvir a informação", ritual: "CONFISSÃO DE ESTRADA", description: "Guarde o segredo em vez da mercadoria.", consequence: "+18 mana e uma pista sobre perigos adiante.", effect: { mana: 18, setFlag: "pilgrim-returned" } },
    ],
  },
  {
    id: "pilgrim-betrayal", regionIds: "all", title: "A dívida atravessou a névoa", subtitle: "RETORNO DO SAQUEADO", art: assets.boss,
    description: "O homem que você saqueou não morreu. Ele retorna com arqueiros de Marga e uma voz rouca: “a estrada contou o que você levou”.", omen: "A escolha tomada entre cinzas agora exige ouro, sangue ou culpa.",
    requiresFlags: ["pilgrim-pillaged"], excludeFlags: ["pilgrim-betrayal-resolved"],
    choices: [
      { id: "guard", label: "Erguer a guarda", ritual: "LINHA DE OSSOS", description: "Atravesse a emboscada antes que fechem o círculo.", consequence: "-12 vitalidade, mas você toma +2 Fragmentos de Alma dos caídos.", effect: { hp: -12, soulFragments: 2, setFlag: "pilgrim-betrayal-resolved" } },
      { id: "pay", label: "Pagar a dívida", ritual: "BOLSA ABERTA", description: "Devolva ouro antes que a estrada beba mais sangue.", consequence: "-25 ouro. A perseguição se desfaz, por enquanto.", effect: { gold: -25, setFlag: "pilgrim-betrayal-resolved" } },
      { id: "curse", label: "Condenar a memória", ritual: "MALDIÇÃO DE MARGA", description: "Use a culpa dele como âncora para uma maldição curta.", consequence: "-7 vitalidade, +28 XP e a dívida se encerra em silêncio.", effect: { hp: -7, xp: 28, setFlag: "pilgrim-betrayal-resolved" } },
    ],
  },
  {
    id: "spore-lantern", regionIds: ["darkwood", "swamp"], title: "A lanterna de esporos", subtitle: "LUZ QUE RESPIRA", art: assets.mapDarkwood,
    description: "Uma lanterna pendurada numa raiz pulsa como um pulmão. Dentro dela, pequenas vozes recitam nomes de pessoas que ainda não morreram.", omen: "No bosque, conhecimento e veneno crescem da mesma raiz.",
    choices: [
      { id: "breathe", label: "Inalar a névoa", ritual: "FÔLEGO VEDADO", description: "Divida o ar com a lanterna e aceite a febre breve.", consequence: "+30 XP e +2 Fragmentos; -8 vitalidade.", effect: { xp: 30, soulFragments: 2, hp: -8, setFlag: "spore-breath" } },
      { id: "bottle", label: "Engarrafar o brilho", ritual: "VIDRO MORTO", description: "Capture a luz para uso futuro na formação.", consequence: "+22 mana e o Frasco de Esporos é adicionado ao equipamento.", effect: { mana: 22, equipment: "Frasco de Esporos", setFlag: "spore-bottled" } },
      { id: "shatter", label: "Quebrar a lanterna", ritual: "NOITE LIMPA", description: "Não deixe outra voz aprender seu nome.", consequence: "A névoa se desfaz. Nenhum ganho, nenhum vínculo.", effect: { setFlag: "spore-shattered" } },
    ],
  },
  {
    id: "drowned-cache", regionIds: ["tideCrypt", "blackSalt"], title: "O cofre afogado", subtitle: "A MARÉ ESCONDEU UM SELO", art: assets.tideCrypt,
    description: "Uma arca de coral bate contra a pedra, presa por cabelos de algas. Algo dentro dela responde quando Veyra pronuncia o nome dos mortos.", omen: "A maré oferece tesouros, mas cobra ar, mana ou memória.",
    choices: [
      { id: "dive", label: "Mergulhar", ritual: "PULMÃO DE OSSO", description: "Desça antes que a água negra mude de ideia.", consequence: "+3 Fragmentos de Alma; -14 mana pela pressão abissal.", effect: { soulFragments: 3, mana: -14, setFlag: "cache-dived" } },
      { id: "sell", label: "Tomar o sinete", ritual: "CORAL PARTIDO", description: "Arranque o brasão e deixe o resto para as ondas.", consequence: "+42 ouro e o Sinete Afogado para o inventário.", effect: { gold: 42, equipment: "Sinete Afogado", setFlag: "cache-sold" } },
      { id: "seal", label: "Selar a arca", ritual: "NÓ DE SAL", description: "Feche o cofre antes que desperte o que dorme nele.", consequence: "+20 XP por preservar uma ameaça selada.", effect: { xp: 20, setFlag: "cache-sealed" } },
    ],
  },
  {
    id: "starved-observer", regionIds: ["eclipse", "mountain", "titan"], title: "O observador sem céu", subtitle: "UMA EQUAÇÃO RASGADA", art: assets.eclipse,
    description: "Um astrônomo cego arrasta um círculo de carvão pela pedra. Ele promete prever o próximo eclipse se receber uma lembrança ou uma gota de sangue.", omen: "A previsão pode salvar recursos depois, mas o preço decide o que Veyra carrega agora.",
    choices: [
      { id: "blood", label: "Dar sangue", ritual: "ÓRBITA VERMELHA", description: "Ofereça vitalidade para comprar a rota das estrelas.", consequence: "-10 vitalidade, +40 XP e o Diagrama do Eclipse.", effect: { hp: -10, xp: 40, equipment: "Diagrama do Eclipse", setFlag: "observer-blood" } },
      { id: "memory", label: "Dar uma memória", ritual: "NOME APAGADO", description: "Deixe o observador levar uma certeza menor.", consequence: "+26 mana e +1 Fragmento de Alma.", effect: { mana: 26, soulFragments: 1, setFlag: "observer-memory" } },
      { id: "refuse", label: "Apagar o círculo", ritual: "CÉU FECHADO", description: "A estrada não precisa de outra profecia.", consequence: "Nenhum ganho. O carvão volta a ser apenas carvão.", effect: { setFlag: "observer-refused" } },
    ],
  },
  {
    id: "coal-caravan", regionIds: ["dragon", "thornGarden"], title: "A caravana de carvão", subtitle: "MERCADORES SEM SOMBRA", art: assets.thornGarden,
    description: "Mercadores mascarados arrastam uma carroça de ossos carbonizados. Eles oferecem uma troca rápida antes que os espinhos ou dragões reconheçam o cheiro da carne.", omen: "A negociação define se a caravana volta como contato ou como rumor hostil.",
    choices: [
      { id: "trade", label: "Trocar fragmentos", ritual: "PESO DE CINZAS", description: "Entregue duas almas por uma ferramenta de campo.", consequence: "-2 Fragmentos, +48 ouro e um Pavio de Carvão.", effect: { soulFragments: -2, gold: 48, equipment: "Pavio de Carvão", setFlag: "caravan-traded" } },
      { id: "protect", label: "Escoltar a caravana", ritual: "RUMO PROTEGIDO", description: "Ofereça o sigilo da legião até a próxima dobra.", consequence: "+45 XP e a caravana passa a reconhecer seu acampamento.", effect: { xp: 45, setFlag: "caravan-protected" } },
      { id: "rob", label: "Tomar a carga", ritual: "FUMAÇA E OSSO", description: "A estrada não julga quem volta com suprimentos.", consequence: "+60 ouro; os mercadores guardarão seu nome.", effect: { gold: 60, setFlag: "caravan-robbed" } },
    ],
  },
  {
    id: "veiled-cult-vigil", regionIds: ["deadlands", "darkwood"], title: "A vigília da Lua Velada", subtitle: "CÍRCULO DE VELAS SEM CHAMA", art: assets.mapDarkwood,
    description: "Acólitos de máscaras prateadas velam três cadáveres que ainda sussurram. O ancião pede que Veyra mantenha o círculo fechado até a lua perder a cor.", omen: "A resposta define se o culto surgirá em outras rotas como aliado, memória hostil ou simples silêncio.",
    choices: [
      { id: "aid", label: "Guardar a vigília", ritual: "OSSO E PRATA", description: "Empreste a legião para manter os mortos dentro do círculo.", consequence: "+32 XP, +1 Fragmento de Alma e a Lua Velada reconhecerá Veyra em outras regiões.", effect: { xp: 32, soulFragments: 1, setFlag: "cult-aided" } },
      { id: "exploit", label: "Tomar os sinetes", ritual: "PRATA FÚNEBRE", description: "Quebre a vigília e recolha o metal antes que as máscaras despertem.", consequence: "+46 ouro, mas o culto risca o nome de Veyra de seus mapas.", effect: { gold: 46, setFlag: "cult-exploited" } },
      { id: "leave", label: "Apagar as velas", ritual: "LIMIAR VAZIO", description: "Recuse uma aliança que começou pedindo silêncio.", consequence: "Nenhum ganho. O culto guardará a recusa nas margens.", effect: { setFlag: "cult-refused" } },
    ],
  },
  {
    id: "veiled-cult-favor", regionIds: ["tideCrypt", "thornGarden"], title: "O favor sob o véu", subtitle: "A DÍVIDA PEDE UMA VOZ", art: assets.tideCrypt,
    description: "A Lua Velada retorna numa região distante. Eles pedem que Veyra empreste uma sílaba de mana para fechar uma fenda onde seus iniciados foram enterrados de pé.", omen: "A primeira ajuda volta como dívida. Cumpri-la abre a cripta; romper o juramento fecha a aliança.", requiresFlags: ["cult-aided"], excludeFlags: ["cult-favor-resolved", "cult-oath-broken"],
    choices: [
      { id: "honor", label: "Pagar a dívida", ritual: "SÍLABA ENTERRADA", description: "Dê mana ao selo e deixe a fenda pronunciar o nome de Veyra.", consequence: "-16 mana, +2 Fragmentos de Alma. O culto apontará uma relíquia sob o eclipse.", effect: { mana: -16, soulFragments: 2, setFlag: "cult-favor-resolved" } },
      { id: "barter", label: "Exigir um mapa", ritual: "DÍVIDA MEDIDA", description: "Ajude, mas cobre um fragmento da cartografia proibida.", consequence: "-18 ouro, +42 XP. A aliança persiste, mas o culto registra o preço.", effect: { gold: -18, xp: 42, setFlag: "cult-favor-resolved" } },
      { id: "break", label: "Romper o juramento", ritual: "VÉU RASGADO", description: "Não entregue mais poder a uma máscara sem rosto.", consequence: "O culto desaparece das rotas e torna a aliança hostil.", effect: { setFlag: "cult-oath-broken" } },
    ],
  },
  {
    id: "veiled-cult-relic", regionIds: ["eclipse", "titan", "mountain"], title: "A chave do santuário lunar", subtitle: "A LUA OFERECE UM OSSO", art: assets.eclipse,
    description: "Com a dívida paga, os acólitos oferecem um relicário prateado. Eles juram que ele amplifica ritos; omitem quem ainda pode chamá-lo de volta.", omen: "A relíquia é uma recompensa real — e a última assinatura do pacto ainda não foi revelada.", requiresFlags: ["cult-favor-resolved"], excludeFlags: ["cult-relic-granted", "cult-resentment"],
    choices: [
      { id: "accept", label: "Aceitar o relicário", ritual: "CHAVE DE LUA", description: "Inscreva a peça no inventário e aceite o peso do segundo selo.", consequence: "Relicário da Lua Velada adicionado ao inventário. O culto pode cobrar sua parte mais tarde.", effect: { equipment: "veiled-moon-reliquary", setFlag: "cult-relic-granted" } },
      { id: "study", label: "Ler antes de tocar", ritual: "MARGEM PRATEADA", description: "Troque a posse imediata pela leitura das inscrições internas.", consequence: "+58 XP e +2 Fragmentos de Alma; o culto parte sem entregar a relíquia.", effect: { xp: 58, soulFragments: 2, setFlag: "cult-resentment" } },
      { id: "reject", label: "Devolver a chave", ritual: "MÃO FECHADA", description: "Não carregue uma promessa escrita por outra vontade.", consequence: "Nenhum ganho. A Lua Velada fecha suas portas para Veyra.", effect: { setFlag: "cult-resentment" } },
    ],
  },
  {
    id: "veiled-cult-betrayal", regionIds: ["blackSalt"], title: "A lua cobra seu osso", subtitle: "TRAIÇÃO NO SAL NEGRO", art: assets.blackSalt,
    description: "No sal negro, o relicário abre sozinho. Os acólitos surgem para tomar a mana de Veyra e declarar que a aliança era apenas uma coleira longa.", omen: "A traição pode ser revertida, paga ou atravessada com violência ritual — a relíquia permanece, mas a facção muda para sempre.", requiresFlags: ["cult-relic-granted"], excludeFlags: ["cult-betrayal-resolved"],
    choices: [
      { id: "sever", label: "Cortar o segundo selo", ritual: "LUA PARTIDA", description: "Quebre a corrente antes que ela alcance a legião.", consequence: "-12 vitalidade, +3 Fragmentos de Alma. A traição falha e o relicário permanece com Veyra.", effect: { hp: -12, soulFragments: 3, setFlag: "cult-betrayal-resolved" } },
      { id: "pay", label: "Comprar silêncio", ritual: "PRATA NA BOCA", description: "Ofereça ouro para transformar a traição em um adeus curto.", consequence: "-55 ouro. O culto desaparece, mas não recupera a relíquia.", effect: { gold: -55, setFlag: "cult-betrayal-resolved" } },
      { id: "curse", label: "Amaldiçoar a lua", ritual: "ECLIPSE PARTICULAR", description: "Use o próprio relicário como foco para ferir quem o entregou.", consequence: "-18 mana, +64 XP. Veyra sobrevive, mas o ritual deixa uma cicatriz no Atlas.", effect: { mana: -18, xp: 64, setFlag: "cult-betrayal-resolved" } },
    ],
  },
  {
    id: "boss-rumor-warden", regionIds: ["ashen", "deadlands"], title: "A vigília do sino", subtitle: "DIZEM QUE O GUARDIÃO VOLTOU", art: assets.boss,
    description: "Viajantes ouviram o sino do Ossuário tocar para uma formação que não deveria existir. Eles esperam Veyra junto à vala e trazem os nomes que o sino deixou de reclamar.", omen: "A primeira coroa reanimada mudou a linguagem da estrada.", requiresRaisedBossIds: ["warden"],
    choices: [
      { id: "receive", label: "Receber os nomes", ritual: "REGISTRO FÚNEBRE", description: "Deixe o Guardião ouvir quem ainda teme suas badaladas.", consequence: "+48 XP e +1 Fragmento de Alma. A vigília reconhece o novo juramento.", effect: { xp: 48, soulFragments: 1, setFlag: "warden-rumor-heeded" } },
      { id: "silence", label: "Silenciar o sino", ritual: "BADALO CONTIDO", description: "Mande a coroa guardar a própria voz até a estrada se acostumar.", consequence: "+18 mana. Os peregrinos partem sem saber se devem agradecer.", effect: { mana: 18, setFlag: "warden-rumor-muted" } },
    ],
  },
  {
    id: "boss-rumor-tide-herald", regionIds: ["swamp", "tideCrypt"], title: "Pedágio da maré invertida", subtitle: "DIZEM QUE O ARAUTO VOLTOU", art: assets.tideCrypt,
    description: "A água recua para abrir um caminho de conchas. Os afogados depositam moedas aos pés de Veyra e pedem que o Arauto não volte a chamar seus filhos pelo nome.", omen: "A maré responde à formação. O reino aprendeu que o Arauto serve a uma vontade viva.", requiresRaisedBossIds: ["tide-herald"],
    choices: [
      { id: "toll", label: "Cobrar o pedágio", ritual: "MOEDA ABISSAL", description: "Aceite as oferendas e deixe a rota lembrar quem controla a água.", consequence: "+58 ouro e +1 Fragmento de Alma. O rumor se espalha pelas criptas.", effect: { gold: 58, soulFragments: 1, setFlag: "tide-rumor-claimed" } },
      { id: "release", label: "Dispersar os afogados", ritual: "CORRENTE LIBERTA", description: "Use a voz do Arauto para deixá-los seguir até a maré baixa.", consequence: "+44 XP e +14 mana. A costa passa uma noite em silêncio.", effect: { xp: 44, mana: 14, setFlag: "tide-rumor-released" } },
    ],
  },
  {
    id: "boss-rumor-rose-matriarch", regionIds: ["darkwood", "thornGarden"], title: "O testamento da raiz", subtitle: "DIZEM QUE A MATRIARCA FLORESCEU", art: assets.thornGarden,
    description: "Jardineiros esquecidos oferecem uma semente negra a Veyra. Cada raiz na floresta agora dobra a cabeça quando a Matriarca atravessa a formação.", omen: "A flora não esqueceu sua rainha. A ressureição converteu medo regional em testemunha da legião.", requiresRaisedBossIds: ["rose-matriarch"],
    choices: [
      { id: "plant", label: "Plantar a semente", ritual: "RAIZ VINCULADA", description: "Deixe a Matriarca decidir onde a nova raiz vai vigiar.", consequence: "+52 XP e +1 Fragmento de Alma. O jardim passa a carregar uma marca de Veyra.", effect: { xp: 52, soulFragments: 1, setFlag: "rose-rumor-planted" } },
      { id: "burn", label: "Queimar a oferta", ritual: "FLOR SEM DONA", description: "Impeça que a aliança com a Matriarca crie uma floresta inteira de promessas.", consequence: "+26 ouro. A raiz recua, mas a fumaça conserva o rumor.", effect: { gold: 26, setFlag: "rose-rumor-burned" } },
    ],
  },
  {
    id: "boss-rumor-starved-astronomer", regionIds: ["eclipse", "mountain"], title: "A carta que olha de volta", subtitle: "DIZEM QUE O ASTRÔNOMO VOLTOU", art: assets.eclipse,
    description: "Uma astrônoma sem pupilas estende uma carta celeste para Veyra. As estrelas desenhadas nela recuam toda vez que a formação se aproxima.", omen: "A coroa reanimada reordenou o céu local. A informação oferecida pode orientar ou corromper o próximo cálculo.", requiresRaisedBossIds: ["starved-astronomer"],
    choices: [
      { id: "read", label: "Ler a carta", ritual: "CÉU DEVORADO", description: "Peça ao Astrônomo que complete o mapa sem fingir que a fome acabou.", consequence: "+66 XP e +16 mana. O eclipse deixa uma anotação precisa no Atlas.", effect: { xp: 66, mana: 16, setFlag: "astronomer-rumor-read" } },
      { id: "fold", label: "Dobrar as estrelas", ritual: "CARTA SELADA", description: "Lacre a previsão antes que ela escolha Veyra como coordenada.", consequence: "+2 Fragmentos de Alma. A visão fica guardada, não destruída.", effect: { soulFragments: 2, setFlag: "astronomer-rumor-sealed" } },
    ],
  },
  {
    id: "boss-rumor-black-salt-hierophant", regionIds: ["titan", "blackSalt"], title: "Rendição dos nove selos", subtitle: "DIZEM QUE O HIEROFANTE VOLTOU", art: assets.blackSalt,
    description: "Cavaleiros da Ordem rival chegam sem armas. Eles reconhecem o Hierofante atrás de Veyra, mas não sabem se a presença dele é sentença, fuga ou provocação.", omen: "A ordem que perseguia Veyra perdeu o monopólio dos próprios éditos.", requiresRaisedBossIds: ["black-salt-hierophant"],
    choices: [
      { id: "edict", label: "Reescrever o édito", ritual: "MURALHA SUBMISSA", description: "Faça o Hierofante transformar a rendição em juramento de passagem.", consequence: "+72 ouro e +2 Fragmentos de Alma. A Ordem cede uma rota ao Atlas.", effect: { gold: 72, soulFragments: 2, setFlag: "hierophant-rumor-edict" } },
      { id: "dismiss", label: "Mandar que partam", ritual: "SAL SEM SENTENÇA", description: "Recuse uma muralha de inimigos que muda de voz rápido demais.", consequence: "+58 XP. A Ordem leva o medo para além do Sal Negro.", effect: { xp: 58, setFlag: "hierophant-rumor-dismissed" } },
    ],
  },
  {
    id: "servant-legacy-aldren", regionIds: ["mountain"], title: "A porta que Aldren deixou aberta", subtitle: "LEGADO · ÚLTIMO VIGIA", art: assets.mapMountain,
    description: "No Mosteiro da Última Vigília, o Cavaleiro Afogado encontra a porta que abandonou. Uma voz de dentro chama pelo vigia que deixou os afogados entrar.", omen: "A memória não pede perdão; pede que Veyra decida o que a fortaleza ainda deve ao nome de Aldren.", requiresFlags: ["memory-aldren-salt-ruins"], excludeFlags: ["aldren-legacy-kept", "aldren-legacy-broken"],
    choices: [
      { id: "keep-watch", label: "Restaurar a vigília", ritual: "MURALHA DE SAL", description: "Permita que Aldren proteja a passagem que um dia traiu.", consequence: "+1 Fragmento de Alma. Uma vigília reanimada passa a guardar a trilha.", effect: { soulFragments: 1, setFlag: "aldren-legacy-kept" } },
      { id: "break-oath", label: "Quebrar o portão", ritual: "MARÉ SEM PERDÃO", description: "Afogue o último juramento junto com os nomes que o corromperam.", consequence: "+56 XP. A fortaleza cai, mas Aldren deixa de ouvir a antiga ordem.", effect: { xp: 56, setFlag: "aldren-legacy-broken" } },
    ],
  },
  {
    id: "servant-legacy-seraphine", regionIds: ["thornGarden"], title: "A criança sob o vidro", subtitle: "LEGADO · IRMÃ SEM JARDIM", art: assets.thornGarden,
    description: "Uma raiz abre o solo da estufa e devolve uma fita com o nome da aprendiz de Seraphine. A rosa que a prende ainda pode ser colhida ou curada.", omen: "A memória de Seraphine revela que o Jardim não esqueceu suas crianças — apenas aprendeu a chamá-las de alimento.", requiresFlags: ["memory-seraphine-glasshouse"], excludeFlags: ["seraphine-legacy-garden", "seraphine-legacy-ash"],
    choices: [
      { id: "name-flowers", label: "Devolver os nomes", ritual: "ESTUFA DE VIGÍLIA", description: "Faça cada rosa guardar uma pessoa, não uma presa.", consequence: "+2 Fragmentos de Alma. A estufa passa a oferecer cura aos viajantes.", effect: { soulFragments: 2, setFlag: "seraphine-legacy-garden" } },
      { id: "prune-grief", label: "Podar as raízes", ritual: "LUTO EM CINZA", description: "Permita que Seraphine corte a fome do Jardim pela origem.", consequence: "+52 XP. As raízes recuam, deixando veneno nas marcas antigas.", effect: { xp: 52, setFlag: "seraphine-legacy-ash" } },
    ],
  },
  {
    id: "servant-legacy-eren", regionIds: ["ashen"], title: "A casa de Eren", subtitle: "LEGADO · ÚLTIMO FÔLEGO", art: assets.mapAshen,
    description: "Três pedras na Estrada de Marga marcam uma porta sem teto. Eren reconhece a criança que tentou esconder, agora adulta, diante de um abrigo queimado.", omen: "A estrada oferece a Eren a chance de salvar alguém depois da morte — ou de transformar o fracasso em uma sentença contra os saqueadores.", requiresFlags: ["memory-eren-marga-road"], excludeFlags: ["eren-legacy-shelter", "eren-legacy-silence"],
    choices: [
      { id: "raise-shelter", label: "Erguer o abrigo", ritual: "TELHADO DE OSSO", description: "Dê ao sobrevivente a vigília que Eren não conseguiu entregar em vida.", consequence: "+18 vitalidade. Um abrigo de estrada passa a acolher viajantes em Marga.", effect: { hp: 18, setFlag: "eren-legacy-shelter" } },
      { id: "seal-road", label: "Selar o rastro", ritual: "ESTRADA SEM TESTEMUNHAS", description: "Deixe Eren calar os cobradores que regressam ao lugar do massacre.", consequence: "+48 XP. A estrada recua diante da formação de Veyra.", effect: { xp: 48, setFlag: "eren-legacy-silence" } },
    ],
  },
  {
    id: "legion-bond-aldren", regionIds: ["mountain"], title: "A vigília se recusa a partir", subtitle: "CONFRONTO · ÚLTIMO VIGIA", art: assets.mapMountain,
    description: "Aldren fixa a espada no caminho. Um grupo de sobreviventes pede abrigo além da muralha, mas a tempestade trará inimigos e atrasará a formação.", omen: "O Cavaleiro Morto se recusa a abandonar os sobreviventes. Pela primeira vez, sua lealdade a Veyra disputa espaço com o juramento que o matou.", requiresFlags: ["aldren-legacy-kept"], excludeFlags: ["aldren-bond-shelter", "aldren-bond-march"],
    choices: [
      { id: "hold", label: "Manter a vigília", ritual: "JURAMENTO REFEITO", description: "Deixe Aldren cobrir a retirada dos vivos, mesmo que a estrada cobre tempo e sangue.", consequence: "+20 vitalidade. Aldren confia que Veyra não usa a morte para esquecer os vivos.", effect: { hp: 20, setFlag: "aldren-bond-shelter", bondDeltas: { "drowned-knight": { loyalty: 9, trust: 12, devotion: 6, rancor: -7 } } } },
      { id: "march", label: "Exigir a marcha", ritual: "ORDEM DE OSSO", description: "Ordene que Aldren deixe a porta aos vivos e preserve a força da legião.", consequence: "+54 XP. Aldren obedece, mas a ordem pesa entre vocês.", effect: { xp: 54, setFlag: "aldren-bond-march", bondDeltas: { "drowned-knight": { loyalty: -8, trust: -12, fear: 10, rancor: 15 } } } },
    ],
  },
  {
    id: "legion-bond-seraphine", regionIds: ["thornGarden"], title: "A rosa pede outro nome", subtitle: "CONFRONTO · IRMÃ SEM JARDIM", art: assets.thornGarden,
    description: "Seraphine encontra uma aprendiz presa em raízes conscientes. A criatura ainda respira, mas a única cura possível exige entregar parte da corrupção que Veyra acumulou.", omen: "A Espectra dos Espinhos não pede permissão para sentir. Ela pergunta se Veyra deseja uma serva inteira ou uma criança viva.", requiresFlags: ["seraphine-legacy-garden"], excludeFlags: ["seraphine-bond-purge", "seraphine-bond-harvest"],
    choices: [
      { id: "purge", label: "Pagar a cura", ritual: "SEIVA PARTILHADA", description: "Permita que Seraphine desprenda a raiz e aceite carregar o veneno no próprio osso.", consequence: "+2 Fragmentos. Seraphine vê misericórdia onde esperava domínio.", effect: { soulFragments: 2, setFlag: "seraphine-bond-purge", bondDeltas: { "thorn-specter": { loyalty: 8, trust: 10, devotion: 9, corruption: -12 } } } },
      { id: "harvest", label: "Colher a raiz", ritual: "FLOR DE GUERRA", description: "Transforme a raiz em matéria ritual e deixe a voz humana desaparecer sob o vidro.", consequence: "+62 XP e +10 mana. Seraphine se curva, mas a fome aprende seu nome.", effect: { xp: 62, mana: 10, setFlag: "seraphine-bond-harvest", bondDeltas: { "thorn-specter": { loyalty: -6, fear: 12, rancor: 9, corruption: 18, trust: -10 } } } },
    ],
  },
  {
    id: "legion-bond-eren", regionIds: ["ashen"], title: "O sobrevivente que não baixa a lâmina", subtitle: "CONFRONTO · ÚLTIMO FÔLEGO", art: assets.mapAshen,
    description: "Eren reconhece um saqueador entre os cobradores rendidos. Ele pede justiça imediata; os outros prisioneiros oferecem o caminho para um esconderijo de ouro.", omen: "O morto que falhou em salvar uma criança pede agora que Veyra escolha entre vingança e uma rota para sustentar a legião.", requiresFlags: ["eren-legacy-shelter"], excludeFlags: ["eren-bond-judgement", "eren-bond-bargain"],
    choices: [
      { id: "judgement", label: "Ouvir o veredito", ritual: "LÂMINA DE MARGA", description: "Permita que Eren execute o homem e mantenha os sobreviventes sob sua vigília.", consequence: "+1 Fragmento. Eren acredita que sua dor não foi reduzida a uma moeda.", effect: { soulFragments: 1, setFlag: "eren-bond-judgement", bondDeltas: { "marga-survivor": { loyalty: 10, trust: 11, devotion: 5, rancor: -9 } } } },
      { id: "bargain", label: "Comprar a rota", ritual: "OURO SEM ROSTO", description: "Faça Eren baixar a lâmina e transforme a culpa dos prisioneiros em acesso ao esconderijo.", consequence: "+74 ouro. Eren obedece, mas não chama a decisão de justiça.", effect: { gold: 74, setFlag: "eren-bond-bargain", bondDeltas: { "marga-survivor": { loyalty: -7, trust: -13, fear: 9, rancor: 14 } } } },
    ],
  },
];

export const secondaryQuests: SecondaryQuest[] = [
  {
    id: "contract-ash-tithe", category: "contract", seal: "CONTRATO 01 · ESTRADA", title: "Dízimo da Cinza",
    description: "Os saqueadores de Marga cobram dos vivos e dos mortos. Corte a coleta antes que ela alcance a primeira fogueira.", objective: "Derrote 8 Saqueadores de Marga.",
    condition: { type: "kill", enemyId: "marauder", count: 8 }, reward: { xp: 36, gold: 48 }, art: assets.mapAshen,
  },
  {
    id: "contract-hollow-bell", category: "contract", seal: "CONTRATO 02 · OSSUÁRIO", title: "Silêncio para o Sino Oco",
    description: "Cada revenante conserva uma nota do sino enterrado. Faça o eco perder seus últimos cantores.", objective: "Derrote 5 Revenantes do Sino.",
    condition: { type: "kill", enemyId: "bell-revenant", count: 5 }, reward: { xp: 48, gold: 58, soulFragments: 1 }, art: assets.mapDeadlands,
  },
  {
    id: "contract-drowned-toll", category: "contract", seal: "CONTRATO 03 · MARÉ", title: "Pedágio dos Afogados",
    description: "Acólitos afogados recolhem moedas dos viajantes que não voltam. Quebre a procissão e recupere a rota.", objective: "Derrote 12 Acólitos Afogados.",
    condition: { type: "kill", enemyId: "drowned-acolyte", count: 12 }, reward: { xp: 62, gold: 72, soulFragments: 2 }, art: assets.tideCrypt,
  },
  {
    id: "hunt-root-sentinel", category: "hunt", seal: "CAÇADA 01 · RAIZ", title: "A Sentinela que Germina",
    description: "Uma sentinela de briar cresce de cada patrulha perdida. Registre três quedas para revelar o ciclo da raiz.", objective: "Abata 3 Sentinelas de Briar.",
    condition: { type: "kill", enemyId: "briar-sentinel", count: 3 }, reward: { xp: 60, gold: 40, soulFragments: 2 }, art: assets.thornGarden,
  },
  {
    id: "hunt-perigee-shade", category: "hunt", seal: "CAÇADA 02 · ECLIPSE", title: "Sombra de Perigeu",
    description: "A sombra deixa rastros antes de possuir uma forma. Faça-a atravessar o véu vezes suficientes para que o atlas a reconheça.", objective: "Dissipe 5 Sombras de Perigeu.",
    condition: { type: "kill", enemyId: "eclipse-shade", count: 5 }, reward: { xp: 78, gold: 55, soulFragments: 2 }, art: assets.eclipse,
  },
  {
    id: "hunt-tide-herald", category: "hunt", seal: "CAÇADA 03 · CORRENTE", title: "O Arauto sob as Correntes",
    description: "A abadia guardou o nome de quem ensinou a maré a obedecer. Derrube o arauto quando ele emergir do poço central.", objective: "Derrote o Arauto da Maré.",
    condition: { type: "boss_defeated", bossId: "tide-herald" }, reward: { xp: 95, gold: 80, equipment: "drowned-plate", soulFragments: 3 }, art: assets.tideCrypt,
  },
  {
    id: "relic-black-crown", category: "relic", seal: "RELÍQUIA 01 · COROA", title: "Fragmentos da Coroa Negra",
    description: "Três relíquias do atlas formam a lembrança da coroa que precedeu o Rei Morto. Nenhuma delas pode permanecer esquecida.", objective: "Registre 3 relíquias regionais no atlas.",
    condition: { type: "relics_owned", count: 3 }, reward: { xp: 115, gold: 70, soulFragments: 4 }, art: assets.blackSalt,
  },
  {
    id: "relic-perigee-lens", category: "relic", seal: "RELÍQUIA 02 · CÉU", title: "A Lente que Não Pisca",
    description: "A Lente de Perigeu foi quebrada para que o céu esquecesse um assassinato. Recupere-a e leia a primeira fenda.", objective: "Localize a Lente de Perigeu.",
    condition: { type: "relic_owned", relicId: "perigee-lens" }, reward: { xp: 90, gold: 76, equipment: "amber-focus" }, art: assets.eclipse,
  },
  {
    id: "relic-black-seal", category: "relic", seal: "RELÍQUIA 03 · SAL", title: "O Nono Selo",
    description: "O último fragmento da ordem rival não é uma pedra, mas uma sentença. Traga-o para o inventário antes que outra mão o assine.", objective: "Localize o Selo Negro.",
    condition: { type: "relic_owned", relicId: "black-seal" }, reward: { xp: 150, gold: 120, equipment: "salt-phylactery", soulFragments: 4 }, art: assets.blackSalt,
  },
  {
    id: "story-old-king", category: "story", seal: "HISTÓRIA 01 · TRONO", title: "Quem Matou o Rei Antigo?",
    description: "O Guardião do Ossuário mantém um juramento que não lhe pertence. Sua queda libera a primeira testemunha do regicídio.", objective: "Derrube o Guardião do Ossuário.",
    condition: { type: "boss_defeated", bossId: "warden" }, reward: { xp: 70, gold: 55, soulFragments: 2 }, art: assets.boss,
  },
  {
    id: "story-pilgrim-letter", category: "story", seal: "HISTÓRIA 02 · CARTA", title: "A Carta sem Destino",
    description: "Um mensageiro respirante leva uma carta para o rei morto. Salve-o para descobrir por que a estrada recusou sua entrega.", objective: "Ressuscite o Respirante de Marga no presságio de estrada.",
    condition: { type: "event_flag", flag: "pilgrim-saved" }, reward: { xp: 45, gold: 40, equipment: "pilgrim-ring" }, art: assets.mapAshen,
  },
  {
    id: "story-salt-archive", category: "story", seal: "HISTÓRIA 03 · ORDEM", title: "O Arquivo do Sal",
    description: "O Hierofante guarda a segunda metade da confissão. Quebre a ordem rival para abrir o registro de suas sentenças.", objective: "Derrote o Hierofante do Sal Negro.",
    condition: { type: "boss_defeated", bossId: "black-salt-hierophant" }, reward: { xp: 140, gold: 90, soulFragments: 5 }, art: assets.blackSalt,
  },
  {
    id: "servant-drowned-memory", category: "servant_memory", seal: "MEMÓRIA 01 · MARÉ", title: "O Escudo que Voltou",
    description: "O Cavaleiro Afogado recorda uma muralha que abandonou. Vincule-o para escutar o nome que ainda bate sob seu elmo.", objective: "Recrute o Cavaleiro Afogado.",
    condition: { type: "servant_recruited", templateId: "drowned-knight" }, reward: { xp: 65, gold: 35, soulFragments: 3 }, art: assets.tideCrypt,
  },
  {
    id: "servant-thorn-memory", category: "servant_memory", seal: "MEMÓRIA 02 · ROSA", title: "A Irmã sem Jardim",
    description: "Uma Irmã do Espinho conhece os nomes plantados nas rosas. Traga-a para a legião e faça a memória florescer.", objective: "Recrute a Irmã do Espinho.",
    condition: { type: "servant_recruited", templateId: "thorn-sister" }, reward: { xp: 60, gold: 36, soulFragments: 3 }, art: assets.thornGarden,
  },
  {
    id: "servant-marga-memory", category: "servant_memory", seal: "MEMÓRIA 03 · FÔLEGO", title: "O Último Fôlego de Marga",
    description: "O Respirante de Marga ainda repete a última frase de alguém que viu a estrada morrer. Dê-lhe um lugar na formação.", objective: "Vincule o Respirante de Marga à legião.",
    condition: { type: "servant_recruited", templateId: "marga-respirant" }, reward: { xp: 50, gold: 40, soulFragments: 2 }, art: assets.mapAshen,
  },
  {
    id: "legacy-aldren", category: "servant_memory", seal: "LEGADO · VIGÍLIA", title: "A Fortaleza que Aldren Abandonou",
    description: "Aldren voltou ao lugar onde deixou o portão aberto. A decisão de Veyra decide se a sua vigília será reparação ou ruptura.", objective: "Conclua o legado de Aldren em Dorsal de Sal.", condition: { type: "servant_memory", memoryId: "aldren-legacy-kept" }, reward: { xp: 76, gold: 44, soulFragments: 2 }, art: assets.mapMountain,
  },
  {
    id: "legacy-seraphine", category: "servant_memory", seal: "LEGADO · ROSA", title: "As Rosas de Seraphine",
    description: "O Jardim guarda a aprendiz de Seraphine em uma raiz. A escolha entre recordar e podar transforma a memória em rota.", objective: "Conclua o legado de Seraphine no Jardim de Espinhos.", condition: { type: "servant_memory", memoryId: "seraphine-legacy-garden" }, reward: { xp: 72, gold: 42, soulFragments: 2 }, art: assets.thornGarden,
  },
  {
    id: "legacy-eren", category: "servant_memory", seal: "LEGADO · ABRIGO", title: "A Casa que Sobreviveu",
    description: "Eren encontra a criança que tentou salvar e pode devolver à Estrada de Marga uma casa que não dependa de sorte para durar.", objective: "Conclua o legado de Eren em Marga.", condition: { type: "servant_memory", memoryId: "eren-legacy-shelter" }, reward: { xp: 68, gold: 46, soulFragments: 2 }, art: assets.mapAshen,
  },
];

export const servantTemplates: ServantTemplate[] = [
  {
    id: "marga-respirant", name: "Respirante de Marga", role: "support", rarity: "uncommon", affinity: "shadow", origin: "Estrada Morta de Marga", art: assets.mapAshen,
    equipment: "Selo de viagem quebrado", passive: "Último Pulso: ao curar, concede 2 de guarda à formação.", stats: { guard: 2, damage: 1, sustain: 4, arcana: 2 },
    active: { id: "borrowed-breath", name: "Fôlego Emprestado", description: "Costura a vitalidade de Veyra com uma memória recém-morta.", kind: "support", cost: 9, heal: 18, damageType: "shadow" }, evolutions: [],
  },
  {
    id: "bone-rat", name: "Rato Ossudo", role: "assault", rarity: "common", affinity: "physical", origin: "Covas de Marga", art: assets.mapAshen,
    equipment: "Garras de osso", passive: "Fome de medula: +2 dano contra alvos sangrando.", stats: { guard: 1, damage: 2, sustain: 1, arcana: 0 },
    active: { id: "gnaw", name: "Roer Tendão", description: "Morde a brecha do alvo e aprofunda sangramento.", kind: "assault", cost: 6, damage: 12, damageType: "physical", status: "bleed", turns: 2 }, evolutions: [],
  },
  {
    id: "drowned-knight", name: "Cavaleiro Afogado", role: "guard", rarity: "rare", affinity: "ice", origin: "Cripta das Marés", art: assets.tideCrypt,
    equipment: "Escudo de coral funerário", passive: "Corpo Encharcado: após sofrer dano, reduz o próximo dano recebido pela formação.", stats: { guard: 5, damage: 3, sustain: 2, arcana: 1 },
    active: { id: "drowned-wall", name: "Muralha Submersa", description: "Ergue uma guarda de maré e estilhaça a postura do alvo.", kind: "break", cost: 11, damage: 18, damageType: "ice", status: "freeze", turns: 1 },
    evolutions: [
      { id: "abyssal-champion", name: "Campeão Abissal", requiredLevel: 3, fragmentCost: 8, description: "A couraça se fecha em torno de uma maré obediente.", stats: { guard: 7, damage: 4, sustain: 3, arcana: 2 }, passive: "Corpo Abissal: bloqueios da formação absorvem mais dano.", active: { id: "abyssal-crash", name: "Impacto Abissal", description: "Quebra a postura com uma onda funerária.", kind: "break", cost: 13, damage: 26, damageType: "ice", status: "freeze", turns: 1 }, art: assets.tideCrypt },
      { id: "leviathan-knight", name: "Cavaleiro do Leviatã", requiredLevel: 6, fragmentCost: 18, description: "Uma sombra colossal respira através do elmo inundado.", stats: { guard: 10, damage: 6, sustain: 4, arcana: 3 }, passive: "Juramento do Leviatã: a formação não pode cair no primeiro golpe de um telegráfico.", active: { id: "leviathan-gate", name: "Portão do Leviatã", description: "Invoca o casco de uma criatura afogada e golpeia toda a postura.", kind: "break", cost: 18, damage: 38, damageType: "ice", status: "freeze", turns: 2 }, art: assets.tideCrypt },
    ],
  },
  {
    id: "thorn-sister", name: "Irmã do Espinho", role: "arcanist", rarity: "uncommon", affinity: "poison", origin: "Jardim de Espinhos", art: assets.thornGarden,
    equipment: "Cajado de roseira seca", passive: "Pólen funerário: veneno e corrupção duram +1 rodada.", stats: { guard: 1, damage: 3, sustain: 1, arcana: 4 },
    active: { id: "thorn-curse", name: "Benção da Rosa Morta", description: "Enraíza a alma do alvo em corrupção.", kind: "assault", cost: 10, damage: 20, damageType: "poison", status: "corruption", turns: 3 }, evolutions: [],
  },
];

export function createServant(templateId: string, level = 1, bossId?: string): Servant {
  const template = servantTemplates.find((item) => item.id === templateId) ?? servantTemplates[0];
  const hp = 26 + template.stats.guard * 8 + level * 5;
  return { uid: `${template.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, templateId: template.id, name: template.name, role: template.role, rarity: template.rarity, affinity: template.affinity, origin: template.origin, level, xp: 0, stars: template.rarity === "common" ? 1 : template.rarity === "uncommon" ? 2 : 3, stats: { ...template.stats }, passive: template.passive, active: { ...template.active }, equipment: template.equipment, art: template.art, evolutionStage: 0, maxHp: hp, hp, revivalDebt: 0, bossId };
}

export const initialLegion = [createServant("bone-rat")];

export const initialAttributes: NecromancerAttributes = { power: 0, vitality: 0, intellect: 0, dominion: 0, corruption: 0 };

export const specializationTrees: SpecializationTree[] = [
  {
    id: "bone-lord", name: "Senhor dos Ossos", title: "A legião é o seu corpo", description: "Multiplica a presença, a guarda e o peso dos mortos na formação.", accent: "physical",
    talents: [
      { id: "bone-throng", name: "Falange de Fêmures", tier: 1, requiredLevel: 2, description: "Ossos respondem antes do comando.", effect: "+1 limite da legião e +4 dano de formação." },
      { id: "bone-crown", name: "Coroa Medular", tier: 2, requiredLevel: 4, description: "Uma guarda feita de costelas acompanha Veyra.", effect: "+10% guarda da legião." },
      { id: "bone-vanguard", name: "Vanguarda Sepulcral", tier: 3, requiredLevel: 6, description: "Servos avançam quando a postura inimiga cede.", effect: "+8 dano quando o alvo está vulnerável." },
    ],
    milestones: [
      { level: 1, title: "Primeira Vértebra", effect: "+1 dano e guarda da formação por nível." },
      { level: 10, title: "Manto de Costelas", effect: "A legião recebe +10 guarda adicional." },
      { level: 20, title: "Câmara Medular", effect: "+1 espaço permanente na legião." },
      { level: 30, title: "Marcha Fúnebre", effect: "Servos causam +18 dano adicional nas ordens." },
      { level: 40, title: "Coroa de Fêmures", effect: "+1 espaço permanente na legião." },
      { level: 55, title: "Ossuário Andante", effect: "A guarda da formação recebe +18 adicional." },
      { level: 70, title: "Rei sem Tumba", effect: "A formação alcança sua maestria óssea." },
    ],
  },
  {
    id: "reaper", name: "Ceifador", title: "Toda brecha é uma sentença", description: "Converte sangramento, vulnerabilidade e execução em pressão letal.", accent: "physical",
    talents: [
      { id: "reaper-mark", name: "Marca da Foice", tier: 1, requiredLevel: 2, description: "O primeiro corte revela uma artéria espiritual.", effect: "+25% de dano contra alvos sangrando." },
      { id: "reaper-execute", name: "Último Corte", tier: 2, requiredLevel: 4, description: "Inimigos próximos da ruína não escapam.", effect: "+30% de dano contra alvos abaixo de 35% de vida." },
      { id: "reaper-harvest", name: "Colheita Rubra", tier: 3, requiredLevel: 6, description: "A morte devolve o que foi tomado.", effect: "Derrotas curam 14 de vida e restauram 8 de mana." },
    ],
    milestones: [
      { level: 1, title: "Fio da Foice", effect: "+0,6% dano físico por nível de juramento." },
      { level: 10, title: "Sangria Fria", effect: "Cortes contra inimigos sangrando se tornam mais precisos." },
      { level: 20, title: "Passo do Carrasco", effect: "+12 dano de execução contra alvos abaixo de 35% de vida." },
      { level: 30, title: "Ceifa Implacável", effect: "O dano físico do juramento continua crescendo a cada nível." },
      { level: 40, title: "Lâmina do Fim", effect: "+18 dano de execução contra alvos abaixo de 35% de vida." },
      { level: 55, title: "Colheita Pálida", effect: "Derrotas restauram vitalidade e mana com maior eficiência." },
      { level: 70, title: "Última Sentença", effect: "A foice alcança sua maestria máxima." },
    ],
  },
  {
    id: "lich", name: "Lich", title: "A mente sobrevive ao cadáver", description: "Amplifica ritos, reserva de mana, maldições e domínio arcano.", accent: "shadow",
    talents: [
      { id: "lich-reservoir", name: "Filactério Aberto", tier: 1, requiredLevel: 2, description: "Uma reserva de âmbar pulsa fora do peito.", effect: "+14 mana máxima e +2 dano ritual." },
      { id: "lich-malediction", name: "Maldição Recursiva", tier: 2, requiredLevel: 4, description: "Toda condição deixa uma sombra adicional.", effect: "Status de rito duram +1 turno." },
      { id: "lich-cataclysm", name: "Eclipse Necrótico", tier: 3, requiredLevel: 6, description: "O cataclismo aprende a preservar seu próprio combustível.", effect: "Cataclismo custa 8 mana a menos e rompe +10 postura." },
    ],
    milestones: [
      { level: 1, title: "Cinza Pensante", effect: "+0,4% dano ritual por nível de juramento." },
      { level: 10, title: "Reserva Externa", effect: "Ritos custam menos mana conforme o juramento cresce." },
      { level: 20, title: "Língua Maldita", effect: "Status rituais recebem +1 turno adicional." },
      { level: 30, title: "Filactério Vivo", effect: "O desconto de mana continua avançando até o nível 70." },
      { level: 40, title: "Eclipse Contido", effect: "Rupturas causadas por ritos recebem +12 postura." },
      { level: 55, title: "Memória da Morte", effect: "Maldições permanecem por mais tempo no alvo." },
      { level: 70, title: "Arquilich", effect: "A mente ritual alcança sua maestria máxima." },
    ],
  },
  {
    id: "soul-master", name: "Mestre das Almas", title: "Nada morre sem deixar um vínculo", description: "Sacrifica, protege e reconstrói os servos a partir de fragmentos.", accent: "holy",
    talents: [
      { id: "soul-tribute", name: "Tributo de Cinzas", tier: 1, requiredLevel: 2, description: "A legião partilha a dor que atravessa Veyra.", effect: "Ordens de servos custam 2 mana a menos e curam +6." },
      { id: "soul-fragments", name: "Coletor de Ecos", tier: 2, requiredLevel: 4, description: "Cada queda inimiga deixa matéria para uma nova costura.", effect: "+1 Fragmento de Alma a cada vitória." },
      { id: "soul-reweave", name: "Costura Imortal", tier: 3, requiredLevel: 6, description: "A alma conhece melhor o caminho de volta.", effect: "Ressurreição custa 4 fragmentos a menos e reduz 8% dos atributos, não 14%." },
    ],
    milestones: [
      { level: 1, title: "Fio de Cinzas", effect: "+1 sustentação de formação por nível de juramento." },
      { level: 10, title: "Ponte de Ecos", effect: "Ordens de servos custam menos mana conforme o juramento cresce." },
      { level: 20, title: "Mão Costurada", effect: "Ressurreições exigem menos Fragmentos de Alma." },
      { level: 30, title: "Coro de Ausentes", effect: "Curativos e sustentação da legião crescem a cada nível." },
      { level: 40, title: "Coletor Silencioso", effect: "Vitórias podem render um Fragmento de Alma adicional." },
      { level: 55, title: "Trama Refeita", effect: "Servos retornam com menos cicatrizes de alma." },
      { level: 70, title: "Tecelã do Além", effect: "Os vínculos espirituais alcançam sua maestria máxima." },
    ],
  },
];

export const initialPlayer: PlayerState = {
  level: 1, xp: 0, xpToNext: 100, hp: 118, maxHp: 118, mana: 74, maxMana: 74,
  power: 18, spellSlots: 2, gold: 48, army: ["Rato Ossudo"], equipment: ["rusted-blade", "ash-shroud", "guardian-seal", "amber-ring", "amber-focus", "bone-needle"], relics: [], legion: initialLegion, soulFragments: 3, fallenServants: [],
  attributes: initialAttributes, attributePoints: 0, talentPoints: 0, talents: [], specialization: null,
  equipped: { weapon: "rusted-blade", armor: "ash-shroud", relic: "guardian-seal", amulet: "amber-ring", grimoire: "amber-focus", artifact: "bone-needle" },
};

export const initialCitadel: CitadelState = { buildings: { tower: 0, crypt: 0, forge: 0, altar: 0, library: 0, garden: 0 } };

export const citadelBuildings: CitadelBuilding[] = [
  { id: "tower", name: "Torre Arcana", title: "O céu aprende seu nome", description: "Uma agulha quebrada de pedra negra onde o manto de Veyra retém a última faísca de cada rito.", benefit: "+5 dano ritual e +5 mana máxima por nível.", art: assets.eclipse, baseGold: 55, maxLevel: 5 },
  { id: "crypt", name: "Cripta da Legião", title: "Mais espaço sob a terra", description: "Nichos vazios aguardam ossos, nomes e promessas que não deveriam ter retornado.", benefit: "+1 limite da legião por nível.", art: assets.tideCrypt, baseGold: 60, maxLevel: 5 },
  { id: "forge", name: "Forja Mortuária", title: "O ferro aprende a obedecer", description: "O calor escuro fortalece placas, lâminas e focos arrancados de campos esquecidos.", benefit: "+3% dano físico, ritual e de servos por nível.", art: assets.blackSalt, baseGold: 70, maxLevel: 5 },
  { id: "altar", name: "Altar das Almas", title: "Toda perda tem um preço", description: "Correntes de âmbar unem fragmentos de almas partidas ao nome que se recusou a desaparecer.", benefit: "Ressurreições custam 1 Fragmento a menos e retornam mais fortes por nível.", art: assets.boss, baseGold: 65, baseSouls: 1, maxLevel: 5 },
  { id: "library", name: "Biblioteca dos Mortos", title: "Conhecimento não apodrece", description: "Mapas de pele, selos rasurados e relatos de sobreviventes classificam o que espreita além da névoa.", benefit: "+4 XP por inimigo derrotado por nível.", art: assets.mapDarkwood, baseGold: 50, maxLevel: 5 },
  { id: "garden", name: "Jardim Profano", title: "A terra devolve o que toma", description: "Raízes pálidas bebem os restos da estrada e florescem em ouro de sepultura.", benefit: "+8 ouro por inimigo derrotado por nível.", art: assets.thornGarden, baseGold: 45, maxLevel: 5 },
];

export const equipmentCatalog: EquipmentItem[] = [
  { id: "rusted-blade", name: "Lâmina Enferrujada", slot: "weapon", rarity: "common", source: "Marga", description: "Uma lâmina de estrada que ainda conhece o peso da carne.", effectText: "+7% dano físico.", effect: { physicalDamagePct: 7 }, art: assets.mapAshen },
  { id: "reaper-scythe", name: "Foice do Carrasco", slot: "weapon", rarity: "epic", source: "Estrada Morta", description: "A borda da foice procura gargantas que já desistiram.", effectText: "Executa inimigos abaixo de 20% de vida.", effect: { executeThreshold: 20, physicalDamagePct: 12 }, art: assets.boss },
  { id: "ash-shroud", name: "Manto de Cinza", slot: "armor", rarity: "uncommon", source: "Verge de Cinza", description: "Camadas de cinza fria seguram a primeira lâmina do dia.", effectText: "+18 vitalidade máxima.", effect: { maxHp: 18 }, art: assets.mapAshen },
  { id: "drowned-plate", name: "Cota do Afogado", slot: "armor", rarity: "rare", source: "Cripta das Marés", description: "Uma couraça que devolve a maré ao oceano, nunca ao portador.", effectText: "+28 vitalidade máxima · +8 guarda da legião.", effect: { maxHp: 28, servantGuard: 8 }, art: assets.tideCrypt },
  { id: "guardian-seal", name: "Selo do Guardião", slot: "relic", rarity: "uncommon", source: "Ossuário", description: "O metal guarda a memória de uma formação que nunca recuava.", effectText: "+8 ruptura de postura.", effect: { postureDamage: 8 }, art: assets.boss },
  { id: "dead-king-crown", name: "Coroa do Rei Morto", slot: "relic", rarity: "legendary", source: "Cidadela do Sal Negro", description: "A coroa exige que todo morto reconheça uma única vontade.", effectText: "+20% dano dos servos.", effect: { servantDamagePct: 20 }, art: assets.blackSalt },
  { id: "amber-ring", name: "Anel de Âmbar", slot: "amulet", rarity: "common", source: "Vila de Marga", description: "Um fragmento de luz selado para viagens que nunca terminam.", effectText: "+8 mana máxima.", effect: { maxMana: 8 }, art: assets.mapAshen },
  { id: "pilgrim-ring", name: "Anel do Peregrino", slot: "amulet", rarity: "rare", source: "Evento de estrada", description: "A pedra lembra os nomes de quem foi deixado à beira da rota.", effectText: "+18% de cura recebida.", effect: { healingPct: 18 }, art: assets.mapDarkwood },
  { id: "amber-focus", name: "Foco de Âmbar", slot: "grimoire", rarity: "uncommon", source: "Voto de Sal", description: "Páginas amarradas em resina recitam o preço correto de cada rito.", effectText: "Ritos custam 2 mana a menos.", effect: { manaCostReduction: 2 }, art: assets.mapAshen },
  { id: "last-soul-grimoire", name: "Grimório da Última Alma", slot: "grimoire", rarity: "epic", source: "Observatório do Eclipse", description: "Toda morte anotada nas margens devolve uma sílaba de poder.", effectText: "Quando um servo cai, recupera 10% da mana máxima.", effect: { manaOnServantFallPct: 10, ritualDamagePct: 10 }, art: assets.eclipse },
  { id: "bone-needle", name: "Agulha do Ossuário", slot: "artifact", rarity: "uncommon", source: "Cripta Antiga", description: "Uma agulha de osso prende a alma à formação por mais um compasso.", effectText: "+5 guarda da legião.", effect: { servantGuard: 5 }, art: assets.boss },
  { id: "salt-phylactery", name: "Filactério de Sal Negro", slot: "artifact", rarity: "legendary", source: "Hierofante do Sal Negro", description: "Um coração mineral que conta cada vitória sem oferecer perdão.", effectText: "+1 Fragmento de Alma ao derrotar chefes.", effect: { soulFragmentsOnBoss: 1, maxMana: 16 }, art: assets.blackSalt },
  { id: "veiled-moon-reliquary", name: "Relicário da Lua Velada", slot: "relic", rarity: "epic", source: "Culto da Lua Velada", description: "Uma caixa de prata fria que amplia ritos enquanto escuta quem a entregou.", effectText: "+10% dano ritual · +12 mana máxima.", effect: { ritualDamagePct: 10, maxMana: 12 }, art: assets.eclipse },
  { id: "echo-warden-seal", name: "Selo do Guardião Repetido", slot: "relic", rarity: "epic", source: "Novo Ciclo · Guardião do Ossuário", description: "O selo retorna ao osso com uma rachadura a mais para cada mundo vencido.", effectText: "+16 ruptura de postura · +8% dano físico.", effect: { postureDamage: 16, physicalDamagePct: 8 }, art: assets.boss },
  { id: "tide-hourglass", name: "Ampulheta da Maré Morta", slot: "artifact", rarity: "epic", source: "Novo Ciclo · Arauto da Maré", description: "Grãos escuros sobem quando o sino submerso toca pela segunda vez.", effectText: "+20 mana máxima · +8% dano ritual.", effect: { maxMana: 20, ritualDamagePct: 8 }, art: assets.tideCrypt },
  { id: "thorn-margin", name: "Margem de Espinho Vivo", slot: "grimoire", rarity: "legendary", source: "Novo Ciclo · Matriarca da Rosa Negra", description: "A página cresce raízes ao redor de toda palavra que promete sangue.", effectText: "+14% dano ritual · +14% cura recebida.", effect: { ritualDamagePct: 14, healingPct: 14 }, art: assets.thornGarden },
  { id: "eclipse-splinter", name: "Estilhaço do Eclipse Duplo", slot: "amulet", rarity: "legendary", source: "Novo Ciclo · Astrônomo Faminto", description: "Uma estrela partida que escurece a palma antes de responder ao rito.", effectText: "+26 mana máxima · ritos custam 1 mana a menos.", effect: { maxMana: 26, manaCostReduction: 1 }, art: assets.eclipse },
  { id: "iron-soul-chain", name: "Corrente de Ferro-Alma", slot: "armor", rarity: "legendary", source: "Novo Ciclo · Hierofante do Sal Negro", description: "Cada elo carrega um nome que recusou a segunda morte.", effectText: "+34 vitalidade máxima · +16 guarda da legião.", effect: { maxHp: 34, servantGuard: 16 }, art: assets.blackSalt },
];

export const cycleBossRelicDrops: Record<string, string> = {
  warden: "echo-warden-seal", "tide-herald": "tide-hourglass", "rose-matriarch": "thorn-margin", "starved-astronomer": "eclipse-splinter", "black-salt-hierophant": "iron-soul-chain",
};

export const regions: Region[] = [
  { id: "ashen", name: "Verge de Cinza", kicker: "REGIÃO I · LIMIAR", description: "Uma fronteira de hortas queimadas, aldeias pequenas e sepulturas que ainda guardam nome.", level: "Nv. 1–3", tone: "warm", weather: "Luz de fim de tarde", unlockAt: 1, landmark: "Vila de Marga", coordinates: "47° 19′ N", art: assets.mapAshen, encounterIds: ["ashen-patrol", "ashen-silence", "ashen-ossuary"] },
  { id: "darkwood", name: "Bosque Velado", kicker: "REGIÃO II · FLORESTA", description: "Árvores torcidas fecham o céu. Algo antigo observa entre a névoa verde.", level: "Nv. 3–6", tone: "forest", weather: "Névoa baixa", unlockAt: 2, landmark: "Santuário Raiz-Negra", coordinates: "49° 02′ N", art: assets.mapDarkwood, encounterIds: ["darkwood-ambush", "darkwood-heart"] },
  { id: "deadlands", name: "Terras Mortas", kicker: "REGIÃO III · OSSUÁRIO", description: "Um país de túmulos, pedra cinzenta e estruturas que se recusam a cair.", level: "Nv. 6–9", tone: "dead", weather: "Cinza suspensa", unlockAt: 4, landmark: "Torre do Sino Oco", coordinates: "43° 11′ N", art: assets.mapDeadlands, encounterIds: ["deadlands-ritual"] },
  { id: "swamp", name: "Pântano de Vey", kicker: "REGIÃO IV · MANGUE", description: "Água escura, lama e uma névoa doce demais para ser natural.", level: "Nv. 9–13", tone: "swamp", weather: "Chuva venenosa", unlockAt: 6, landmark: "Cais dos Enforcados", coordinates: "41° 26′ N", art: assets.mapSwamp, encounterIds: ["swamp-drowned"] },
  { id: "mountain", name: "Dorsal de Sal", kicker: "REGIÃO V · ALTA MONTANHA", description: "Penhascos nevados e fortalezas talhadas em uma cordilheira sem trilhas fáceis.", level: "Nv. 13–18", tone: "mountain", weather: "Vento de neve", unlockAt: 9, landmark: "Mosteiro da Última Vigília", coordinates: "52° 08′ N", art: assets.mapMountain, encounterIds: ["mountain-crossing"] },
  { id: "dragon", name: "Território Dracônico", kicker: "REGIÃO VI · CALDEIRA", description: "Ruínas massivas, lava e um céu escuro que parece ferver por dentro.", level: "Nv. 18–24", tone: "dragon", weather: "Cinza vulcânica", unlockAt: 13, landmark: "Catedral Incandescente", coordinates: "38° 04′ N", art: assets.tideCrypt, encounterIds: ["dragon-embers"] },
  { id: "titan", name: "Trono dos Titãs", kicker: "REGIÃO VII · COLOSSO", description: "Estátuas maiores que montanhas fazem o necromante parecer apenas mais um osso no mundo.", level: "Nv. 24+", tone: "titan", weather: "Silêncio de pedra", unlockAt: 18, landmark: "Portão do Primeiro Gigante", coordinates: "61° 31′ N", art: assets.blackSalt, encounterIds: ["titan-gate"] },
  { id: "tideCrypt", name: "Cripta das Marés", kicker: "REGIÃO VIII · COSTA SUBMERSA", description: "Catacumbas inundadas sob uma abadia sem teto. Sinos submersos ainda chamam os mortos pelo nome.", level: "Nv. 3–7", tone: "tide", weather: "Maré sem lua", unlockAt: 3, landmark: "Abadia Afogada", coordinates: "35° 48′ N", art: assets.tideCrypt, encounterIds: ["tide-crypt-drowned", "tide-crypt-herald"] },
  { id: "thornGarden", name: "Jardim de Espinhos", kicker: "REGIÃO IX · ESTUFA FÚNEBRE", description: "Raízes bebem sangue sob vidros quebrados. Cada rosa guarda o nome de alguém que não voltou.", level: "Nv. 5–9", tone: "thorn", weather: "Pólen vermelho", unlockAt: 5, landmark: "Estufa da Rosa Negra", coordinates: "44° 33′ N", art: assets.thornGarden, encounterIds: ["thorn-garden-pact", "thorn-garden-matriarch"] },
  { id: "eclipse", name: "Observatório do Eclipse", kicker: "REGIÃO X · TORRE ASTRAL", description: "Uma torre partida onde as sombras chegam antes dos corpos e as estrelas perderam o lugar no mapa.", level: "Nv. 8–13", tone: "eclipse", weather: "Céu sem lua", unlockAt: 8, landmark: "Círculo de Orbes", coordinates: "57° 12′ N", art: assets.eclipse, encounterIds: ["eclipse-shadows", "eclipse-astronomer"] },
  { id: "blackSalt", name: "Cidadela do Sal Negro", kicker: "REGIÃO XI · CITADELA", description: "Uma fortaleza talhada em sal mineral negro, guardada por uma ordem que aprendeu a necromancia sem pedir licença.", level: "Nv. 12–18", tone: "salt", weather: "Tempestade de cinza", unlockAt: 12, landmark: "Portão dos Nove Selos", coordinates: "29° 40′ N", art: assets.blackSalt, encounterIds: ["salt-gates", "salt-hierophant"] },
];

export const regionalCycles: Record<RegionId, RegionCycle> = {
  ashen: {
    title: "Cinza de Vigília", identity: "A estrada se abre e fecha conforme as brasas revelam marcas antigas.", preparation: "Leve fogo para expor as marcas de cinza e interromper as patrulhas antes que a vigília endureça.", exploration: "Durante a brasa baixa, rastros e pequenas passagens ficam legíveis no terreno.",
    phases: [
      { id: "embers", name: "Brasa Baixa", duration: 2, detail: "Os rastros de cinza revelam brechas na estrada e expõem ameaças veladas.", counterplay: "Use a abertura para identificar o inimigo e pressionar primeiro.", revealEnemies: true },
      { id: "watch", name: "Vigília Ardente", duration: 2, detail: "A patrulha se fecha; as lâminas inimigas ganham peso na luz das brasas.", counterplay: "Bloqueie ou quebre a postura antes da próxima ronda.", enemyDamageMultiplier: 1.12 },
    ],
  },
  darkwood: {
    title: "Pulso da Raiz-Negra", identity: "Raízes tomam a arena aos poucos, transformando golpes apressados em risco.", preparation: "Traga fogo ou gelo para conter a seiva; golpes físicos ficam mais caros quando a mata fecha.", exploration: "A seiva adormecida mostra atalhos, mas a mata em flor cobra sangue de quem a atravessa.",
    phases: [
      { id: "rooting", name: "Raízes Rasteiras", duration: 2, detail: "Espinhos baixos punem apenas golpes físicos diretos.", counterplay: "Prefira ritos à distância enquanto o bosque cria terreno.", thornDamage: 5 },
      { id: "entangled", name: "Trilha Enredada", duration: 2, detail: "Os espinhos ocupam a arena e a retaliação de seiva aumenta.", counterplay: "Use fogo, gelo e ruptura de postura para abrir caminho.", thornDamage: 10 },
      { id: "bloom", name: "Flor de Sangue", duration: 1, detail: "Toda raiz floresce de uma vez e os inimigos entram em fúria breve.", counterplay: "Defenda a formação ou encerre o alvo antes do próximo pulso.", thornDamage: 14, enemyDamageMultiplier: 1.18 },
    ],
  },
  deadlands: {
    title: "Eco do Sino Oco", identity: "O silêncio mineral alterna entre revelar cadáveres e endurecer suas defesas.", preparation: "Ritos sagrados interrompem o eco; reserve postura para a hora em que a pedra responder.", exploration: "Quando o sino silencia, inscrições funerárias apontam túmulos ocultos.",
    phases: [
      { id: "silence", name: "Silêncio Mineral", duration: 2, detail: "Os túmulos perdem o véu e a formação pode ler marcas escondidas.", counterplay: "Revele ameaças e prepare combinações antes do sino voltar.", revealEnemies: true },
      { id: "resonance", name: "Ressonância Oca", duration: 2, detail: "O eco protege os mortos e fortalece seus ataques espectrais.", counterplay: "Quebre a postura e evite guardar mana por tempo demais.", enemyDamageMultiplier: 1.14, postureBonus: 8 },
    ],
  },
  swamp: {
    title: "Água que Recorda", identity: "O pântano gira entre vazante, cheia e uma maré negra que se recusa a manter os mortos no fundo.", preparation: "Fogo e sagrado encerram a ameaça rapidamente; guarde ruptura para a Maré Negra.", exploration: "Na vazante, ilhas de ossos e passagens submersas ficam acessíveis.",
    phases: [
      { id: "low", name: "Vazante de Ossos", duration: 2, detail: "A água baixa revela passagens e retira o véu de ameaças ocultas.", counterplay: "Aproveite a leitura de campo para escolher o próximo rito.", revealEnemies: true },
      { id: "high", name: "Maré Alta", duration: 2, detail: "A água fortalece criaturas aquáticas e suas investidas ganham força.", counterplay: "Controle a postura e prepare defesa para a formação.", enemyDamageMultiplier: 1.22 },
      { id: "black", name: "Maré Negra", duration: 1, detail: "Cadáveres recém-caídos tentam retornar com uma fração da vida.", counterplay: "Finalize alvos quando a maré recuar ou mantenha mana para uma segunda morte.", raiseDead: true },
    ],
  },
  mountain: {
    title: "Vento da Última Vigília", identity: "Rajadas alternam visibilidade e pressão, fazendo cada abertura durar pouco.", preparation: "Ritos de gelo e quebra de postura seguram os inimigos quando o vento fecha a passagem.", exploration: "Na calmaria, degraus de sal e trilhas antigas se revelam entre as rochas.",
    phases: [
      { id: "calm", name: "Calmaria de Sal", duration: 2, detail: "O vento cai e as silhuetas escondidas perdem o contorno falso.", counterplay: "Use a janela para revelar e preparar o alvo prioritário.", revealEnemies: true },
      { id: "gale", name: "Rajada da Vigília", duration: 2, detail: "A pressão da montanha amplia a ofensiva inimiga e sustenta suas posturas.", counterplay: "Quebre postura e bloqueie até a calmaria retornar.", enemyDamageMultiplier: 1.16, postureBonus: 10 },
    ],
  },
  dragon: {
    title: "Respiração da Caldeira", identity: "A fornalha passa de brasas controladas a uma erupção que favorece todo fogo lançado na arena.", preparation: "Leve dano de fogo para a erupção e reserve cura para a chuva de cinzas.", exploration: "Nas brasas baixas, fissuras iluminadas indicam câmaras e rotas sob a catedral.",
    phases: [
      { id: "cinders", name: "Brasas Baixas", duration: 2, detail: "Fissuras iluminam os corredores e mantêm as ameaças expostas.", counterplay: "Leia a arena e ajuste a formação antes da erupção.", revealEnemies: true },
      { id: "eruption", name: "Erupção Interna", duration: 2, detail: "O fogo recebe dano ampliado, mas a arena devolve mais violência.", counterplay: "Converta a janela em dano de fogo e não prolongue a troca.", damageType: "fire", damageMultiplier: 1.35, enemyDamageMultiplier: 1.14 },
    ],
  },
  titan: {
    title: "Passada Colossal", identity: "O ritmo de pedra alterna uma janela de ruptura e uma guarda impossível de atravessar sem coordenação.", preparation: "Traga habilidades de quebra para a passada exposta e defesas para o peso do colosso.", exploration: "Entre passos, rachaduras no solo revelam inscrições e depósitos soterrados.",
    phases: [
      { id: "exposed", name: "Passada Exposta", duration: 1, detail: "A pedra se desloca e a postura inimiga recebe pressão adicional.", counterplay: "Use ritos de ruptura e comandos de guarda para derrubar a ameaça.", postureBonus: 18 },
      { id: "brace", name: "Peso do Trono", duration: 2, detail: "A arena endurece e os golpes inimigos chegam como pedras de muralha.", counterplay: "Defenda e espere a próxima passada exposta.", enemyDamageMultiplier: 1.2 },
    ],
  },
  tideCrypt: {
    title: "Sinos Sob a Maré", identity: "A cripta acompanha uma maré litúrgica: vazante revela, cheia fortalece os afogados e a água negra devolve cadáveres.", preparation: "Fogo e sagrado são essenciais; mantenha uma segunda sequência de dano para a água negra.", exploration: "Na vazante, capelas laterais e nomes riscados emergem do piso inundado.",
    phases: [
      { id: "low", name: "Maré Baixa", duration: 2, detail: "Capelas afogadas e alvos velados ficam expostos entre os sinos.", counterplay: "Leia as afinidades e decida qual ameaça deve cair primeiro.", revealEnemies: true },
      { id: "high", name: "Maré Alta", duration: 2, detail: "A água eleva a força dos afogados e de seus golpes de gelo.", counterplay: "Interrompa telegráficos e preserve defesa para a formação.", enemyDamageMultiplier: 1.24 },
      { id: "black", name: "Maré Negra", duration: 1, detail: "Os mortos caídos respondem ao sino e voltam uma vez com pouca vida.", counterplay: "Evite mortes durante o pulso ou guarde mana para finalizar de novo.", raiseDead: true },
    ],
  },
  thornGarden: {
    title: "Crescimento da Rosa Morta", identity: "A estufa passa de raízes baixas a uma flor de sangue que ocupa a arena e amplifica retaliações.", preparation: "Fogo contém a roseira; gelo e ruptura abrem espaço antes do florescimento.", exploration: "Com a seiva baixa, canteiros rasgados revelam sementes raras e caminhos entre as estufas.",
    phases: [
      { id: "sprout", name: "Espinho Rasteiro", duration: 2, detail: "A arena começa a ser tomada, punindo golpes físicos precipitados.", counterplay: "Use ritos e deixe o fogo abrir terreno.", thornDamage: 6 },
      { id: "overgrowth", name: "Estufa Fechada", duration: 2, detail: "Espinhos ocupam a linha de combate e a retaliação aumenta.", counterplay: "Quebre a postura ou troque para dano elemental.", thornDamage: 12 },
      { id: "bloodrose", name: "Rosa de Sangue", duration: 1, detail: "A flor abre e transforma toda a arena em ameaça agressiva.", counterplay: "Defenda, congele ou encerre a ameaça antes da próxima rodada.", thornDamage: 16, enemyDamageMultiplier: 1.18 },
    ],
  },
  eclipse: {
    title: "Ciclo do Eclipse", identity: "O observatório alterna luz morta, penumbra e eclipse total; cada fase muda a magia que pode sustentar Veyra.", preparation: "Leve ritos sombrios para o eclipse, mas não dependa de cura durante a escuridão total.", exploration: "Na luz morta, constelações apagadas e passagens ocultas reaparecem no mapa.",
    phases: [
      { id: "pale", name: "Luz Morta", duration: 2, detail: "As estrelas reaparecem por um instante e as sombras escondidas perdem o véu.", counterplay: "Revele alvos e prepare recursos para a próxima fase.", revealEnemies: true },
      { id: "penumbra", name: "Penumbra", duration: 2, detail: "A noite adensa os ritos de ambos os lados e os inimigos ganham pressão moderada.", counterplay: "Use afinidades e não permita que o alvo canalize.", enemyDamageMultiplier: 1.12 },
      { id: "total", name: "Eclipse Total", duration: 1, detail: "Magia sombria causa +50% dano, cura pela metade e ameaças astrais entram em fúria.", counterplay: "Exploda dano sombrio, mas preserve defesa e não conte com drenagem total.", damageType: "shadow", damageMultiplier: 1.5, enemyDamageMultiplier: 1.2, healingMultiplier: .5 },
    ],
  },
  blackSalt: {
    title: "Édito dos Nove Selos", identity: "Os selos da cidadela alternam entre leitura das runas e uma muralha que arma a ordem rival.", preparation: "Fogo e veneno quebram a ordem; entre com ruptura de postura pronta para a Sentença Salina.", exploration: "Quando os selos se abrem, corredores de contrabando e anotações proibidas podem ser rastreados.",
    phases: [
      { id: "unsealed", name: "Selo Aberto", duration: 2, detail: "Runas expostas revelam inimigos e permitem ler a estrutura da defesa rival.", counterplay: "Marque o alvo prioritário e use a janela para aplicar estados.", revealEnemies: true },
      { id: "sentence", name: "Sentença Salina", duration: 2, detail: "A cidadela fecha seus nove selos: ataques inimigos e postura ficam mais pesados.", counterplay: "Desmonte os elites e preserve guarda até os selos abrirem de novo.", enemyDamageMultiplier: 1.18, postureBonus: 12 },
    ],
  },
};

export const enemyCatalog: Enemy[] = [
  { id: "marauder", name: "Saqueador de Marga", kind: "Humano", level: 1, hp: 65, maxHp: 65, atk: 7, xp: 34, loot: "Lâmina enferrujada", variant: "scarred", trait: "Golpe oportunista", art: assets.mapAshen, damageType: "physical", weaknesses: ["fire"], resistances: ["shadow"], statusOnHit: "bleed", posture: "neutral", postureHp: 18, maxPosture: 18 },
  { id: "wisp", name: "Lamento de Turfa", kind: "Espectro", level: 1, hp: 47, maxHp: 47, atk: 9, xp: 42, loot: "Pó de alma", variant: "wisp", trait: "Dano espectral", art: assets.tideCrypt, damageType: "shadow", weaknesses: ["holy", "ice"], resistances: ["shadow", "physical"], statusOnHit: "curse", posture: "neutral", postureHp: 16, maxPosture: 16 },
  { id: "warden", name: "Guardião do Ossuário", kind: "Morto-vivo", level: 3, hp: 126, maxHp: 126, atk: 15, xp: 110, loot: "Selo do Guardião", variant: "boss", trait: "Armadura de sino", art: assets.boss, boss: true, damageType: "physical", weaknesses: ["fire", "holy"], resistances: ["physical", "shadow"], statusOnHit: "stun", posture: "guarded", postureHp: 32, maxPosture: 32, ability: { id: "ossuary-bell", name: "Toque do Ossuário", description: "O sino do peito quebra a guarda de um inimigo e protege a formação.", cost: 10, damage: 16, effect: "+8% guarda por 2 rodadas", kind: "break", damageType: "physical", appliesStatus: "stun", statusTurns: 1 } },
  { id: "thorn-hound", name: "Cão de Raiz-Negra", kind: "Fera vegetal", level: 3, hp: 98, maxHp: 98, atk: 15, xp: 58, loot: "Semente de espinho", variant: "thorn", trait: "Retaliação de seiva", art: assets.thornGarden, damageType: "poison", weaknesses: ["fire"], resistances: ["poison"], statusOnHit: "bleed", posture: "enraged", postureHp: 26, maxPosture: 26 },
  { id: "briar-sentinel", name: "Sentinela do Espinheiro", kind: "Guardião", level: 4, hp: 132, maxHp: 132, atk: 18, xp: 72, loot: "Placa de casca", variant: "thorn", trait: "Elite · espinhos", art: assets.thornGarden, elite: true, damageType: "poison", weaknesses: ["fire", "ice"], resistances: ["poison", "physical"], statusOnHit: "curse", posture: "guarded", postureHp: 48, maxPosture: 48 },
  { id: "bell-revenant", name: "Revenante do Sino", kind: "Morto-vivo", level: 5, hp: 144, maxHp: 144, atk: 20, xp: 86, loot: "Badalo de prata", variant: "bell", trait: "Eco paralisante", art: assets.mapDeadlands, elite: true, damageType: "shadow", weaknesses: ["holy"], resistances: ["shadow", "ice"], statusOnHit: "stun", posture: "guarded", postureHp: 46, maxPosture: 46 },
  { id: "drowned-acolyte", name: "Acólito Afogado", kind: "Espectro", level: 3, hp: 112, maxHp: 112, atk: 17, xp: 62, loot: "Rosário encharcado", variant: "wisp", trait: "Retorno da maré", art: assets.tideCrypt, damageType: "poison", weaknesses: ["holy", "fire"], resistances: ["poison", "ice"], statusOnHit: "corruption", posture: "neutral", postureHp: 32, maxPosture: 32 },
  { id: "tide-herald", name: "Arauto da Maré", kind: "Chefe · Espectro", level: 6, hp: 226, maxHp: 226, atk: 26, xp: 142, loot: "Coração de maré", variant: "boss", trait: "Retorno da maré", art: assets.tideCrypt, boss: true, damageType: "ice", weaknesses: ["fire", "holy"], resistances: ["ice", "shadow"], statusOnHit: "freeze", posture: "guarded", postureHp: 72, maxPosture: 72, telegraph: { id: "abyssal-deluge", name: "Dilúvio Abissal", description: "Quebre a postura do Arauto antes que a cripta inteira seja inundada.", turnsLeft: 2, postureToBreak: 38, damage: 54, servantDamage: 14, damageType: "ice", applies: "corruption" }, ability: { id: "tide-pulse", name: "Pulso da Maré", description: "A maré envolve o exército e devolve vitalidade enquanto fere o alvo.", cost: 12, damage: 22, heal: 18, effect: "+18 cura para Veyra", kind: "support", damageType: "ice", appliesStatus: "freeze", statusTurns: 1 } },
  { id: "rose-matriarch", name: "Matriarca da Rosa Negra", kind: "Chefe · Flora", level: 7, hp: 248, maxHp: 248, atk: 28, xp: 158, loot: "Corola de espinhos", variant: "rose", trait: "Pacto de sangue", art: assets.thornGarden, boss: true, damageType: "poison", weaknesses: ["fire", "ice"], resistances: ["poison", "shadow"], statusOnHit: "bleed", posture: "enraged", postureHp: 64, maxPosture: 64, telegraph: { id: "blood-bloom", name: "Florescer de Sangue", description: "As raízes bebem da arena. Quebre a postura ou a Matriarca floresce sobre a formação.", turnsLeft: 2, postureToBreak: 34, damage: 44, servantDamage: 10, damageType: "poison", applies: "bleed" }, ability: { id: "black-rose-crown", name: "Coroa de Espinhos", description: "Uma coroa de raízes marca o alvo e transforma a guarda dos servos em retaliação.", cost: 14, damage: 30, effect: "+10 dano de formação por 2 rodadas", kind: "assault", damageType: "poison", appliesStatus: "bleed", statusTurns: 2 } },
  { id: "eclipse-shade", name: "Sombra de Perigeu", kind: "Sombra", level: 8, hp: 174, maxHp: 174, atk: 24, xp: 118, loot: "Lente eclipsada", variant: "eclipse", trait: "Oculto até a magia", art: assets.eclipse, elite: true, damageType: "shadow", weaknesses: ["holy", "fire"], resistances: ["shadow", "ice"], statusOnHit: "fear", posture: "neutral", postureHp: 54, maxPosture: 54 },
  { id: "starved-astronomer", name: "Astrônomo Faminto", kind: "Chefe · Erudito", level: 9, hp: 272, maxHp: 272, atk: 31, xp: 182, loot: "Mapa sem estrelas", variant: "boss", trait: "Oculto até a magia", art: assets.eclipse, boss: true, damageType: "shadow", weaknesses: ["holy", "fire"], resistances: ["shadow"], statusOnHit: "curse", posture: "channeling", postureHp: 70, maxPosture: 70, telegraph: { id: "eclipse-hunger", name: "Fome do Eclipse", description: "O observatório apaga suas estrelas. Rompa a canalização antes que a noite cobre mana e coragem.", turnsLeft: 2, postureToBreak: 40, damage: 50, damageType: "shadow", applies: "fear" }, ability: { id: "perigee-chart", name: "Mapa sem Estrelas", description: "O mapa abre o eclipse e revela a ameaça, aumentando o dano mágico da formação.", cost: 16, damage: 26, effect: "revela alvos e +6 dano mágico", kind: "reveal", damageType: "shadow", appliesStatus: "fear", statusTurns: 1 } },
  { id: "salt-knight-1", name: "Cavaleiro do Sal Negro", kind: "Ordem rival", level: 12, hp: 208, maxHp: 208, atk: 29, xp: 148, loot: "Lança salina", variant: "salt", trait: "Selo protetor", art: assets.blackSalt, elite: true, damageType: "physical", weaknesses: ["fire", "poison"], resistances: ["physical", "holy"], statusOnHit: "curse", posture: "guarded", postureHp: 62, maxPosture: 62 },
  { id: "salt-knight-2", name: "Cavaleiro do Sal Negro II", kind: "Ordem rival", level: 12, hp: 208, maxHp: 208, atk: 29, xp: 148, loot: "Lança salina", variant: "salt", trait: "Selo protetor", art: assets.blackSalt, elite: true, damageType: "physical", weaknesses: ["fire", "poison"], resistances: ["physical", "holy"], statusOnHit: "curse", posture: "guarded", postureHp: 62, maxPosture: 62 },
  { id: "black-salt-hierophant", name: "Hierofante do Sal Negro", kind: "Chefe · Necromante", level: 14, hp: 344, maxHp: 344, atk: 36, xp: 240, loot: "Selo negro", variant: "boss", trait: "Selo protetor", art: assets.blackSalt, boss: true, damageType: "shadow", weaknesses: ["fire", "holy"], resistances: ["poison", "shadow"], statusOnHit: "curse", posture: "guarded", postureHp: 82, maxPosture: 82, telegraph: { id: "salt-edict", name: "Édito da Muralha", description: "O sal se fecha em torno da arena. Quebre o selo antes que a sentença se espalhe pela formação.", turnsLeft: 2, postureToBreak: 46, damage: 62, servantDamage: 18, damageType: "shadow", applies: "curse" }, ability: { id: "black-edict", name: "Édito do Sal Negro", description: "O selo drena energia do alvo e devolve parte dela à formação.", cost: 18, damage: 38, heal: 12, effect: "quebra proteção e +12 cura", kind: "break", damageType: "shadow", appliesStatus: "curse", statusTurns: 2 } },
];

export const enemyBestiary: Record<string, BestiaryDossier> = {
  marauder: { lore: "Cobradores de Marga que trocaram juramentos por pedágio; a morte não os libertou da estrada.", behavior: "Protege parceiros frágeis e ataca após a investida da formação.", strategy: "Use fogo, rompa a postura quando avançar e finalize antes que pressione espectros aliados.", animation: "Testa a lâmina enferrujada, arrasta um pé e dispara em um arco curto." },
  wisp: { lore: "O último suspiro de quem morreu sem nome nas águas rasas de Turfa.", behavior: "Flutua atrás da frente, alimenta maldições e evita a linha física.", strategy: "Sagrado e gelo atravessam sua névoa. Evite dano físico isolado e remova maldições cedo.", animation: "Névoa azul se comprime num rosto e se desfaz em um grito mudo." },
  warden: { lore: "Carregava um sino para anunciar mortos de Marga; agora guarda os dois lados da vala.", behavior: "Ergue cadáveres como escudo e prepara um toque que atordoa a linha.", strategy: "Queime mortalhas, use fogo ou sagrado e rompa a postura durante o telegráfico.", animation: "O sino no peito vibra e mortalhas próximas se inclinam para a mesma nota." },
  "thorn-hound": { lore: "Cães enterrados nas raízes do Jardim e devolvidos à fome por seiva negra.", behavior: "Avança com fúria e pune golpes físicos com espinhos de retorno.", strategy: "Abrace o fogo, preserve vitalidade contra a retaliação e explore a postura enfurecida.", animation: "Raízes estalam pelas patas antes de uma mordida baixa." },
  "briar-sentinel": { lore: "Placas de casca sustentam os votos abandonados de guardiões plantados no Jardim.", behavior: "Sela corredores, permanece protegida e converte espinhos em maldição.", strategy: "Fogo e gelo racham a casca. Rompa a postura antes de gastar ritos caros.", animation: "A casca abre como armadura viva e galhos se fixam no solo para firmar a guarda." },
  "bell-revenant": { lore: "Sineiros enterrados com badalos de prata na garganta para silenciar suas preces finais.", behavior: "Sustenta a defesa inimiga e busca atordoar o alvo mais exposto.", strategy: "Sagrado remove sua vantagem; quebre a guarda e preserve uma defesa contra o eco.", animation: "A mandíbula se abre sem voz; o ar ondula e um badalo invisível responde." },
  "drowned-acolyte": { lore: "Acólitos da Cripta que foram preenchidos por água negra em vez de ar.", behavior: "Espalha corrupção e retorna quando o ciclo de maré favorece os mortos.", strategy: "Fogo ou sagrado drenam seu pacto. Finalize na maré baixa e vigie a maré negra.", animation: "Água escorre das vestes e uma onda curta acompanha cada invocação." },
  "tide-herald": { lore: "Anunciou o afogamento da cidade antes de a própria voz ser tomada pelo abismo.", behavior: "Eleva a água, se protege no altar e canaliza o Dilúvio Abissal.", strategy: "Drene o altar e quebre a postura com fogo ou sagrado antes do segundo turno do Dilúvio.", animation: "O manto ergue uma coluna d'água enquanto o altar pulsa sob seus pés." },
  "rose-matriarch": { lore: "A primeira rosa negra floresceu na ferida de uma rainha; a Matriarca lembra cada jardineiro sacrificado.", behavior: "Cresce raízes, converte sangue derramado em vida e se expõe em fúria.", strategy: "Pode raízes para impedir cura. Fogo e gelo vencem a flora; ataque na fúria.", animation: "Pétalas negras se fecham como uma pupila e raízes varrem o piso." },
  "eclipse-shade": { lore: "A marca de quem olhou para o eclipse até esquecer o próprio rosto.", behavior: "Permanece oculta até magia ou revelação e espalha medo ao redor.", strategy: "Abra com fogo ou sagrado. Não desperdice golpe físico sem um contorno revelado.", animation: "A forma se comprime contra o céu e reaparece em outra borda da visão." },
  "starved-astronomer": { lore: "Mapeou o céu para salvar a corte e, quando as estrelas sumiram, passou a devorar nomes.", behavior: "Canaliza constelações e usa o eclipse para roubar cura, coragem e mana.", strategy: "Sagrado e fogo quebram a carta celeste. Rasgue a constelação e interrompa a Fome do Eclipse.", animation: "Mapas orbitam o corpo; constelações escorrem como tinta sobre seus dedos." },
  "salt-knight-1": { lore: "Jurou impedir cadáveres de atravessar a fronteira; a ordem apodreceu, mas o édito ficou.", behavior: "Forma muralha com seus pares e sela a própria defesa sob pressão.", strategy: "Fogo e veneno corroem o selo. Isole a escolta e rompa a postura protegida.", animation: "A lança risca sal no chão e cristais sobem pela greva." },
  "salt-knight-2": { lore: "Sua armadura contém a cinza de uma casa inteira, preservada pela mesma sentença do primeiro cavaleiro.", behavior: "Fortalece o selo quando o parceiro está sob pressão e mantém a formação rival fechada.", strategy: "Isole um cavaleiro, aplique fogo ou veneno e não divida dano contra a muralha completa.", animation: "O escudo se inclina para o aliado e grãos de sal escorrem das juntas." },
  "black-salt-hierophant": { lore: "Escreveu a lei que proibiu a morte de descansar. Sua voz agora existe dentro de nove selos.", behavior: "Cultiva cristais, reduz dano e prepara uma sentença que amaldiçoa toda a formação.", strategy: "Pulverize cristais, use fogo ou sagrado e derrube a postura quando o último selo cair.", animation: "Cristais orbitam o cajado e rachaduras violetas surgem no piso antes do édito." },
};

export const bossArenas: Record<string, BossArena> = {
  warden: {
    bossId: "warden", title: "Ossuário Desmoronando", seal: "CADÁVERES · SINO · RUÍNA", terrain: "O Guardião desperta esqueletos, desloca a formação e usa cadáveres como muralhas de osso.", objective: "Queime as mortalhas antes que quatro escudos fechem a arena.", counterplay: "Incinerar mortalhas remove escudos e expõe a postura do Guardião.", maxProgress: 4,
    phases: [
      { name: "Cadáveres inquietos", detail: "Um escudo funerário aguarda o sino.", threat: "Chefes recebem menos dano enquanto as mortalhas permanecem." },
      { name: "Linha de ossos", detail: "Esqueletos reorganizam o campo em torno do Guardião.", threat: "A guarda do Guardião cresce e a formação sofre pressão." },
      { name: "Paredes rachadas", detail: "As lápides cedem sobre o círculo de batalha.", threat: "Partes da arena quebram e atingem Veyra." },
      { name: "Sino sem teto", detail: "O último escudo sustenta a vigília.", threat: "Se não for queimado, o Guardião ergue uma muralha total." },
    ], action: { label: "Queimar mortalhas", ritual: "FOGO NOS CAÍDOS", cost: 8, description: "Incendeie os cadáveres-escudo e abra a postura do Guardião." },
  },
  "tide-herald": {
    bossId: "tide-herald", title: "Cripta em Inundação", seal: "NÍVEL D'ÁGUA · FÔLEGO · MARÉ", terrain: "A água sobe pelo altar e reduz o espaço seguro a cada decisão tomada.", objective: "Drene o altar de maré antes que a cripta seja totalmente tomada.", counterplay: "Romper o altar reduz a água e deixa o Arauto vulnerável por uma rodada.", maxProgress: 4,
    phases: [
      { name: "Lâmina rasa", detail: "A água alcança os degraus inferiores.", threat: "Gelo e maré recebem força moderada." },
      { name: "Joelhos submersos", detail: "Servos perdem apoio entre as criptas.", threat: "A formação sofre dano de inundação." },
      { name: "Peito de água", detail: "O altar respira e rouba espaço da arena.", threat: "Ataques do Arauto se tornam mais agressivos." },
      { name: "Dilúvio", detail: "A última pedra seca desaparece sob o negro.", threat: "Todos recebem dano e o Arauto chama a maré de volta." },
    ], action: { label: "Drenar altar", ritual: "PULMÃO DE PEDRA", cost: 10, description: "Quebre o altar submerso para baixar uma marca de maré." },
  },
  "rose-matriarch": {
    bossId: "rose-matriarch", title: "Jardim que se Fecha", seal: "RAÍZES · SANGUE · ALTAR", terrain: "Raízes negras crescem sobre o altar e tomam os caminhos disponíveis a cada rodada.", objective: "Podar os nós de raiz antes que o jardim domine o círculo.", counterplay: "Cortar raízes reduz a retaliação e abre uma janela de postura na Matriarca.", maxProgress: 4,
    phases: [
      { name: "Broto de sangue", detail: "As primeiras raízes procuram os tornozelos de Veyra.", threat: "Golpes físicos sofrem retorno de espinhos." },
      { name: "Círculo fechado", detail: "O jardim ocupa os flancos da formação.", threat: "A pressão da arena aumenta contra servos." },
      { name: "Rosa faminta", detail: "As raízes bebem a vitalidade perdida no chão.", threat: "A Matriarca recupera saúde se as raízes não forem podadas." },
      { name: "Altar dominado", detail: "Espinhos tomam a última rota de fuga.", threat: "O jardim marca Veyra com sangramento e a Matriarca floresce." },
    ], action: { label: "Podar raízes", ritual: "FOICE DE CINZAS", cost: 9, description: "Queime dois nós de raiz e interrompa o domínio do altar." },
  },
  "starved-astronomer": {
    bossId: "starved-astronomer", title: "Cúpula das Constelações", seal: "CÉU · CARTA · PERIGEU", terrain: "O céu do observatório muda a cada rodada; constelações escrevem novos ataques sobre a arena.", objective: "Rasgue a carta celeste para quebrar a leitura do Astrônomo.", counterplay: "Desfigurar a constelação atual remove sua vantagem e torna o chefe vulnerável.", maxProgress: 3, cyclic: true,
    phases: [
      { name: "Coroa Morta", detail: "Uma coroa sem estrelas observa o altar.", threat: "O Astrônomo recebe guarda enquanto canaliza." },
      { name: "Lança Azul", detail: "Um traço frio aponta para a formação.", threat: "Dano sombrio e gelo se tornam mais perigosos." },
      { name: "Olho Vazio", detail: "A constelação devora clarões e cura.", threat: "A recuperação de Veyra é reduzida sob o eclipse." },
    ], action: { label: "Rasgar carta", ritual: "CÉU PROFANADO", cost: 12, description: "Corte a constelação ativa e interrompa sua vantagem ritual." },
  },
  "black-salt-hierophant": {
    bossId: "black-salt-hierophant", title: "Círculo dos Cristais Negros", seal: "CRISTAL · SELO · SENTENÇA", terrain: "Cristais de sal negro nascem do piso e reforçam os selos do Hierofante.", objective: "Destrua os cristais ou canalize seu sal contra o próprio mestre.", counterplay: "Pulverizar reduz a proteção; com o campo limpo, canalizar sal quebra postura e devolve mana.", maxProgress: 4,
    phases: [
      { name: "Dois cristais", detail: "O sal forma os primeiros obeliscos de proteção.", threat: "O Hierofante reduz dano recebido." },
      { name: "Muralha salina", detail: "Os cristais fecham o círculo com uma geometria hostil.", threat: "Ritos custam mais mana enquanto a muralha permanece." },
      { name: "Nove selos", detail: "A fortaleza responde ao nome do Hierofante.", threat: "A arena amplifica maldições e golpes sombrios." },
      { name: "Sentença de sal", detail: "Os cristais estão prontos para explodir em fragmentos.", threat: "A formação sofre dano caso o campo não seja limpo." },
    ], action: { label: "Pulverizar cristal", ritual: "SAL CONTRA SAL", cost: 11, description: "Destrua um cristal; com o último rompido, canalize o resíduo contra a postura do Hierofante." },
  },
};

export const encounters: Encounter[] = [
  { id: "ashen-patrol", regionId: "ashen", name: "Patrulha da Estrada Morta", type: "PATRULHA", kind: "patrol", ruleKey: "standard", description: "Duas silhuetas tentam cobrar pedágio na primeira estrada antes que o ossuário desperte.", rule: "Confronte os alvos na ordem que preferir e experimente as afinidades.", danger: "risco inicial", reward: "+34–42 XP", enemyIds: ["marauder", "wisp"] },
  { id: "ashen-silence", regionId: "ashen", name: "Vigília sem Testemunhas", type: "VIGÍLIA · ESTRADA ALTERADA", kind: "ritual", ruleKey: "veil", description: "Os cobradores de Marga desapareceram. Um lamento e um sino percorrem a estrada vazia procurando quem deixou tantos nomes sem retorno.", rule: "O revenante só se mostra inteiramente após magia; use ritos para rasgar o véu e proteger a formação do eco.", danger: "estrada silenciosa", reward: "+86–128 XP · registro de mundo", enemyIds: ["wisp", "bell-revenant"] },
  { id: "ashen-ossuary", regionId: "ashen", name: "Sino do Ossuário", type: "CHEFE · VIGÍLIA", kind: "boss", ruleKey: "standard", description: "Com a estrada limpa, o Guardião desperta sob as lápides e responde a cada toque do sino enterrado.", rule: "Quebre sua postura protegida e use fogo ou sagrado para abrir uma janela de dano.", danger: "chefe de limiar", reward: "+110 XP · selo do Guardião", enemyIds: ["warden"] },
  { id: "darkwood-ambush", regionId: "darkwood", name: "Emboscada da Raiz", type: "EMBOSCADA", kind: "ambush", ruleKey: "thorns", description: "O bosque fecha a trilha atrás de Veyra. As raízes atacam antes das lâminas.", rule: "Golpes comuns recebem retaliação de seiva do alvo.", danger: "risco elevado", reward: "+58–72 XP", enemyIds: ["thorn-hound", "briar-sentinel"] },
  { id: "darkwood-heart", regionId: "darkwood", name: "Coração do Espinheiro", type: "ELITE", kind: "elite", ruleKey: "thorns", description: "A sentinela protege uma flor que pulsa como um coração enterrado.", rule: "Cada ataque corpo a corpo provoca retorno de espinhos.", danger: "elite", reward: "+72–158 XP", enemyIds: ["briar-sentinel", "rose-matriarch"] },
  { id: "deadlands-ritual", regionId: "deadlands", name: "Ritual do Sino Oco", type: "RITUAL", kind: "ritual", ruleKey: "veil", description: "Um badalo sem metal chama um revenante para dentro da própria sombra.", rule: "O alvo eclipsado só revela sua forma completa após magia.", danger: "ritual instável", reward: "+86–110 XP", enemyIds: ["bell-revenant", "warden"] },
  { id: "swamp-drowned", regionId: "swamp", name: "Procissão Afogada", type: "MARÉ", kind: "elite", ruleKey: "tide", description: "A água devolve os mortos com a paciência de quem nunca esqueceu uma dívida.", rule: "O primeiro inimigo derrotado retorna uma vez com 35% de vida.", danger: "ameaça recorrente", reward: "+62–142 XP", enemyIds: ["drowned-acolyte", "tide-herald"] },
  { id: "mountain-crossing", regionId: "mountain", name: "Passo da Última Vigília", type: "VIGÍLIA", kind: "elite", ruleKey: "veil", description: "O vento apaga os contornos da patrulha, mas não o som das correntes.", rule: "A sombra só perde o véu quando recebe dano mágico.", danger: "elite", reward: "+86–182 XP", enemyIds: ["bell-revenant", "starved-astronomer"] },
  { id: "dragon-embers", regionId: "dragon", name: "Brasas sem Dragão", type: "CALDEIRA", kind: "boss", ruleKey: "standard", description: "A catedral queima por dentro e uma criatura antiga guarda o que restou do céu.", rule: "O chefe ganha um retorno de dano mais pesado.", danger: "chefe regional", reward: "+142–182 XP", enemyIds: ["tide-herald", "starved-astronomer"] },
  { id: "titan-gate", regionId: "titan", name: "Portão do Primeiro Gigante", type: "COLOSSO", kind: "siege", ruleKey: "siege", description: "Dois cavaleiros mantêm o selo enquanto o hierofante conta ossos no pátio.", rule: "Chefes recebem dano reduzido enquanto um protetor estiver vivo.", danger: "cerco final", reward: "+148–240 XP", enemyIds: ["salt-knight-1", "salt-knight-2", "black-salt-hierophant"] },
  { id: "tide-crypt-drowned", regionId: "tideCrypt", name: "Maré dos Afogados", type: "MARÉ DOS AFOGADOS", kind: "elite", ruleKey: "tide", description: "Sinos submersos vibram no escuro e devolvem um cadáver ao caminho.", rule: "O primeiro inimigo derrotado retorna uma vez com 35% de vida.", danger: "ameaça recorrente", reward: "+62–86 XP", enemyIds: ["drowned-acolyte", "bell-revenant"] },
  { id: "tide-crypt-herald", regionId: "tideCrypt", name: "Arauto sob as Correntes", type: "CHEFE · MARÉ", kind: "boss", ruleKey: "tide", description: "O arauto emerge do poço central trazendo a maré dentro do peito.", rule: "O chefe retorna uma vez com 35% de vida antes de cair de verdade.", danger: "chefe de região", reward: "+142 XP", enemyIds: ["tide-herald", "drowned-acolyte"] },
  { id: "thorn-garden-pact", regionId: "thornGarden", name: "Pacto da Rosa Negra", type: "PACTO", kind: "ambush", ruleKey: "thorns", description: "A estufa escolhe quem sangra. As raízes fecham qualquer retirada.", rule: "Golpes comuns recebem retaliação de seiva do alvo.", danger: "risco elevado", reward: "+58–72 XP", enemyIds: ["thorn-hound", "briar-sentinel"] },
  { id: "thorn-garden-matriarch", regionId: "thornGarden", name: "Coroa de Espinhos", type: "CHEFE · FLORA", kind: "boss", ruleKey: "thorns", description: "A matriarca floresce sobre um altar de nomes apagados.", rule: "Cada ataque corpo a corpo provoca retorno de espinhos.", danger: "chefe de região", reward: "+158 XP", enemyIds: ["rose-matriarch", "briar-sentinel"] },
  { id: "eclipse-shadows", regionId: "eclipse", name: "Sombras de Perigeu", type: "ECLIPSE", kind: "ritual", ruleKey: "veil", description: "As sombras chegam antes dos corpos e se recusam a ser desenhadas no mapa.", rule: "O alvo eclipsado só revela sua forma completa após magia.", danger: "ritual instável", reward: "+42–118 XP", enemyIds: ["eclipse-shade", "wisp"] },
  { id: "eclipse-astronomer", regionId: "eclipse", name: "Astrônomo Faminto", type: "CHEFE · ECLIPSE", kind: "boss", ruleKey: "veil", description: "O mestre da torre alimenta o eclipse com seus próprios olhos.", rule: "O chefe só perde o véu após receber dano mágico.", danger: "chefe de região", reward: "+182 XP", enemyIds: ["starved-astronomer", "eclipse-shade"] },
  { id: "salt-gates", regionId: "blackSalt", name: "Cerco dos Nove Selos", type: "CERCO", kind: "siege", ruleKey: "siege", description: "Dois cavaleiros fecham a muralha enquanto o hierofante prepara a última ordem.", rule: "Chefes recebem dano reduzido enquanto um protetor estiver vivo.", danger: "cerco", reward: "+148–240 XP", enemyIds: ["salt-knight-1", "salt-knight-2", "black-salt-hierophant"] },
  { id: "salt-hierophant", regionId: "blackSalt", name: "Último Selo Negro", type: "CHEFE · ORDEM RIVAL", kind: "boss", ruleKey: "siege", description: "O hierofante inscreve Veyra na fortaleza como o próximo nome a ser enterrado.", rule: "O chefe recebe dano reduzido enquanto seu cavaleiro estiver vivo.", danger: "chefe de região", reward: "+240 XP", enemyIds: ["black-salt-hierophant", "salt-knight-1"] },
];

export const regionalRewards: RegionalReward[] = [
  { regionId: "tideCrypt", itemId: "tide-heart", name: "Coração de Maré", category: "RELICÁRIO · MANA", description: "Uma cavidade azul-escura que ainda pulsa com o ritmo de um sino submerso.", effect: "+8 mana máxima", xpBonus: 80, firstClearGold: 25, tone: "tide", art: assets.tideCrypt },
  { regionId: "thornGarden", itemId: "black-rose-corolla", name: "Corola da Rosa Negra", category: "RELICÁRIO · PODER", description: "Pétalas preservadas em sal de sangue; cada espinho guarda uma ordem curta.", effect: "+4 poder", xpBonus: 95, firstClearGold: 35, tone: "thorn", art: assets.thornGarden },
  { regionId: "eclipse", itemId: "perigee-lens", name: "Lente de Perigeu", category: "RELICÁRIO · GRIMÓRIO", description: "Um fragmento de céu que revela o que o eclipse tenta esconder.", effect: "+1 espaço de feitiço", xpBonus: 120, firstClearGold: 45, tone: "eclipse", art: assets.eclipse },
  { regionId: "blackSalt", itemId: "black-seal", name: "Selo Negro", category: "RELICÁRIO · VITALIDADE", description: "A marca de uma ordem rival, ainda quente com a autoridade de nove túmulos.", effect: "+22 vitalidade máxima", xpBonus: 160, firstClearGold: 60, tone: "salt", art: assets.blackSalt },
];

export function rewardForRegion(regionId: RegionId): RegionalReward | undefined {
  return regionalRewards.find((reward) => reward.regionId === regionId);
}

export function enemiesForEncounter(encounterId: string): Enemy[] {
  const encounter = encounters.find((item) => item.id === encounterId);
  if (!encounter) return [];
  return encounter.enemyIds.map((id) => enemyCatalog.find((enemy) => enemy.id === id)).filter((enemy): enemy is Enemy => Boolean(enemy)).map((enemy) => ({ ...enemy }));
}

export const baseEnemies = enemiesForEncounter("ashen-patrol");

export function createBossServant(enemy: Enemy): Servant {
  const bossStats: ServantStats = { guard: enemy.ability?.kind === "break" ? 7 : 4, damage: Math.max(5, Math.round(enemy.atk / 5)), sustain: enemy.ability?.heal ? 5 : 2, arcana: Math.max(3, Math.round(enemy.atk / 7)) };
  const hp = 48 + bossStats.guard * 10;
  return {
    uid: `boss-${enemy.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, templateId: `boss-${enemy.id}`, name: enemy.name, role: enemy.ability?.kind === "break" ? "guard" : enemy.ability?.heal ? "support" : "arcanist", rarity: "legendary", affinity: enemy.damageType ?? "shadow", origin: `${enemy.kind} · alma coroada`, level: Math.max(1, enemy.level - 1), xp: 0, stars: 5, stats: bossStats, passive: `${enemy.trait}: a formação herda um fragmento deste juramento.`, active: { id: enemy.ability?.id ?? `boss-${enemy.id}-rite`, name: enemy.ability?.name ?? "Mandato Sepulcral", description: enemy.ability?.description ?? "A alma coroada ataca através da formação.", kind: enemy.ability?.kind ?? "assault", cost: enemy.ability?.cost ?? 14, damage: enemy.ability?.damage ?? Math.max(20, Math.round(enemy.atk * 1.1)), heal: enemy.ability?.heal, damageType: enemy.ability?.damageType ?? enemy.damageType ?? "shadow", status: enemy.ability?.appliesStatus, turns: enemy.ability?.statusTurns }, equipment: enemy.loot, art: enemy.art, evolutionStage: 0, maxHp: hp, hp, revivalDebt: 0, bossId: enemy.id,
  };
}

export const regionIcons: Record<RegionId, LucideIcon> = {
  ashen: Compass, darkwood: Wind, deadlands: Skull, swamp: Waves, mountain: Mountain, dragon: Flame, titan: Crown,
  tideCrypt: Droplets, thornGarden: Flower2, eclipse: Orbit, blackSalt: Castle,
};

export const encounterIcons: Record<EncounterKind, LucideIcon> = {
  patrol: Compass, ambush: Wind, ritual: Moon, elite: Skull, siege: Castle, boss: Crown,
};
