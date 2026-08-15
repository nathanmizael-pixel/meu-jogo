/* Necromancer Realms — Gótico de Pergaminho Vivo. A interface segue um atlas de campanha anotado, com encontros como placas de arquivo. */
// Estilo do arquivo: Gótico de Pergaminho Vivo — informação tática é apresentada como evidência registrada no campo.
/* Gótico de Pergaminho Vivo: a Cidadela é a casa material de Veyra — pátio, salas rituais e instrumentos táticos em uma única geografia. */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive, BookOpen, Check, ChevronRight, CircleDot, CloudFog, Compass, Crown, Heart, KeyRound, LockKeyhole,
  Map, Moon, Mountain, Package, Pause, Play, RefreshCw, Save, ScrollText, Shield, Skull, Sparkles, Swords,
  Target, Volume2, WandSparkles, Waves, Wind, X, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { ProgressionGrimoire } from "@/components/ProgressionGrimoire";
import { FieldJournal } from "@/components/FieldJournal";
import { ServantMemoryLedger } from "@/components/ServantMemoryLedger";
import { LegionBondLedger } from "@/components/LegionBondLedger";
import { BuildSynergyLedger } from "@/components/BuildSynergyLedger";
import { CitadelInterior } from "@/components/CitadelInterior";
import { KingdomDoctrineLedger } from "@/components/KingdomDoctrineLedger";
import { citadelNpcs, citadelNpcForRoom, initialCitadelNpcProgress, type CitadelNpc, type CitadelNpcProgress } from "@/lib/citadelNpcs";
import { NewCycleLedger } from "@/components/NewCycleLedger";
import { campaignEndings, readCampaignActs, readCampaignStory, initialCampaignStory, type CampaignActId, type CampaignEndingId } from "@/lib/mainCampaign";
import { doctrineById, doctrineCombatModifiers, doctrineFromRoadDecision, dominantKingdomDoctrine, inscribeDoctrineDecision, type KingdomDoctrine } from "@/lib/kingdomDoctrine";
import { ResurrectionCinematic } from "@/components/ResurrectionCinematic";
import { useAdaptiveSoundscape } from "@/hooks/useAdaptiveSoundscape";
import { combatXp, discoveryXp, firstEncounterXp, masteryXp, xpForNextLevel, xpSourceMeta, type XpLedgerEntry, type XpSource } from "@/lib/xpProgression";
import { routesForRegion, type ExplorationRoute, type ExplorationRouteKind } from "@/lib/explorationRoutes";
import { deriveWorldMemoryIds, encounterOverrideForRegion, worldMemoryCatalog, worldMemoriesForRegion, type WorldMemoryId } from "@/lib/worldMemory";
import { cultIsPresentInRegion, readCultFaction, type CultFactionState } from "@/lib/cultFaction";
import { bossRumorsForRegion, bossWorldReactionFor, reactionsForRaisedBosses, type BossWorldReaction } from "@/lib/bossWorldReactions";
import { deriveServantMemoryIds, personalServantsInLegion, servantMemoryProfiles } from "@/lib/servantMemories";
import { applyBondDeltas, legionBondBonuses, readLegionBonds, type LegionBondState, personalBondRecords } from "@/lib/legionBonds";
import { enemyDoctrineFor } from "@/lib/enemyDoctrines";
import { availableLegionCombos, legionComboCatalog, type LegionCombo } from "@/lib/legionCombos";
import { availableBuildSynergies, totalBuildSynergyEffects } from "@/lib/buildSynergies";
import "../regional-cycles.css";
import "../road-events.css";
import "../atlas-visits.css";
import "../boss-arenas.css";
import "../equipment-loadout.css";
import "../citadel.css";
import "../diario-campo.css";
import "../bestiary-tactics.css";
import "../world-artifact.css";
import "../forbidden-manuscript.css";
import "../soundscape.css";
import "../new-cycle.css";
import "../combat-verdict.css";
import "../resurrection-cinematic.css";
import "../exploration-routes.css";
import "../world-memory.css";
import "../cult-faction.css";
import "../boss-world-reactions.css";
import "../servant-memories.css";
import "../legion-bonds.css";
import "../enemy-doctrines.css";
import "../legion-combos.css";
import "../build-synergies.css";
import "../citadel-interiors.css";
import "../citadel-actions.css";
import "../citadel-residents.css";
import "../citadel-room-proofs.css";
import "../campaign-chronicle.css";
import "../kingdom-doctrines.css";
import "../kingdom-citadel.css";
import "../kingdom-doctrine-refinement.css";
import {
  assets, baseEnemies, bossArenas, challengeModes, citadelBuildings, createBossServant, createServant, cycleBossRelicDrops, encounters, encounterIcons, enemiesForEncounter, enemyBestiary, enemyCatalog, equipmentCatalog, initialAttributes, initialCitadel, initialNewCycleState, initialPlayer, newCycleRoadEvents, regionIcons, regionalCycles, regions, regionalRewards, resurrectionCinematics, rewardForRegion, roadEvents, secondaryQuests, servantTemplates, specializationTrees,
  type BossAbility, type BossArena, type ChallengeModeId, type CitadelBuilding, type CitadelBuildingId, type CitadelState, type CombatStatus, type DamageType, type Encounter, type Enemy, type EnemyPosture, type EquipmentEffect, type EquipmentItem, type EquipmentSlot, type FallenServant, type NecromancerAttribute, type NecromancerTalent, type NewCycleState, type PlayerState, type Region, type RegionCycle, type RegionId, type RegionPhase, type RegionalReward, type RoadEvent, type RoadEventChoice, type SecondaryQuest, type SecondaryQuestCategory, type Servant, type ServantEvolution, type SpecializationTree, type StatusType, type Tab,
} from "@/lib/gameData";

function xpLabel(player: PlayerState) { return player.level >= 70 ? "MAESTRIA 70" : `${player.xp} / ${player.xpToNext}`; }

type DefenseMove = "block" | "evade" | "counter";
type SpellKey = "lance" | "ember" | "frost" | "rot" | "rite" | "drain" | "cataclysm" | "echo" | "raise";
type TacticalVerdictId = "perfect" | "brutal" | "arcane" | "necromantic";
type CombatRecord = { directStrikes: number; rituals: number; servantOrders: number; bossOrders: number; arenaRites: number; executions: number; servantsFallen: number; playerDamageTaken: number; rounds: number; weaknessesExploited: number; posturesBroken: number };
type TacticalVerdict = { id: TacticalVerdictId; title: string; seal: string; detail: string; xp?: number; gold?: number; fragments?: number; knowledge?: number };
type TacticalVerdictResult = { encounterName: string; regionName: string; verdicts: TacticalVerdict[]; record: CombatRecord };
const bossEquipmentDrops: Record<string, string[]> = { warden: ["reaper-scythe"], "tide-herald": ["drowned-plate"], "rose-matriarch": ["pilgrim-ring"], "starved-astronomer": ["last-soul-grimoire"], "black-salt-hierophant": ["dead-king-crown", "salt-phylactery"] };
const emptyEquipmentEffects: Required<EquipmentEffect> = { physicalDamagePct: 0, ritualDamagePct: 0, servantDamagePct: 0, servantGuard: 0, maxHp: 0, maxMana: 0, manaCostReduction: 0, manaOnServantFallPct: 0, executeThreshold: 0, healingPct: 0, postureDamage: 0, soulFragmentsOnBoss: 0 };
const createCombatRecord = (): CombatRecord => ({ directStrikes: 0, rituals: 0, servantOrders: 0, bossOrders: 0, arenaRites: 0, executions: 0, servantsFallen: 0, playerDamageTaken: 0, rounds: 0, weaknessesExploited: 0, posturesBroken: 0 });

function tacticalVerdictsFor(record: CombatRecord): TacticalVerdict[] {
  const verdicts: TacticalVerdict[] = [];
  if (record.servantsFallen === 0) verdicts.push({ id: "perfect", title: "Vitória perfeita", seal: "FORMação INTACTA", detail: "Nenhum servo caiu. A legião preservou cada nome inscrito no osso.", xp: 18, gold: 14 });
  if (record.executions >= 2) verdicts.push({ id: "brutal", title: "Vitória brutal", seal: "SENTENÇAS CUMPRIDAS", detail: `${record.executions} inimigos foram encerrados sob a marca de execução.`, fragments: 3, gold: 8 });
  if (record.directStrikes === 0 && record.rituals + record.arenaRites > 0 && record.servantOrders === 0 && record.bossOrders === 0) verdicts.push({ id: "arcane", title: "Vitória arcana", seal: "SOMENTE RITOS", detail: "Nenhuma lâmina foi necessária; a pesquisa avançou pelo poder da magia.", xp: 14, knowledge: 2 });
  if (record.directStrikes === 0 && record.servantOrders + record.bossOrders > 0) verdicts.push({ id: "necromantic", title: "Vitória necromântica", seal: "ORDEM DOS MORTOS", detail: "Veyra não golpeou diretamente. A formação venceu por comando e vínculo.", fragments: 2, gold: 10 });
  return verdicts;
}

const damageMeta: Record<DamageType, { label: string; short: string }> = {
  physical: { label: "Físico", short: "FÍS" }, shadow: { label: "Sombrio", short: "SOM" }, fire: { label: "Fogo", short: "FOG" },
  ice: { label: "Gelo", short: "GEL" }, poison: { label: "Veneno", short: "VEN" }, holy: { label: "Sagrado", short: "SAG" },
};

type RegionKnowledge = "unknown" | "mapped" | "absolute";
const regionKnowledgeMeta: Record<RegionKnowledge, { label: string; short: string; note: string }> = {
  unknown: { label: "REGIÃO DESCONHECIDA", short: "VELADA", note: "A tinta ainda se recusa a nomear este território. Uma primeira passagem é necessária." },
  mapped: { label: "A REGIÃO FOI MAPEADA", short: "MARCADA", note: "As rotas, os perigos e os marcos iniciais agora respondem ao traço de Veyra." },
  absolute: { label: "CONHECIMENTO ABSOLUTO ADQUIRIDO", short: "ABSOLUTO", note: "Todos os encontros foram registrados e a relíquia local confirmou a posse deste fragmento do reino." },
};
function readRegionKnowledge(region: Region, visitedRegions: RegionId[], clearedEncounters: string[], relicIds: string[]): RegionKnowledge {
  const reward = rewardForRegion(region.id);
  const allEncountersCleared = region.encounterIds.length > 0 && region.encounterIds.every((id) => clearedEncounters.includes(id));
  if (allEncountersCleared && reward && relicIds.includes(reward.itemId)) return "absolute";
  return visitedRegions.includes(region.id) ? "mapped" : "unknown";
}

const statusMeta: Record<StatusType, { label: string; short: string }> = {
  bleed: { label: "Sangramento", short: "SANGRA" }, burn: { label: "Queimadura", short: "QUEIMA" }, freeze: { label: "Congelamento", short: "GELO" },
  corruption: { label: "Corrupção", short: "CORR" }, fear: { label: "Medo", short: "MEDO" }, stun: { label: "Atordoamento", short: "ATORD" }, curse: { label: "Maldição", short: "MALD" },
};

const postureMeta: Record<EnemyPosture, { label: string; detail: string }> = {
  neutral: { label: "Neutra", detail: "Sem modificadores de defesa." }, guarded: { label: "Protegida", detail: "Recebe menos dano até a postura ser quebrada." },
  vulnerable: { label: "Vulnerável", detail: "Recebe dano ampliado por uma rodada." }, enraged: { label: "Enfurecida", detail: "Ataca com mais força, mas se expõe." },
  channeling: { label: "Canalizando", detail: "Uma postura quebrada interrompe o ritual." },
};

const attributeMeta: Record<NecromancerAttribute, { name: string; mark: string; effect: string }> = {
  power: { name: "Poder", mark: "POD", effect: "+3 dano físico e ritual por ponto." },
  vitality: { name: "Vitalidade", mark: "VIT", effect: "+12 vida máxima por ponto." },
  intellect: { name: "Intelecto", mark: "INT", effect: "+8 mana máxima e +3 dano ritual por ponto." },
  dominion: { name: "Domínio", mark: "DOM", effect: "+1 espaço da legião e reforço de formação." },
  corruption: { name: "Corrupção", mark: "COR", effect: "+4% dano sombrio e +2 dano de estados por ponto." },
};

function hasStatus(statuses: CombatStatus[] | undefined, type: StatusType) { return Boolean(statuses?.some((status) => status.type === type && status.turns > 0)); }
function addStatus(statuses: CombatStatus[] | undefined, type: StatusType, turns: number): CombatStatus[] {
  const current = statuses ?? []; const found = current.find((status) => status.type === type);
  return found ? current.map((status) => status.type === type ? { ...status, turns: Math.max(status.turns, turns), stacks: Math.min(3, (status.stacks ?? 1) + 1) } : status) : [...current, { type, turns, stacks: 1 }];
}
function decayStatuses(statuses: CombatStatus[]) { return statuses.map((status) => ({ ...status, turns: status.turns - 1 })).filter((status) => status.turns > 0); }
function statusText(statuses: CombatStatus[] | undefined) { return (statuses ?? []).filter((status) => status.turns > 0).map((status) => `${statusMeta[status.type].short} ${status.turns}`).join(" · "); }
function servantRank(rarity: Servant["rarity"]) { return rarity === "legendary" ? "LENDÁRIO" : rarity === "epic" ? "ÉPICO" : rarity === "rare" ? "RARO" : rarity === "uncommon" ? "INCOMUM" : "COMUM"; }
function servantStars(stars: number) { return "★".repeat(stars) + "☆".repeat(Math.max(0, 5 - stars)); }
function bestiaryStudyGoal(enemy: Enemy) { return enemy.boss ? 1 : enemy.elite ? 3 : 4; }
function bestiaryKnowledgeLevel(enemy: Enemy, sightings: Record<string, number>, defeats: Record<string, number>) {
  const seen = sightings[enemy.id] ?? 0;
  const kills = defeats[enemy.id] ?? 0;
  if (!seen) return 0;
  if (!kills) return 1;
  return kills >= bestiaryStudyGoal(enemy) ? 3 : 2;
}

type SecondaryQuestSnapshot = {
  questProgress: Record<string, number>; defeatedBossIds: string[]; relicIds: string[]; servantTemplateIds: string[]; eventFlags: string[]; servantMemoryIds: string[];
};
function secondaryQuestProgressFor(quest: SecondaryQuest, snapshot: SecondaryQuestSnapshot) {
  const { condition } = quest;
  if (condition.type === "kill") return { current: Math.min(condition.count, snapshot.questProgress[condition.enemyId] ?? 0), total: condition.count };
  if (condition.type === "boss_defeated") return { current: snapshot.defeatedBossIds.includes(condition.bossId) ? 1 : 0, total: 1 };
  if (condition.type === "relic_owned") return { current: snapshot.relicIds.includes(condition.relicId) ? 1 : 0, total: 1 };
  if (condition.type === "relics_owned") return { current: Math.min(condition.count, snapshot.relicIds.length), total: condition.count };
  if (condition.type === "event_flag") return { current: snapshot.eventFlags.includes(condition.flag) ? 1 : 0, total: 1 };
  if (condition.type === "servant_memory") return { current: snapshot.servantMemoryIds.includes(condition.memoryId) ? 1 : 0, total: 1 };
  return { current: snapshot.servantTemplateIds.includes(condition.templateId) ? 1 : 0, total: 1 };
}
type EnvironmentReadout = { cycle: RegionCycle; phase: RegionPhase; turnInPhase: number; actionsUntilShift: number };
function readRegionalCycle(regionId: RegionId, actionCount: number): EnvironmentReadout {
  const cycle = regionalCycles[regionId];
  const duration = cycle.phases.reduce((total, phase) => total + phase.duration, 0);
  let cursor = ((actionCount % duration) + duration) % duration;
  for (const phase of cycle.phases) {
    if (cursor < phase.duration) return { cycle, phase, turnInPhase: cursor + 1, actionsUntilShift: phase.duration - cursor };
    cursor -= phase.duration;
  }
  const phase = cycle.phases[0];
  return { cycle, phase, turnInPhase: 1, actionsUntilShift: phase.duration };
}

export default function Home() {
  const [tab, setTab] = useState<Tab>(() => {
    const previewTab = new URLSearchParams(window.location.search).get("view") as Tab | null;
    return previewTab && ["expedition", "map", "citadel", "necromancy", "bestiary", "grimoire", "inventory", "quests", "cycle"].includes(previewTab) ? previewTab : "expedition";
  });
  const [player, setPlayer] = useState<PlayerState>(initialPlayer);
  const [citadel, setCitadel] = useState<CitadelState>(initialCitadel);
  const [citadelRoomId, setCitadelRoomId] = useState<CitadelBuildingId | null>(() => {
    const previewRoom = new URLSearchParams(window.location.search).get("room") as CitadelBuildingId | null;
    return previewRoom && ["tower", "crypt", "forge", "altar", "library", "garden"].includes(previewRoom) ? previewRoom : null;
  });
  const [selectedRegion, setSelectedRegion] = useState<RegionId>("ashen");
  const [encounterId, setEncounterId] = useState("ashen-patrol");
  const [enemies, setEnemies] = useState<Enemy[]>(baseEnemies);
  const [corpses, setCorpses] = useState<string[]>([]);
  const [targetId, setTargetId] = useState("marauder");
  const [questDone, setQuestDone] = useState(false);
  const [sideQuestDone, setSideQuestDone] = useState(false);
  const sideQuestLock = useRef(false);
  const [log, setLog] = useState(["O mapa respirou. A névoa recuou um palmo.", "Objetivo recebido: silencie o Guardião do Ossuário.", "Você chegou ao Verge de Cinza."]);
  const [pulse, setPulse] = useState(0);
  const [muted, setMuted] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.56);
  const [musicVolume, setMusicVolume] = useState(0.68);
  const [ambienceVolume, setAmbienceVolume] = useState(0.6);
  const [effectsVolume, setEffectsVolume] = useState(0.72);
  const [interfaceVolume, setInterfaceVolume] = useState(0.48);
  const [paused, setPaused] = useState(false);
  const [combatEngaged, setCombatEngaged] = useState(false);
  const [help, setHelp] = useState(false);
  const [revivedIds, setRevivedIds] = useState<string[]>([]);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [clearedEncounters, setClearedEncounters] = useState<string[]>([]);
  const [relicDrop, setRelicDrop] = useState<{ reward: RegionalReward; encounterName: string } | null>(null);
  const [defeated, setDefeated] = useState(false);
  const [defeatedBossIds, setDefeatedBossIds] = useState<string[]>([]);
  const [raisedBossIds, setRaisedBossIds] = useState<string[]>([]);
  const [playerStatuses, setPlayerStatuses] = useState<CombatStatus[]>([]);
  const [lastDefense, setLastDefense] = useState<DefenseMove | null>(null);
  const [lastDamageType, setLastDamageType] = useState<DamageType | null>(null);
  const [environmentActions, setEnvironmentActions] = useState(0);
  const [roadEvent, setRoadEvent] = useState<RoadEvent | null>(null);
  const [resolvedRoadEvents, setResolvedRoadEvents] = useState<string[]>([]);
  const [eventFlags, setEventFlags] = useState<string[]>([]);
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  const [visitedRegions, setVisitedRegions] = useState<RegionId[]>(["ashen"]);
  const [pendingRouteRegionId, setPendingRouteRegionId] = useState<RegionId | null>(null);
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [routeRelicIds, setRouteRelicIds] = useState<string[]>([]);
  const [worldMemoryIds, setWorldMemoryIds] = useState<WorldMemoryId[]>([]);
  const [servantMemoryIds, setServantMemoryIds] = useState<string[]>([]);
  const [legionBonds, setLegionBonds] = useState<LegionBondState>({});
  const [bossArenaProgress, setBossArenaProgress] = useState(0);
  const [legionFury, setLegionFury] = useState(0);
  const [questProgress, setQuestProgress] = useState<Record<string, number>>({});
  const [completedSecondaryQuestIds, setCompletedSecondaryQuestIds] = useState<string[]>([]);
  const secondaryQuestCompletionLock = useRef(new Set<string>());
  const [bestiarySightings, setBestiarySightings] = useState<Record<string, number>>({ marauder: 1, wisp: 1 });
  const [bestiaryDefeats, setBestiaryDefeats] = useState<Record<string, number>>({});
  const [completedBestiaryIds, setCompletedBestiaryIds] = useState<string[]>([]);
  const bestiaryCompletionLock = useRef(new Set<string>());
  const [combatRecord, setCombatRecord] = useState<CombatRecord>(() => createCombatRecord());
  const combatRecordRef = useRef<CombatRecord>(createCombatRecord());
  const [tacticalVerdictAwards, setTacticalVerdictAwards] = useState<string[]>([]);
  const [tacticalVerdict, setTacticalVerdict] = useState<TacticalVerdictResult | null>(null);
  const [xpLedger, setXpLedger] = useState<XpLedgerEntry[]>([]);
  const [lastDefeatSource, setLastDefeatSource] = useState("a linha inimiga");
  const [newCycle, setNewCycle] = useState<NewCycleState>(initialNewCycleState);
  const [combatFx, setCombatFx] = useState<{ id: number; kind: "strike" | "lance" | "drain" | "boss"; targetName: string } | null>(null);
  const [resurrectionFx, setResurrectionFx] = useState<{ id: number; boss: Enemy } | null>(null);
  const [activeResurrectionCinematic, setActiveResurrectionCinematic] = useState<Enemy | null>(null);
  const [cinematicSeenBossIds, setCinematicSeenBossIds] = useState<string[]>([]);
  const [citadelNpcProgress, setCitadelNpcProgress] = useState<CitadelNpcProgress>(initialCitadelNpcProgress);
  const [campaignStory, setCampaignStory] = useState(initialCampaignStory);
  const resurrectionCompletionLock = useRef(new Set<string>());

  const region = regions.find((item) => item.id === selectedRegion) ?? regions[0];
  const encounter = encounters.find((item) => item.id === encounterId) ?? encounters[0];
  const liveEnemies = enemies.filter((enemy) => enemy.hp > 0);
  const target = liveEnemies.find((enemy) => enemy.id === targetId) ?? liveEnemies[0] ?? enemies[0] ?? baseEnemies[0];
  const attributes = { ...initialAttributes, ...(player.attributes ?? {}) };
  const talents = player.talents ?? [];
  const hasTalent = (talentId: string) => talents.includes(talentId);
  const currentOath = specializationTrees.find((tree) => tree.id === player.specialization);
  const oathRank = currentOath ? Math.min(70, Math.max(1, player.level)) : 0;
  const equippedItems = Object.values(player.equipped ?? {}).map((id) => equipmentCatalog.find((item) => item.id === id)).filter((item): item is EquipmentItem => Boolean(item));
  const equippedItemIds = equippedItems.map((item) => item.id);
  const legion = player.legion ?? initialPlayer.legion;
  const activeBuildSynergies = availableBuildSynergies({ specialization: player.specialization, equippedItemIds, legion });
  const buildSynergyEffects = totalBuildSynergyEffects(activeBuildSynergies);
  const dominantDoctrine = doctrineById(dominantKingdomDoctrine(campaignStory.kingdom));
  const equipmentEffects = equippedItems.reduce<Required<EquipmentEffect>>((total, item) => ({ physicalDamagePct: total.physicalDamagePct + (item.effect.physicalDamagePct ?? 0), ritualDamagePct: total.ritualDamagePct + (item.effect.ritualDamagePct ?? 0), servantDamagePct: total.servantDamagePct + (item.effect.servantDamagePct ?? 0), servantGuard: total.servantGuard + (item.effect.servantGuard ?? 0), maxHp: total.maxHp + (item.effect.maxHp ?? 0), maxMana: total.maxMana + (item.effect.maxMana ?? 0), manaCostReduction: total.manaCostReduction + (item.effect.manaCostReduction ?? 0), manaOnServantFallPct: total.manaOnServantFallPct + (item.effect.manaOnServantFallPct ?? 0), executeThreshold: Math.max(total.executeThreshold, item.effect.executeThreshold ?? 0), healingPct: total.healingPct + (item.effect.healingPct ?? 0), postureDamage: total.postureDamage + (item.effect.postureDamage ?? 0), soulFragmentsOnBoss: total.soulFragmentsOnBoss + (item.effect.soulFragmentsOnBoss ?? 0) }), emptyEquipmentEffects);
  const citadelLevels = citadel.buildings;
  const citadelTotalLevel = Object.values(citadelLevels).reduce((total, level) => total + level, 0);
  const oathManaDiscount = currentOath?.id === "lich" ? Math.floor(oathRank / 14) : 0;
  const oathServantDiscount = currentOath?.id === "soul-master" ? Math.floor(oathRank / 18) : 0;
  const attributeDamage = attributes.power * 3;
  const ritualDamage = attributes.intellect * 3 + citadelLevels.tower * 5;
  const doctrineCombat = doctrineCombatModifiers(dominantDoctrine?.id ?? null);
  const armyLimit = 2 + Math.floor(player.level / 2) + attributes.dominion + (hasTalent("bone-throng") ? 1 : 0) + (currentOath?.id === "bone-lord" ? Math.floor(oathRank / 20) : 0) + citadelLevels.crypt + buildSynergyEffects.armyLimit;
  const armyCount = legion.length;
  const rawLegionStats = legion.reduce((total, servant) => ({ guard: total.guard + servant.stats.guard, damage: total.damage + servant.stats.damage, sustain: total.sustain + servant.stats.sustain, arcana: total.arcana + servant.stats.arcana }), { guard: 0, damage: 0, sustain: 0, arcana: 0 });
  const bondBonuses = useMemo(() => legionBondBonuses(legion, legionBonds), [legion, legionBonds]);
  const recoveryPenalty = legion.reduce((total, servant) => total + servant.revivalDebt, 0);
  const baseArmyDamage = armyCount * 4 + rawLegionStats.damage * 2 + attributes.dominion * 2 + (hasTalent("bone-throng") ? 4 : 0) + (currentOath?.id === "bone-lord" ? oathRank : 0);
  const armyTactics = { count: armyCount, damage: Math.floor(baseArmyDamage * (1 + (equipmentEffects.servantDamagePct + buildSynergyEffects.servantDamagePct + citadelLevels.forge * 3 + legionFury + doctrineCombat.armyDamagePct) / 100)) + bondBonuses.damage, guard: Math.min(72, armyCount * 4 + rawLegionStats.guard * 2 + attributes.dominion * 2 + (hasTalent("bone-crown") ? 10 : 0) + (currentOath?.id === "bone-lord" ? oathRank + (oathRank >= 10 ? 10 : 0) + (oathRank >= 55 ? 18 : 0) : 0) + equipmentEffects.servantGuard + buildSynergyEffects.servantGuard + bondBonuses.guard + doctrineCombat.guard), magic: armyCount + rawLegionStats.arcana * 2 + attributes.intellect + bondBonuses.magic + doctrineCombat.magic, sustain: armyCount * 2 + rawLegionStats.sustain * 2 + attributes.dominion + (currentOath?.id === "soul-master" ? oathRank : 0) + bondBonuses.sustain + doctrineCombat.sustain, recoveryPenalty };
  const bossCorpses = corpses.filter((id) => enemyCatalog.find((enemy) => enemy.id === id)?.boss);
  const raisedBosses = legion.map((unit) => unit.bossId ? enemyCatalog.find((enemy) => enemy.id === unit.bossId) : undefined).filter((enemy): enemy is Enemy => Boolean(enemy?.boss && enemy.ability));
  const activeLegionCombos = useMemo(() => availableLegionCombos(legion, raisedBosses), [legion, raisedBosses]);
  const canRaise = bossCorpses.length > 0 && legion.length < armyLimit;
  const xpProgress = player.level >= 70 ? 100 : Math.min(100, (player.xp / player.xpToNext) * 100);
  const unlocked = regions.filter((item) => item.unlockAt <= player.level).length;
  const servantTemplateIds = useMemo(() => [...(player.legion ?? []), ...(player.fallenServants ?? [])].map((servant) => servant.templateId), [player.legion, player.fallenServants]);
  const derivedServantMemoryIds = useMemo(() => deriveServantMemoryIds({ servantTemplateIds, visitedRegions, eventFlags }), [servantTemplateIds, visitedRegions, eventFlags]);
  const activeServantMemoryIds = useMemo(() => Array.from(new Set([...servantMemoryIds, ...derivedServantMemoryIds])), [servantMemoryIds, derivedServantMemoryIds]);
  const campaignActs = useMemo(() => readCampaignActs({ defeatedBossIds, visitedRegions, servantMemoryIds: activeServantMemoryIds }, campaignStory), [defeatedBossIds, visitedRegions, activeServantMemoryIds, campaignStory]);
  const campaignCompleted = Object.keys(cycleBossRelicDrops).every((bossId) => defeatedBossIds.includes(bossId)) && Boolean(campaignStory.endingId);
  const personalServantRecords = useMemo(() => personalServantsInLegion(legion, activeServantMemoryIds), [legion, activeServantMemoryIds]);
  const legionBondRecords = useMemo(() => personalBondRecords(legion, legionBonds), [legion, legionBonds]);
  const derivedWorldMemoryIds = useMemo(() => deriveWorldMemoryIds({ eventFlags, bestiaryDefeats, routeHistory }), [eventFlags, bestiaryDefeats, routeHistory]);
  const activeWorldMemoryIds = useMemo(() => Array.from(new Set([...worldMemoryIds, ...derivedWorldMemoryIds])), [worldMemoryIds, derivedWorldMemoryIds]);
  const cultFaction = useMemo(() => readCultFaction(eventFlags), [eventFlags]);
  const cultPresentHere = cultIsPresentInRegion(cultFaction, region.id);
  const bossReactions = useMemo(() => reactionsForRaisedBosses(raisedBossIds), [raisedBossIds]);
  const bossRumorsHere = useMemo(() => bossRumorsForRegion(region.id, raisedBossIds), [region.id, raisedBossIds]);
  const regionMemories = useMemo(() => worldMemoriesForRegion(region.id, activeWorldMemoryIds), [region.id, activeWorldMemoryIds]);
  const regionEncounterOverride = encounterOverrideForRegion(region.id, activeWorldMemoryIds);
  const regionEncounterIds = region.encounterIds.filter((id) => id !== "ashen-silence" && (!regionEncounterOverride || id !== "ashen-patrol"));
  if (regionEncounterOverride) regionEncounterIds.unshift(regionEncounterOverride);
  const regionEncounters = regionEncounterIds.map((id) => encounters.find((item) => item.id === id)).filter((item): item is Encounter => Boolean(item));
  const regionalReward = rewardForRegion(region.id);
  const regionRelicOwned = regionalReward ? player.relics.includes(regionalReward.itemId) : false;
  const encounterCleared = clearedEncounters.includes(encounter.id);
  const environment = readRegionalCycle(region.id, environmentActions);
  const activeArenaBoss = liveEnemies.find((enemy) => enemy.boss && bossArenas[enemy.id]);
  const bossArena = activeArenaBoss ? bossArenas[activeArenaBoss.id] : undefined;
  const activeChallenge = challengeModes.find((mode) => mode.id === newCycle.mode) ?? challengeModes[0];
  const cycleActive = newCycle.cycle > 0;
  const cycleHpMultiplier = cycleActive ? 1 + newCycle.cycle * .45 + (newCycle.mode === "nightmare" ? .25 : 0) : 1;
  const cycleDamageMultiplier = cycleActive ? 1 + newCycle.cycle * .25 + (newCycle.mode === "iron-soul" ? .3 : newCycle.mode === "nightmare" ? .18 : 0) : 1;
  const cycleXpMultiplier = cycleActive ? 1 + newCycle.cycle * .16 + (newCycle.mode === "nightmare" ? .4 : 0) : 1;
  const cycleGoldMultiplier = cycleActive ? 1 + newCycle.cycle * .12 + (newCycle.mode === "iron-soul" ? .6 : 0) : 1;
  const cycleFragmentMultiplier = cycleActive && newCycle.mode === "lich" ? 1.5 : 1;
  const audioScene = activeResurrectionCinematic ? "ritual" : defeated ? "defeat" : roadEvent ? "event" : combatEngaged ? activeArenaBoss ? bossArena && bossArenaProgress >= Math.max(1, bossArena.maxProgress - 1) ? "final" : "boss" : liveEnemies.some((enemy) => enemy.elite) ? "elite" : "battle" : liveEnemies.some((enemy) => enemy.elite || enemy.boss) ? "tension" : "exploration";
  const soundscape = useAdaptiveSoundscape({ regionId: region.id, phaseId: environment.phase.id, bossId: activeArenaBoss?.id, muted, paused, volume: soundVolume, musicVolume, ambienceVolume, effectsVolume, interfaceVolume, scene: audioScene, ducked: Boolean(activeResurrectionCinematic) });
  const activeCinematicConfig = activeResurrectionCinematic ? resurrectionCinematics[activeResurrectionCinematic.id] : undefined;
  const nightmareExtraPhase = Boolean(cycleActive && newCycle.mode === "nightmare" && bossArena && activeArenaBoss && !bossArena.cyclic && bossArenaProgress > bossArena.maxProgress);
  const arenaPhaseIndex = bossArena ? (bossArena.cyclic ? bossArenaProgress % bossArena.phases.length : Math.min(bossArenaProgress, bossArena.phases.length - 1)) : 0;
  const arenaPhase = bossArena ? nightmareExtraPhase ? { ...bossArena.phases[bossArena.phases.length - 1], name: bossArenaProgress === bossArena.maxProgress + 1 ? "Coroa do Pesadelo" : "Eclipse da Segunda Morte", detail: bossArenaProgress === bossArena.maxProgress + 1 ? "A arena recusa seu desfecho. A primeira coroa de pesadelo pressiona toda a formação." : "A segunda morte se abre sobre o campo. Quebre a postura ou a sentença será total." } : bossArena.phases[arenaPhaseIndex] : undefined;
  const secondaryQuestSnapshot: SecondaryQuestSnapshot = {
    questProgress, defeatedBossIds, relicIds: player.relics,
    servantTemplateIds, eventFlags, servantMemoryIds: activeServantMemoryIds,
  };
  const bestiaryKnownCount = enemyCatalog.filter((enemy) => (bestiarySightings[enemy.id] ?? 0) > 0).length;
  const WeatherIcon = useMemo(() => region.id === "dragon" ? FlameIcon : region.id === "swamp" || region.id === "darkwood" ? CloudFog : region.id === "mountain" ? Wind : Moon, [region.id]);

  useEffect(() => {
    const stored = localStorage.getItem("necromancer-realms-save");
    if (!stored) return;
    try {
      const saved = JSON.parse(stored);
      if (saved.player) {
        const legacyBosses = (Array.isArray(saved.player.army) ? saved.player.army : []).map((name: string) => enemyCatalog.find((enemy: Enemy) => enemy.name === name && enemy.boss)).filter((enemy: Enemy | undefined): enemy is Enemy => Boolean(enemy));
        const hasModernLegion = Array.isArray(saved.player.legion);
        const restoredLegion: Servant[] = hasModernLegion
          ? saved.player.legion.map((unit: Servant) => ({ ...unit, cooldown: unit.cooldown ?? 0, revivalDebt: unit.revivalDebt ?? 0 }))
          : [createServant("bone-rat"), ...legacyBosses.map((boss: Enemy) => createBossServant(boss))];
        const restoredEquipment = Array.isArray(saved.player.equipment) ? Array.from(new Set([...initialPlayer.equipment, ...saved.player.equipment.filter((id: unknown) => typeof id === "string" && equipmentCatalog.some((item) => item.id === id))])) : initialPlayer.equipment;
        const restoredEquipped = { ...initialPlayer.equipped, ...(saved.player.equipped ?? {}) };
        const restoredPlayer = { ...initialPlayer, ...saved.player, equipment: restoredEquipment, equipped: restoredEquipped, relics: Array.isArray(saved.player.relics) ? saved.player.relics : [], legion: restoredLegion, army: restoredLegion.map((unit) => unit.name), soulFragments: Number.isFinite(saved.player.soulFragments) ? saved.player.soulFragments : initialPlayer.soulFragments, fallenServants: Array.isArray(saved.player.fallenServants) ? saved.player.fallenServants : [], attributes: { ...initialAttributes, ...(saved.player.attributes ?? {}) }, attributePoints: Number.isFinite(saved.player.attributePoints) ? saved.player.attributePoints : 0, talentPoints: Number.isFinite(saved.player.talentPoints) ? saved.player.talentPoints : 0, talents: Array.isArray(saved.player.talents) ? saved.player.talents : [], specialization: specializationTrees.some((tree) => tree.id === saved.player.specialization) ? saved.player.specialization : null };
        restoredPlayer.level = Math.min(70, Math.max(1, Math.floor(restoredPlayer.level)));
        restoredPlayer.xpToNext = xpForNextLevel(restoredPlayer.level);
        restoredPlayer.xp = restoredPlayer.level >= 70 ? 0 : Math.max(0, Math.min(Math.floor(restoredPlayer.xp), restoredPlayer.xpToNext - 1));
        if (restoredPlayer.hp <= 0) restoredPlayer.hp = restoredPlayer.maxHp;
        setPlayer(restoredPlayer);
      }
      if (saved.citadel?.buildings) {
        const restoredBuildings = { ...initialCitadel.buildings };
        for (const building of citadelBuildings) {
          const level = saved.citadel.buildings[building.id];
          if (Number.isFinite(level)) restoredBuildings[building.id] = Math.min(building.maxLevel, Math.max(0, Math.floor(level)));
        }
        setCitadel({ buildings: restoredBuildings });
      }
      if (saved.citadelNpcProgress && typeof saved.citadelNpcProgress === "object") {
        const knownNpcs = new Set(citadelNpcs.map((npc) => npc.id));
        const knownRegions = new Set(regions.map((item) => item.id));
        setCitadelNpcProgress({
          metIds: Array.isArray(saved.citadelNpcProgress.metIds) ? saved.citadelNpcProgress.metIds.filter((id: unknown): id is CitadelNpc["id"] => typeof id === "string" && knownNpcs.has(id as CitadelNpc["id"])) : [],
          usedServiceIds: Array.isArray(saved.citadelNpcProgress.usedServiceIds) ? saved.citadelNpcProgress.usedServiceIds.filter((id: unknown): id is string => typeof id === "string" && knownNpcs.has(id as CitadelNpc["id"])) : [],
          chartedRegionIds: Array.isArray(saved.citadelNpcProgress.chartedRegionIds) ? saved.citadelNpcProgress.chartedRegionIds.filter((id: unknown): id is RegionId => typeof id === "string" && knownRegions.has(id as RegionId)) : [],
        });
      }
      if (saved.campaignStory) setCampaignStory(readCampaignStory(saved.campaignStory));
      if (Array.isArray(saved.corpses)) setCorpses(saved.corpses);
      if (Array.isArray(saved.log)) setLog(saved.log);
      if (Array.isArray(saved.clearedEncounters)) setClearedEncounters(saved.clearedEncounters);
      if (Array.isArray(saved.defeatedBossIds)) setDefeatedBossIds(saved.defeatedBossIds);
      if (Array.isArray(saved.raisedBossIds)) setRaisedBossIds(saved.raisedBossIds);
      if (Array.isArray(saved.playerStatuses)) setPlayerStatuses(saved.playerStatuses);
      if (saved.lastDamageType && saved.lastDamageType in damageMeta) setLastDamageType(saved.lastDamageType as DamageType);
      if (Number.isFinite(saved.environmentActions)) setEnvironmentActions(Math.max(0, saved.environmentActions));
      if (Array.isArray(saved.resolvedRoadEvents)) setResolvedRoadEvents(saved.resolvedRoadEvents);
      if (Array.isArray(saved.eventFlags)) setEventFlags(saved.eventFlags);
      if (Array.isArray(saved.eventHistory)) setEventHistory(saved.eventHistory.slice(0, 8));
      if (Array.isArray(saved.visitedRegions)) setVisitedRegions(saved.visitedRegions.filter((id: unknown): id is RegionId => typeof id === "string" && regions.some((region) => region.id === id)));
      else if (regions.some((item) => item.id === saved.selectedRegion)) setVisitedRegions((current) => current.includes(saved.selectedRegion) ? current : [...current, saved.selectedRegion]);
      if (Array.isArray(saved.routeHistory)) setRouteHistory(saved.routeHistory.filter((id: unknown): id is string => typeof id === "string" && id.includes("-")));
      if (Array.isArray(saved.routeRelicIds)) setRouteRelicIds(saved.routeRelicIds.filter((id: unknown): id is string => typeof id === "string" && id.includes("-unknown")));
      if (Array.isArray(saved.worldMemoryIds)) setWorldMemoryIds(saved.worldMemoryIds.filter((id: unknown): id is WorldMemoryId => typeof id === "string" && worldMemoryCatalog.some((memory) => memory.id === id)));
      if (Array.isArray(saved.servantMemoryIds)) {
        const validMemoryIds = new Set(servantMemoryProfiles.flatMap((profile) => profile.memories.map((memory) => memory.id)));
        setServantMemoryIds(saved.servantMemoryIds.filter((id: unknown): id is string => typeof id === "string" && validMemoryIds.has(id)));
      }
      if (saved.legionBonds && typeof saved.legionBonds === "object") setLegionBonds(readLegionBonds(saved.legionBonds));
      if (Number.isFinite(saved.bossArenaProgress)) setBossArenaProgress(Math.max(0, saved.bossArenaProgress));
      if (saved.questProgress && typeof saved.questProgress === "object") {
        const restoredProgress = Object.entries(saved.questProgress).reduce<Record<string, number>>((current, [id, amount]) => Number.isFinite(amount) && typeof amount === "number" && amount > 0 ? { ...current, [id]: Math.floor(amount) } : current, {});
        setQuestProgress(restoredProgress);
      }
      if (Array.isArray(saved.completedSecondaryQuestIds)) {
        const restoredCompleted = saved.completedSecondaryQuestIds.filter((id: unknown): id is string => typeof id === "string" && secondaryQuests.some((quest) => quest.id === id));
        setCompletedSecondaryQuestIds(restoredCompleted);
        secondaryQuestCompletionLock.current = new Set(restoredCompleted);
      }
      if (saved.bestiarySightings && typeof saved.bestiarySightings === "object") {
        const restoredSightings = Object.entries(saved.bestiarySightings).reduce<Record<string, number>>((current, [id, amount]) => typeof amount === "number" && Number.isFinite(amount) && amount > 0 && enemyCatalog.some((enemy) => enemy.id === id) ? { ...current, [id]: Math.floor(amount) } : current, {});
        setBestiarySightings(restoredSightings);
      }
      if (saved.bestiaryDefeats && typeof saved.bestiaryDefeats === "object") {
        const restoredDefeats = Object.entries(saved.bestiaryDefeats).reduce<Record<string, number>>((current, [id, amount]) => typeof amount === "number" && Number.isFinite(amount) && amount > 0 && enemyCatalog.some((enemy) => enemy.id === id) ? { ...current, [id]: Math.floor(amount) } : current, {});
        setBestiaryDefeats(restoredDefeats);
      }
      if (Array.isArray(saved.completedBestiaryIds)) {
        const restoredCompletedBestiary = saved.completedBestiaryIds.filter((id: unknown): id is string => typeof id === "string" && enemyCatalog.some((enemy) => enemy.id === id));
        setCompletedBestiaryIds(restoredCompletedBestiary);
        bestiaryCompletionLock.current = new Set(restoredCompletedBestiary);
      }
      if (saved.combatRecord && typeof saved.combatRecord === "object") {
        const restoredRecord = Object.entries(createCombatRecord()).reduce<CombatRecord>((current, [key]) => {
          const value = saved.combatRecord[key];
          return typeof value === "number" && Number.isFinite(value) && value >= 0 ? { ...current, [key]: Math.floor(value) } : current;
        }, createCombatRecord());
        combatRecordRef.current = restoredRecord;
        setCombatRecord(restoredRecord);
      }
      if (Array.isArray(saved.tacticalVerdictAwards)) setTacticalVerdictAwards(saved.tacticalVerdictAwards.filter((item: unknown): item is string => typeof item === "string"));
      if (Array.isArray(saved.xpLedger)) {
        const restoredLedger = saved.xpLedger.filter((entry: unknown): entry is XpLedgerEntry => Boolean(entry && typeof entry === "object" && typeof (entry as XpLedgerEntry).id === "string" && typeof (entry as XpLedgerEntry).label === "string" && typeof (entry as XpLedgerEntry).detail === "string" && typeof (entry as XpLedgerEntry).amount === "number" && Number.isFinite((entry as XpLedgerEntry).amount) && (entry as XpLedgerEntry).source in xpSourceMeta)).slice(0, 10);
        setXpLedger(restoredLedger);
      }
      if (saved.newCycle && typeof saved.newCycle === "object") {
        const savedMode = challengeModes.some((mode) => mode.id === saved.newCycle.mode) ? saved.newCycle.mode as ChallengeModeId : "standard";
        setNewCycle({ cycle: Number.isFinite(saved.newCycle.cycle) ? Math.max(0, Math.floor(saved.newCycle.cycle)) : 0, mode: savedMode, completedCycles: Number.isFinite(saved.newCycle.completedCycles) ? Math.max(0, Math.floor(saved.newCycle.completedCycles)) : 0, bossRelicsClaimed: Array.isArray(saved.newCycle.bossRelicsClaimed) ? saved.newCycle.bossRelicsClaimed.filter((id: unknown): id is string => typeof id === "string" && Boolean(cycleBossRelicDrops[id])) : [] });
      }
      if (Array.isArray(saved.cinematicSeenBossIds)) setCinematicSeenBossIds(saved.cinematicSeenBossIds.filter((id: unknown): id is string => typeof id === "string" && Boolean(resurrectionCinematics[id])));
      if (saved.questDone) setQuestDone(true);
      if (saved.sideQuestDone) { setSideQuestDone(true); sideQuestLock.current = true; }
      if (regions.some((item) => item.id === saved.selectedRegion)) setSelectedRegion(saved.selectedRegion);
      if (encounters.some((item) => item.id === saved.encounterId)) {
        setEncounterId(saved.encounterId);
        const savedEnemies = Array.isArray(saved.enemies) ? saved.enemies : enemiesForEncounter(saved.encounterId);
        const restoredEnemies = saved.encounterId === "ashen-patrol" && savedEnemies.some((enemy: Enemy) => enemy.id === "warden")
          ? enemiesForEncounter("ashen-patrol")
          : savedEnemies;
        setEnemies(restoredEnemies);
        if (restoredEnemies[0]) setTargetId(restoredEnemies[0].id);
      }
      toast.success("Save encontrado", { description: "O grimório retomou a última expedição." });
    } catch { localStorage.removeItem("necromancer-realms-save"); }
  }, []);

  useEffect(() => {
    const newlyRemembered = derivedServantMemoryIds.filter((id) => !servantMemoryIds.includes(id));
    if (!newlyRemembered.length) return;
    setServantMemoryIds((current) => Array.from(new Set([...current, ...newlyRemembered])));
    setEventFlags((current) => Array.from(new Set([...current, ...newlyRemembered.map((id) => `memory-${id}`)])));
    const memory = servantMemoryProfiles.flatMap((profile) => profile.memories).find((item) => item.id === newlyRemembered[0]);
    if (memory) note(`MEMÓRIA DOS MORTOS: ${memory.title.toUpperCase()}.`);
  }, [derivedServantMemoryIds, servantMemoryIds]);

  useEffect(() => {
    const newlySeen = campaignActs.filter((act) => act.unlocked && !campaignStory.seenActs.includes(act.id));
    if (!newlySeen.length) return;
    setCampaignStory((current) => ({ ...current, seenActs: Array.from(new Set([...current.seenActs, ...newlySeen.map((act) => act.id)])) }));
    const newest = newlySeen[newlySeen.length - 1];
    if (newest.id !== "insepulta") toast.success(`${newest.numeral} · ${newest.title}`, { description: newest.revelation });
  }, [campaignActs, campaignStory.seenActs]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("necromancer-realms-audio");
      if (!stored) return;
      const saved = JSON.parse(stored);
      if (typeof saved.muted === "boolean") setMuted(saved.muted);
      if (typeof saved.volume === "number" && Number.isFinite(saved.volume)) setSoundVolume(Math.min(1, Math.max(0, saved.volume)));
      if (typeof saved.music === "number" && Number.isFinite(saved.music)) setMusicVolume(Math.min(1, Math.max(0, saved.music)));
      if (typeof saved.ambience === "number" && Number.isFinite(saved.ambience)) setAmbienceVolume(Math.min(1, Math.max(0, saved.ambience)));
      if (typeof saved.effects === "number" && Number.isFinite(saved.effects)) setEffectsVolume(Math.min(1, Math.max(0, saved.effects)));
      if (typeof saved.interface === "number" && Number.isFinite(saved.interface)) setInterfaceVolume(Math.min(1, Math.max(0, saved.interface)));
    } catch { localStorage.removeItem("necromancer-realms-audio"); }
  }, []);

  useEffect(() => {
    localStorage.setItem("necromancer-realms-audio", JSON.stringify({ muted, volume: soundVolume, music: musicVolume, ambience: ambienceVolume, effects: effectsVolume, interface: interfaceVolume }));
  }, [muted, soundVolume, musicVolume, ambienceVolume, effectsVolume, interfaceVolume]);

  useEffect(() => {
    const nextLiveEnemy = enemies.find((enemy) => enemy.hp > 0);
    const currentTargetIsAlive = enemies.some((enemy) => enemy.id === targetId && enemy.hp > 0);
    if (nextLiveEnemy && !currentTargetIsAlive) setTargetId(nextLiveEnemy.id);
    if (!nextLiveEnemy && targetId) setTargetId("");
  }, [enemies, targetId]);

  useEffect(() => {
    if (!relicDrop && !resurrectionFx) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { setRelicDrop(null); setResurrectionFx(null); } };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [relicDrop, resurrectionFx]);

  useEffect(() => {
    if (!combatFx) return;
    const timer = window.setTimeout(() => setCombatFx(null), 880);
    return () => window.clearTimeout(timer);
  }, [combatFx]);

  useEffect(() => {
    if (!resurrectionFx) return;
    const timer = window.setTimeout(() => setResurrectionFx(null), 2600);
    return () => window.clearTimeout(timer);
  }, [resurrectionFx]);

  useEffect(() => {
    const quest = secondaryQuests.find((candidate) => {
      const progress = secondaryQuestProgressFor(candidate, secondaryQuestSnapshot);
      return progress.current >= progress.total && !completedSecondaryQuestIds.includes(candidate.id);
    });
    if (!quest || secondaryQuestCompletionLock.current.has(quest.id)) return;
    secondaryQuestCompletionLock.current.add(quest.id);
    const reward = quest.reward;
    setCompletedSecondaryQuestIds((current) => current.includes(quest.id) ? current : [...current, quest.id]);
    if (reward.xp) grantXp(reward.xp, "quest", quest.title, "Objetivo único do Diário de Campo concluído.");
    soundscape.cue("quest");
    setPlayer((current) => ({
      ...current,
      gold: current.gold + (reward.gold ?? 0),
      soulFragments: current.soulFragments + (reward.soulFragments ?? 0),
      equipment: reward.equipment && !current.equipment.includes(reward.equipment) ? [...current.equipment, reward.equipment] : current.equipment,
    }));
    const rewardParts = [reward.xp ? `+${reward.xp} XP` : "", reward.gold ? `+${reward.gold} ouro` : "", reward.soulFragments ? `+${reward.soulFragments} Fragmentos` : "", reward.equipment ? equipmentCatalog.find((item) => item.id === reward.equipment)?.name ?? "equipamento" : ""].filter(Boolean);
    note(`MISSÃO CONCLUÍDA: ${quest.title}. ${rewardParts.join(" · ")}.`);
    toast.success("Missão secundária concluída", { description: `${quest.title} · ${rewardParts.join(" · ")}` });
  }, [questProgress, defeatedBossIds, player.relics, player.legion, player.fallenServants, eventFlags, completedSecondaryQuestIds]);

  useEffect(() => {
    const enemy = enemyCatalog.find((candidate) => (bestiaryDefeats[candidate.id] ?? 0) >= bestiaryStudyGoal(candidate) && !completedBestiaryIds.includes(candidate.id));
    if (!enemy || bestiaryCompletionLock.current.has(enemy.id)) return;
    bestiaryCompletionLock.current.add(enemy.id);
    const fragments = enemy.boss ? 8 : enemy.elite ? 4 : 2;
    const gold = enemy.boss ? 35 : enemy.elite ? 18 : 8;
    setCompletedBestiaryIds((current) => current.includes(enemy.id) ? current : [...current, enemy.id]);
    setPlayer((current) => ({ ...current, gold: current.gold + gold, soulFragments: current.soulFragments + fragments }));
    note(`CONHECIMENTO COMPLETO: ${enemy.name}. A Biblioteca inscreveu sua fraqueza, padrão e espólio.`);
    toast.success("Dossiê completo", { description: `${enemy.name} · +${gold} ouro · +${fragments} Fragmentos de Alma` });
  }, [bestiaryDefeats, completedBestiaryIds]);

  useEffect(() => {
    const newIds = derivedWorldMemoryIds.filter((id) => !worldMemoryIds.includes(id));
    if (!newIds.length) return;
    setWorldMemoryIds((current) => Array.from(new Set([...current, ...newIds])));
    const newest = worldMemoryCatalog.find((memory) => memory.id === newIds[0]);
    if (newest) queueMicrotask(() => { note(`O MUNDO RESPONDE: ${newest.title}. ${newest.atlasNote}`); toast.success("Marca no Atlas", { description: newest.consequence }); });
  }, [derivedWorldMemoryIds, worldMemoryIds]);

  const note = (text: string) => { setLog((current) => [text, ...current].slice(0, 6)); setPulse((value) => value + 1); };
  const playImpact = (kind: "strike" | "lance" | "drain" | "boss") => {
    setCombatFx({ id: Date.now(), kind, targetName: target.name });
    soundscape.cue(kind === "lance" ? "ritual" : kind, activeArenaBoss?.id);
  };
  const save = () => {
    localStorage.setItem("necromancer-realms-save", JSON.stringify({ player, citadel, citadelNpcProgress, campaignStory, corpses, questDone, sideQuestDone, log, selectedRegion, encounterId, enemies, clearedEncounters, defeatedBossIds, raisedBossIds, playerStatuses, lastDamageType, environmentActions, resolvedRoadEvents, eventFlags, eventHistory, visitedRegions, routeHistory, routeRelicIds, worldMemoryIds: activeWorldMemoryIds, servantMemoryIds: activeServantMemoryIds, legionBonds, bossArenaProgress, questProgress, completedSecondaryQuestIds, bestiarySightings, bestiaryDefeats, completedBestiaryIds, combatRecord, tacticalVerdictAwards, xpLedger, newCycle, cinematicSeenBossIds }));
    note("A expedição foi gravada no selo de âmbar.");
    toast.success("Progresso salvo", { description: "Seu atlas e o encontro atual estão guardados neste navegador." });
  };
  const reset = () => {
    localStorage.removeItem("necromancer-realms-save"); setPlayer(initialPlayer); setCitadel(initialCitadel); setCitadelNpcProgress(initialCitadelNpcProgress); setCampaignStory(initialCampaignStory); setCitadelRoomId(null); setSelectedRegion("ashen"); setEncounterId("ashen-patrol"); setEnemies(baseEnemies); setCorpses([]); setQuestDone(false); setSideQuestDone(false); sideQuestLock.current = false; setTargetId("marauder"); setRevivedIds([]); setRevealedIds([]); setClearedEncounters([]); setDefeatedBossIds([]); setRaisedBossIds([]); setPlayerStatuses([]); setLastDefense(null); setLastDamageType(null); setEnvironmentActions(0); setRoadEvent(null); setResolvedRoadEvents([]); setEventFlags([]); setEventHistory([]); setVisitedRegions(["ashen"]); setPendingRouteRegionId(null); setRouteHistory([]); setRouteRelicIds([]); setWorldMemoryIds([]); setServantMemoryIds([]); setLegionBonds({}); setBossArenaProgress(0); setQuestProgress({}); setCompletedSecondaryQuestIds([]); secondaryQuestCompletionLock.current = new Set(); setBestiarySightings({ marauder: 1, wisp: 1 }); setBestiaryDefeats({}); setCompletedBestiaryIds([]); bestiaryCompletionLock.current = new Set(); const freshRecord = createCombatRecord(); combatRecordRef.current = freshRecord; setCombatRecord(freshRecord); setTacticalVerdictAwards([]); setXpLedger([]); setLastDefeatSource("a linha inimiga"); setNewCycle(initialNewCycleState); setCinematicSeenBossIds([]); resurrectionCompletionLock.current = new Set(); setActiveResurrectionCinematic(null); setRelicDrop(null); setDefeated(false); setPaused(false); setCombatEngaged(false); note("O círculo foi desfeito. Uma nova expedição começa."); toast("Novo ciclo", { description: "Inimigos, relíquias e objetivos foram restaurados." });
  };

  function updateCombatRecord(change: Partial<CombatRecord>) {
    const next = { ...combatRecordRef.current, ...Object.fromEntries(Object.entries(change).map(([key, value]) => [key, (combatRecordRef.current[key as keyof CombatRecord] ?? 0) + (value ?? 0)])) } as CombatRecord;
    combatRecordRef.current = next;
    setCombatRecord(next);
  }
  function resetCombatRecord() {
    const next = createCombatRecord();
    combatRecordRef.current = next;
    setCombatRecord(next);
    setLegionFury(0);
    setTacticalVerdict(null);
    setLastDefeatSource("a linha inimiga");
  }
  function resolveTacticalVictory(completedEncounter: Encounter) {
    const record = combatRecordRef.current;
    const eligible = tacticalVerdictsFor(record);
    const earned = eligible.filter((verdict) => !tacticalVerdictAwards.includes(`${completedEncounter.id}:${verdict.id}`));
    if (earned.length) {
      setTacticalVerdictAwards((current) => Array.from(new Set([...current, ...earned.map((verdict) => `${completedEncounter.id}:${verdict.id}`)])));
      const xp = earned.reduce((total, verdict) => total + (verdict.xp ?? 0), 0);
      const gold = earned.reduce((total, verdict) => total + (verdict.gold ?? 0), 0);
      const fragments = earned.reduce((total, verdict) => total + (verdict.fragments ?? 0), 0);
      const knowledge = earned.reduce((total, verdict) => total + (verdict.knowledge ?? 0), 0);
      if (xp) grantXp(xp, "verdict", earned.map((verdict) => verdict.title).join(" · "), "Recompensa por dominar o confronto sem repetir a rota.");
      if (gold || fragments) setPlayer((current) => ({ ...current, gold: current.gold + gold, soulFragments: current.soulFragments + fragments }));
      if (knowledge) setBestiarySightings((current) => enemies.reduce<Record<string, number>>((next, enemy) => ({ ...next, [enemy.id]: (next[enemy.id] ?? 0) + knowledge }), current));
      const rewards = [`+${xp} XP`, gold ? `+${gold} ouro` : "", fragments ? `+${fragments} Fragmentos` : "", knowledge ? `+${knowledge} registros do Bestiário` : ""].filter(Boolean).join(" · ");
      note(`VEREDITO TÁTICO: ${earned.map((verdict) => verdict.title).join(" · ")}. ${rewards}.`);
      toast.success("Veredito registrado", { description: `${earned.map((verdict) => verdict.title).join(" · ")} · ${rewards}` });
    }
    setTacticalVerdict({ encounterName: completedEncounter.name, regionName: region.name, verdicts: earned.length ? earned : eligible, record });
  }

  function grantXp(amount: number, source: XpSource, label: string, detail: string) {
    const awarded = Math.max(0, Math.round(amount));
    if (!awarded) return;
    gainXp(awarded);
    setXpLedger((current) => [{ id: `${source}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, source, label, amount: awarded, detail, at: Date.now() }, ...current].slice(0, 10));
  }

  function gainXp(amount: number) {
    setPlayer((current) => {
      let xp = current.xp + amount, level = current.level, next = current.xpToNext, maxHp = current.maxHp, maxMana = current.maxMana, slots = current.spellSlots, attributePoints = current.attributePoints ?? 0, talentPoints = current.talentPoints ?? 0;
      while (xp >= next && level < 70) { xp -= next; level += 1; next = xpForNextLevel(level); maxHp += 16; maxMana += 8; attributePoints += 2; talentPoints += 1; if (level % 2 === 0) slots += 1; }
      if (level >= 70) { level = 70; xp = 0; next = 1; }
      if (level > current.level) { queueMicrotask(() => { soundscape.cue("levelUp"); note(`Nível ${level} alcançado. +${attributePoints - (current.attributePoints ?? 0)} atributos · +${talentPoints - (current.talentPoints ?? 0)} talento.`); toast.success(`Nível ${level}`, { description: "Abra o Grimório de Progressão para moldar Veyra." }); }); }
      return { ...current, xp, xpToNext: next, level, maxHp, maxMana, hp: maxHp, mana: maxMana, spellSlots: slots, attributes: current.attributes ?? initialAttributes, attributePoints, talentPoints, talents: current.talents ?? [], specialization: current.specialization ?? null };
    });
  }

  function investAttribute(attribute: NecromancerAttribute) {
    if ((player.attributePoints ?? 0) < 1) { note("Nenhum ponto de atributo disponível. Vença encontros para elevar o Necromante."); return; }
    setPlayer((current) => {
      const attributes = { ...initialAttributes, ...(current.attributes ?? {}), [attribute]: (current.attributes?.[attribute] ?? 0) + 1 };
      const next = { ...current, attributes, attributePoints: Math.max(0, (current.attributePoints ?? 0) - 1) };
      if (attribute === "vitality") { next.maxHp += 12; next.hp = Math.min(next.maxHp, next.hp + 12); }
      if (attribute === "intellect") { next.maxMana += 8; next.mana = Math.min(next.maxMana, next.mana + 8); }
      return next;
    });
    note(`${attributeMeta[attribute].name.toUpperCase()} recebeu um ponto: ${attributeMeta[attribute].effect}`);
  }

  function unlockTalent(tree: SpecializationTree, talent: NecromancerTalent) {
    if (!player.specialization) { note("Antes de despertar talentos, sele um juramento no Grimório."); return; }
    if ((player.talentPoints ?? 0) < 1) { note("Nenhum ponto de talento disponível. O próximo nível abrirá uma escolha."); return; }
    if (player.level < talent.requiredLevel) { note(`${talent.name} exige nível ${talent.requiredLevel}.`); return; }
    if (talents.includes(talent.id)) { note(`${talent.name} já está inscrito no grimório.`); return; }
    if (player.specialization && player.specialization !== tree.id) { note(`Veyra já jurou à trilha ${specializationTrees.find((item) => item.id === player.specialization)?.name}. Outra especialização foi selada.`); return; }
    const parent = tree.talents[talent.tier - 2];
    if (parent && !talents.includes(parent.id)) { note(`${talent.name} exige o talento anterior da árvore.`); return; }
    setPlayer((current) => ({ ...current, talents: [...(current.talents ?? []), talent.id], talentPoints: Math.max(0, (current.talentPoints ?? 0) - 1), specialization: current.specialization, maxMana: talent.id === "lich-reservoir" ? current.maxMana + 14 : current.maxMana, mana: talent.id === "lich-reservoir" ? Math.min(current.maxMana + 14, current.mana + 14) : current.mana }));
    note(`TALENTO DESPERTO: ${talent.name}. ${talent.effect}`); toast.success(talent.name, { description: `${tree.name} agora molda o destino de Veyra.` });
  }

  function chooseOath(tree: SpecializationTree) {
    if (player.specialization) { note(`O juramento ${currentOath?.name ?? "atual"} já foi selado. Esta campanha não permite reescrever a raiz.`); return; }
    setPlayer((current) => ({ ...current, specialization: tree.id }));
    note(`JURAMENTO SELADO: ${tree.name}. A maestria cresce a cada nível até o 70.`);
    toast.success("Juramento selado", { description: `${tree.name} agora guia a progressão contínua de Veyra.` });
  }

  function grantRegionalReward(completedEncounter: Encounter) {
    const reward = rewardForRegion(completedEncounter.regionId);
    if (!reward) return;
    const firstRegionClear = !player.relics.includes(reward.itemId);
    if (firstRegionClear) {
      grantXp(reward.xpBonus, "regional-relic", reward.name, "A primeira relíquia da região foi preservada no manuscrito.");
      setPlayer((current) => {
        const next = { ...current, relics: current.relics.includes(reward.itemId) ? current.relics : [...current.relics, reward.itemId], gold: current.gold + reward.firstClearGold };
        if (reward.itemId === "tide-heart") { next.maxMana += 8; next.mana = next.maxMana; }
        if (reward.itemId === "black-rose-corolla") next.power += 4;
        if (reward.itemId === "perigee-lens") next.spellSlots += 1;
        if (reward.itemId === "black-seal") { next.maxHp += 22; next.hp = next.maxHp; }
        return next;
      });
      setRelicDrop({ reward, encounterName: completedEncounter.name });
      soundscape.cue("relic");
    }
    if (firstRegionClear) {
      note(`Bônus de ${reward.name}: +${reward.xpBonus} XP · relíquia registrada · +${reward.firstClearGold} ouro.`);
      toast.success("Relíquia regional conquistada", { description: `${reward.name} · +${reward.xpBonus} XP` });
    }
  }

  function grantEncounterProgression(completedEncounter: Encounter) {
    if (clearedEncounters.includes(completedEncounter.id)) return;
    const bonus = firstEncounterXp(completedEncounter);
    setClearedEncounters((current) => current.includes(completedEncounter.id) ? current : [...current, completedEncounter.id]);
    grantXp(bonus, "first-encounter", completedEncounter.name, "Primeira vitória registrada: novas rotas e ameaças foram compreendidas.");
  }

  function isVeiled(enemy: Enemy) { return encounter.ruleKey === "veil" && enemy.trait.includes("Oculto") && !revealedIds.includes(enemy.id) && !environment.phase.revealEnemies; }
  function advanceEnvironment() {
    const next = readRegionalCycle(region.id, environmentActions + 1);
    setEnvironmentActions((current) => current + 1);
    if (next.phase.id !== environment.phase.id) {
      note(`AMBIENTE MUDA: ${next.phase.name}. ${next.phase.detail}`);
      if (next.phase.revealEnemies) setRevealedIds((current) => Array.from(new Set([...current, ...enemies.filter((enemy) => enemy.hp > 0).map((enemy) => enemy.id)])));
    }
  }

  function advanceBossArena(living: Enemy[]) {
    const boss = living.find((enemy) => enemy.boss && bossArenas[enemy.id]);
    const arena = boss ? bossArenas[boss.id] : undefined;
    if (!boss || !arena) return;
    const nightmareCeiling = arena.maxProgress + (cycleActive && newCycle.mode === "nightmare" && !arena.cyclic ? 2 : 0);
    const nextProgress = arena.cyclic ? (bossArenaProgress + 1) % arena.phases.length : Math.min(nightmareCeiling, bossArenaProgress + 1);
    const nightmareStage = !arena.cyclic && nextProgress > arena.maxProgress;
    const nextPhase = nightmareStage ? { ...arena.phases[arena.phases.length - 1], name: nextProgress === arena.maxProgress + 1 ? "Coroa do Pesadelo" : "Eclipse da Segunda Morte", detail: nextProgress === arena.maxProgress + 1 ? "A primeira fase adicional arrasta sombras de todas as mortes anteriores." : "A segunda fase adicional exige ruptura imediata ou a arena encerra a formação." } : arena.phases[arena.cyclic ? nextProgress % arena.phases.length : Math.min(nextProgress, arena.phases.length - 1)];
    setBossArenaProgress(nextProgress);
    soundscape.cue("bossPhase", boss.id);
    note(`ARENA MUDA: ${nextPhase.name}. ${nextPhase.detail}`);
    if (!arena.cyclic && nextProgress >= nightmareCeiling) {
      const source = `a arena · ${arena.title}`;
      if (boss.id === "warden") { applyIncomingDamage(18, source, "physical"); woundLegion(8, source); }
      if (boss.id === "tide-herald") { applyIncomingDamage(22, source, "ice"); woundLegion(12, source); }
      if (boss.id === "rose-matriarch") { applyIncomingDamage(16, source, "poison"); addPlayerStatus("bleed", 2); setEnemies((current) => current.map((enemy) => enemy.id === boss.id ? { ...enemy, hp: Math.min(enemy.maxHp, enemy.hp + 24) } : enemy)); }
      if (boss.id === "black-salt-hierophant") { applyIncomingDamage(20, source, "shadow"); woundLegion(10, source); }
      note(`PRESSÃO MÁXIMA: ${arena.title} completou seu ciclo. ${arena.counterplay}`);
    }
  }

  function beginPlayerAction() {
    if (paused || defeated || target.hp <= 0) return false;
    const lock = playerStatuses.find((status) => status.type === "stun" || status.type === "freeze");
    if (lock) { note(`${statusMeta[lock.type].label} impede Veyra de agir. A iniciativa foi perdida.`); setPlayerStatuses((current) => decayStatuses(current)); enemyTurn(liveEnemies, target.id); return false; }
    const damageOverTime = playerStatuses.reduce((total, status) => total + (["bleed", "burn", "corruption"].includes(status.type) ? (status.type === "burn" ? 6 : 4) * (status.stacks ?? 1) : 0), 0);
    if (damageOverTime > 0) {
      const hpAfterTick = Math.max(0, player.hp - damageOverTime);
      setPlayer((current) => ({ ...current, hp: Math.max(0, current.hp - damageOverTime) }));
      note(`Estados em Veyra causaram ${damageOverTime} de dano antes da ação.`);
      if (hpAfterTick === 0) { setDefeated(true); setPaused(true); return false; }
    }
    setPlayerStatuses((current) => decayStatuses(current));
    setCombatEngaged(true);
    return true;
  }

  function addPlayerStatus(status: StatusType, turns: number) {
    setPlayerStatuses((current) => addStatus(current, status, turns));
    note(`Veyra sofre ${statusMeta[status].label.toLowerCase()} por ${turns} rodada${turns === 1 ? "" : "s"}.`);
  }

  function woundLegion(totalDamage: number, source: string) {
    setPlayer((current) => {
      const standing = current.legion.filter((unit) => unit.hp > 0);
      if (!standing.length) return current;
      const damageEach = Math.max(1, Math.ceil(totalDamage / standing.length));
      const fallen: FallenServant[] = [];
      const survivors = current.legion.flatMap((unit) => {
        const guardReduction = unit.role === "guard" ? 3 : 0;
        const taken = Math.max(1, damageEach - guardReduction);
        const hp = Math.max(0, unit.hp - taken);
        if (hp > 0) return [{ ...unit, hp }];
        fallen.push({ ...unit, hp: 0, fallenAt: new Date().toISOString(), cause: source });
        return [];
      });
      if (fallen.length) queueMicrotask(() => { updateCombatRecord({ servantsFallen: fallen.length }); note(`${fallen.map((unit) => unit.name).join(" e ")} tombou diante de ${source}. A alma foi selada no Ossuário dos Caídos.`); toast.error("Servo perdido", { description: "Use Fragmentos de Alma para tentar reconstituir a criatura, aceitando a perda de atributos." }); });
      if (fallen.length && buildSynergyEffects.fallenArmyDamagePct) queueMicrotask(() => { const fury = fallen.length * buildSynergyEffects.fallenArmyDamagePct; setLegionFury((currentFury) => currentFury + fury); note(`COROA DA MULTIDÃO: a perda abriu +${fury}% dano de formação até o fim do encontro.`); });
      const fallManaPct = equipmentEffects.manaOnServantFallPct + buildSynergyEffects.manaOnServantFallPct;
      const manaRecovered = fallen.length && fallManaPct ? Math.ceil(current.maxMana * fallManaPct / 100) : 0;
      if (manaRecovered) queueMicrotask(() => note(`GRIMÓRIO DA ÚLTIMA ALMA: ${manaRecovered} de mana retornou quando a legião caiu.`));
      return { ...current, legion: survivors, army: survivors.map((unit) => unit.name), fallenServants: [...current.fallenServants, ...fallen], mana: Math.min(current.maxMana, current.mana + manaRecovered) };
    });
  }

  function awardLegionXp(enemy: Enemy) {
    const earned = Math.max(3, Math.floor(enemy.xp / 14));
    const fragments = (enemy.boss ? 14 : enemy.elite ? 5 : 2) + (hasTalent("soul-fragments") ? 1 : 0);
    setPlayer((current) => {
      const legion = current.legion.map((unit) => {
        let xp = unit.xp + earned, level = unit.level, stats = unit.stats, maxHp = unit.maxHp;
        while (xp >= level * 28) { xp -= level * 28; level += 1; stats = { guard: stats.guard + (unit.role === "guard" ? 1 : 0), damage: stats.damage + (unit.role === "assault" ? 1 : 0), sustain: stats.sustain + (unit.role === "support" ? 1 : 0), arcana: stats.arcana + (unit.role === "arcanist" ? 1 : 0) }; maxHp += 6; }
        return { ...unit, xp, level, stats, maxHp, hp: Math.min(maxHp, unit.hp + 2) };
      });
      return { ...current, legion, army: legion.map((unit) => unit.name), soulFragments: current.soulFragments + fragments };
    });
    note(`A legião absorveu ${earned} experiência funerária e ${fragments} Fragmentos de Alma.`);
  }

  function recruitServantFromEnemy(enemy: Enemy) {
    const lineageByEnemy: Record<string, string | undefined> = { "drowned-acolyte": "drowned-knight", "briar-sentinel": "thorn-sister" };
    const templateId = lineageByEnemy[enemy.id];
    if (!templateId) return;
    const template = servantTemplates.find((unit) => unit.id === templateId);
    if (!template) return;
    setPlayer((current) => {
      const alreadyKnown = [...current.legion, ...current.fallenServants].some((unit) => unit.templateId === templateId);
      const currentDominion = current.attributes?.dominion ?? 0;
      const currentLimit = 2 + Math.floor(current.level / 2) + currentDominion + (current.talents?.includes("bone-throng") ? 1 : 0);
      if (alreadyKnown || current.legion.length >= currentLimit) return current;
      const recruit = createServant(templateId, Math.max(1, current.level));
      queueMicrotask(() => { note(`VÍNCULO FORMADO: ${recruit.name} aceitou o selo de Veyra. A linhagem foi aberta no códice.`); toast.success("Novo servo", { description: `${recruit.name} entrou para a legião.` }); });
      const legion = [...current.legion, recruit];
      return { ...current, legion, army: legion.map((unit) => unit.name) };
    });
  }

  function evolveServant(servant: Servant) {
    const template = servantTemplates.find((item) => item.id === servant.templateId);
    const next: ServantEvolution | undefined = template?.evolutions[servant.evolutionStage];
    if (!next) { note(`${servant.name} não possui outra mutação disponível no códice.`); return; }
    if (servant.level < next.requiredLevel) { note(`${next.name} exige servo no nível ${next.requiredLevel}.`); return; }
    if (player.soulFragments < next.fragmentCost) { note(`${next.name} exige ${next.fragmentCost} Fragmentos de Alma.`); return; }
    setPlayer((current) => {
      const legion = current.legion.map((unit) => unit.uid === servant.uid ? { ...unit, name: next.name, evolutionStage: unit.evolutionStage + 1, stats: { ...next.stats }, passive: next.passive, active: { ...next.active }, art: next.art, maxHp: unit.maxHp + 18, hp: unit.maxHp + 18, stars: Math.min(5, unit.stars + 1) } : unit);
      return { ...current, legion, army: legion.map((unit) => unit.name), soulFragments: current.soulFragments - next.fragmentCost };
    });
    note(`EVOLUÇÃO: ${servant.name} aceitou ${next.name}. A forma anterior foi inscrita no osso.`); toast.success("Servo evoluído", { description: `${next.name} despertou com novas capacidades.` });
  }

  function resurrectFallenServant(servant: FallenServant) {
    if (cycleActive && newCycle.mode === "iron-soul") { note("FERRO-ALMA: a Cripta permanece fechada neste ciclo. Nomes tombados não podem ser reconstituídos."); toast.error("Ressurreição selada", { description: "Iron Soul impede o retorno de qualquer servo até o fim do ciclo." }); return; }
    const cost = Math.max(1, 5 + servant.stars * 3 + servant.evolutionStage * 4 - (hasTalent("soul-reweave") ? 4 : 0) - (currentOath?.id === "soul-master" ? Math.floor(oathRank / 14) : 0) - citadelLevels.altar - buildSynergyEffects.resurrectionCostReduction);
    if (legion.length >= armyLimit) { note("A formação está completa. Abra espaço antes de reconstruir outra alma."); return; }
    if (player.soulFragments < cost) { note(`${servant.name} exige ${cost} Fragmentos de Alma para retornar.`); return; }
    const recoveryRatio = Math.min(.98, (hasTalent("soul-reweave") ? .92 : .86) + (currentOath?.id === "soul-master" ? Math.min(.04, oathRank * .0006) : 0) + citadelLevels.altar * .01 + buildSynergyEffects.resurrectionRecoveryPct + doctrineCombat.resurrectionRecoveryPct);
    const degradedStats = { guard: Math.max(1, Math.floor(servant.stats.guard * recoveryRatio)), damage: Math.max(1, Math.floor(servant.stats.damage * recoveryRatio)), sustain: Math.max(0, Math.floor(servant.stats.sustain * recoveryRatio)), arcana: Math.max(0, Math.floor(servant.stats.arcana * recoveryRatio)) };
    const restored: Servant = { ...servant, uid: `${servant.uid}-returned-${Date.now()}`, level: Math.max(1, servant.level - 1), stats: degradedStats, maxHp: Math.max(18, Math.floor(servant.maxHp * recoveryRatio)), hp: Math.max(14, Math.floor(servant.maxHp * .48)), revivalDebt: servant.revivalDebt + 1, cooldown: 0 };
    setPlayer((current) => { const legion = [...current.legion, restored]; return { ...current, legion, army: legion.map((unit) => unit.name), fallenServants: current.fallenServants.filter((unit) => unit.uid !== servant.uid), soulFragments: current.soulFragments - cost }; });
    note(`RETORNO IMPERFEITO: ${servant.name} voltou com −${Math.round((1 - recoveryRatio) * 100)}% de atributos e uma cicatriz de alma.`); toast("Servo reconstituído", { description: `${servant.name} retorna enfraquecido, mas não esquecido.` });
  }

  function applyIncomingDamage(rawDamage: number, source: string, type: DamageType, defense: DefenseMove | null = null) {
    const corrupted = hasStatus(playerStatuses, "corruption") ? 1.12 : 1;
    if (defense === "evade" && Math.random() < 0.68) { note(`Esquiva ritual: ${source} passou por Veyra sem encontrar carne.`); setLastDefense(null); return; }
    const armyBlocked = Math.floor(rawDamage * (armyTactics.guard / 100));
    const defenseBlocked = defense === "block" ? Math.floor(rawDamage * .52) : 0;
    const earlyExpeditionMercy = player.level <= 2 ? .82 : 1;
    const taken = Math.max(1, Math.ceil((rawDamage - armyBlocked - defenseBlocked) * corrupted * earlyExpeditionMercy));
    updateCombatRecord({ playerDamageTaken: taken });
    setPlayer((current) => {
      const hp = Math.max(0, current.hp - taken);
      if (hp === 0) queueMicrotask(() => { setLastDefeatSource(source); setDefeated(true); setPaused(true); soundscape.cue("defeat"); toast.error("Veyra tombou", { description: "A formação não conseguiu segurar o retorno. Recuar preserva as relíquias." }); });
      return { ...current, hp };
    });
    note(`${source}: ${taken} dano ${damageMeta[type].label.toLowerCase()}${armyBlocked + defenseBlocked > 0 ? ` · ${armyBlocked + defenseBlocked} mitigado` : ""}.`);
    if (taken >= 6) woundLegion(Math.max(1, Math.floor(taken * .52)), source);
    setLastDefense(null);
    if (defense === "counter" && target.hp > 0) {
      const riposte = Math.max(8, Math.floor((player.power + attributeDamage) * .72 + armyTactics.damage * .45));
      setEnemies((current) => current.map((item) => item.id === target.id ? { ...item, hp: Math.max(0, item.hp - riposte), postureHp: Math.max(0, (item.postureHp ?? 0) - 14) } : item));
      note(`Contra-ataque da formação fere ${target.name} em ${riposte} e abala sua postura.`);
    }
  }

  function resolveTelegraph(enemy: Enemy, intent: NonNullable<Enemy["intent"]>, defense: DefenseMove | null = null) {
    applyIncomingDamage(Math.ceil(intent.damage * cycleDamageMultiplier), `${enemy.name} completa ${intent.name}`, intent.damageType, defense);
    if (intent.servantDamage) { woundLegion(intent.servantDamage, `${enemy.name} · ${intent.name}`); note(`A inundação alcança cada servo: ${intent.servantDamage} dano de formação e a guarda enfraquece.`); }
    if (intent.applies) addPlayerStatus(intent.applies, 2);
    setEnemies((current) => current.map((item) => item.id === enemy.id ? { ...item, intent: undefined, posture: "enraged", postureHp: item.maxPosture } : item));
  }

  function enemyTurn(living: Enemy[], focusId: string, defense: DefenseMove | null = null) {
    if (!living.length || defeated) return;
    updateCombatRecord({ rounds: 1 });
    advanceBossArena(living);
    const attackers: Enemy[] = [];
    living.forEach((enemy) => {
      if (hasStatus(enemy.statuses, "freeze") || hasStatus(enemy.statuses, "stun")) { note(`${enemy.name} perdeu o turno por ${hasStatus(enemy.statuses, "freeze") ? "congelamento" : "atordoamento"}.`); return; }
      if (enemy.intent) {
        if (enemy.intent.turnsLeft <= 1) { resolveTelegraph(enemy, enemy.intent, defense); return; }
        setEnemies((current) => current.map((item) => item.id === enemy.id && item.intent ? { ...item, intent: { ...item.intent, turnsLeft: item.intent.turnsLeft - 1 } } : item));
        note(`${enemy.name} mantém ${enemy.intent.name}. Restam ${enemy.intent.turnsLeft - 1} turno${enemy.intent.turnsLeft === 2 ? "" : "s"} para quebrar a postura.`);
        return;
      }
      if (enemy.telegraph && !enemy.telegraphUsed && enemy.hp <= enemy.maxHp * .9) {
        setEnemies((current) => current.map((item) => item.id === enemy.id && item.telegraph ? { ...item, intent: { ...item.telegraph }, telegraphUsed: true, posture: "channeling", postureHp: item.telegraph.postureToBreak } : item));
        note(`TELEGRÁFICO: ${enemy.name} começa ${enemy.telegraph.name}. ${enemy.telegraph.description} ${enemy.telegraph.turnsLeft} turnos.`);
        return;
      }
      attackers.push(enemy);
    });
    if (attackers.length) {
      const levelGap = Math.max(...attackers.map((item) => item.level)) - player.level;
      const threatScale = 1 + Math.min(.16, Math.max(0, levelGap) * .04);
      const doctrineCounts = attackers.reduce<Record<string, number>>((counts, item) => {
        const doctrine = enemyDoctrineFor(item).id;
        counts[doctrine] = (counts[doctrine] ?? 0) + 1;
        return counts;
      }, {});
      const rawDamage = attackers.reduce((total, item) => {
        const focusWeight = item.id === focusId ? 1 : .15;
        const thornBonus = item.trait.includes("Retaliação") ? (environment.phase.thornDamage ?? 0) : 0;
        const fearPenalty = hasStatus(item.statuses, "fear") ? .72 : 1;
        const postureBonus = item.posture === "enraged" ? 1.22 : item.posture === "vulnerable" ? .8 : 1;
        const arenaPressure = item.id === activeArenaBoss?.id && bossArena ? 1 + Math.min(nightmareExtraPhase ? .46 : .24, bossArenaProgress * .06) : 1;
        const doctrine = enemyDoctrineFor(item).id;
        const doctrinePressure = doctrine === "cultist" && doctrineCounts.cultist >= 2 ? 1.08 : doctrine === "undead" && doctrineCounts.undead >= 2 ? 1.06 : doctrine === "beast" && item.id === focusId ? 1.16 : 1;
        return total + Math.ceil((item.atk * focusWeight + thornBonus) * fearPenalty * postureBonus * arenaPressure * doctrinePressure);
      }, 0);
      const focusName = attackers.find((item) => item.id === focusId)?.name ?? attackers[0].name;
      const formationPressure = player.level <= 2 ? .72 : .86;
      applyIncomingDamage(Math.ceil(rawDamage * threatScale * formationPressure * cycleDamageMultiplier * (environment.phase.enemyDamageMultiplier ?? 1)), `${attackers.length} ameaça${attackers.length > 1 ? "s" : ""} contra-atacaram · foco: ${focusName}`, attackers[0].damageType ?? "physical", defense);
      const statusSource = attackers.find((enemy) => enemy.id === focusId) ?? attackers[0];
      const inflicted = statusSource.statusOnHit;
      const isControl = inflicted === "stun" || inflicted === "freeze";
      const statusChance = (isControl ? .16 : .38) + (enemyDoctrineFor(statusSource).id === "mage" ? .1 : 0);
      if (inflicted && !hasStatus(playerStatuses, inflicted) && Math.random() < statusChance) addPlayerStatus(inflicted, isControl ? 1 : 2);
      const activeDoctrines = Object.entries(doctrineCounts).filter(([, count]) => count >= 2).map(([id]) => id);
      if (activeDoctrines.length) note(`DOUTRINA ATIVA: ${activeDoctrines.map((id) => enemyDoctrineFor(attackers.find((item) => enemyDoctrineFor(item).id === id) ?? attackers[0]).title).join(" · ")}.`);
    }
    setEnemies((current) => current.map((enemy) => {
      if (!living.some((item) => item.id === enemy.id)) return enemy;
      const postureTurns = enemy.posture === "vulnerable" ? Math.max(0, (enemy.postureTurns ?? 1) - 1) : enemy.postureTurns;
      return { ...enemy, statuses: decayStatuses(enemy.statuses ?? []), posture: enemy.posture === "vulnerable" && postureTurns === 0 ? "neutral" : enemy.posture, postureTurns };
    }));
    setPlayer((current) => ({ ...current, legion: current.legion.map((unit) => ({ ...unit, cooldown: Math.max(0, (unit.cooldown ?? 0) - 1) })) }));
    advanceEnvironment();
  }

  function resolveDamage(enemy: Enemy, rawDamage: number, type: DamageType, appliesStatus?: StatusType, statusTurns = 0, skipEnemyTurn = false, postureBonus = 0) {
    if (isVeiled(enemy) && type === "physical") {
      applyIncomingDamage(enemy.atk, `${enemy.name} permaneceu oculto`, enemy.damageType ?? "shadow");
      note(`${enemy.name} existe apenas no canto do olho. A lâmina encontrou névoa.`);
      return;
    }
    if (type !== "physical" && isVeiled(enemy)) { setRevealedIds((current) => current.includes(enemy.id) ? current : [...current, enemy.id]); note(`${damageMeta[type].label} revela ${enemy.name} por trás do eclipse.`); }
    let multiplier = hasStatus(playerStatuses, "fear") ? .78 : 1;
    const modifiers: string[] = [];
    if (type === "physical") { multiplier *= 1 + attributes.power * .04 + (equipmentEffects.physicalDamagePct + buildSynergyEffects.physicalDamagePct + citadelLevels.forge * 3) / 100; if (attributes.power) modifiers.push(`poder +${attributes.power}`); if (equipmentEffects.physicalDamagePct || buildSynergyEffects.physicalDamagePct || citadelLevels.forge) modifiers.push(`forja e pacto +${equipmentEffects.physicalDamagePct + buildSynergyEffects.physicalDamagePct + citadelLevels.forge * 3}%`); }
    if (type !== "physical") { multiplier *= 1 + attributes.intellect * .025 + (equipmentEffects.ritualDamagePct + buildSynergyEffects.ritualDamagePct + citadelLevels.forge * 3) / 100; if (attributes.intellect) modifiers.push(`intelecto +${attributes.intellect}`); if (equipmentEffects.ritualDamagePct || buildSynergyEffects.ritualDamagePct || citadelLevels.forge) modifiers.push(`rito forjado e pacto +${equipmentEffects.ritualDamagePct + buildSynergyEffects.ritualDamagePct + citadelLevels.forge * 3}%`); }
    if (type === "shadow" && attributes.corruption) { multiplier *= 1 + attributes.corruption * .04; modifiers.push(`corrupção +${attributes.corruption}`); }
    if (currentOath?.id === "reaper" && type === "physical" && oathRank) { multiplier *= 1 + oathRank * .006; modifiers.push(`juramento da foice +${Math.round(oathRank * .6)}%`); }
    if (currentOath?.id === "lich" && type !== "physical" && oathRank) { multiplier *= 1 + oathRank * .004; modifiers.push(`juramento lich +${Math.round(oathRank * .4)}%`); }
    if (environment.phase.damageType === type && environment.phase.damageMultiplier) { multiplier *= environment.phase.damageMultiplier; modifiers.push(`${environment.phase.name.toLowerCase()} +${Math.round((environment.phase.damageMultiplier - 1) * 100)}%`); }
    if (enemy.weaknesses?.includes(type)) { multiplier *= 1.55; updateCombatRecord({ weaknessesExploited: 1 }); modifiers.push(`fraqueza a ${damageMeta[type].label.toLowerCase()}`); }
    if (enemy.resistances?.includes(type)) { multiplier *= .72; modifiers.push(`resistência a ${damageMeta[type].label.toLowerCase()}`); }
    const enemyDoctrine = enemyDoctrineFor(enemy);
    const livingDoctrineAllies = liveEnemies.filter((item) => item.hp > 0);
    if (enemyDoctrine.id !== "knight" && livingDoctrineAllies.some((item) => enemyDoctrineFor(item).id === "knight")) { multiplier *= .9; modifiers.push("cobertura de cavaleiro"); }
    if (enemyDoctrine.id === "undead" && livingDoctrineAllies.filter((item) => enemyDoctrineFor(item).id === "undead").length >= 2) { multiplier *= .91; modifiers.push("muralha de ossos"); }
    if (enemyDoctrine.id === "cultist" && livingDoctrineAllies.filter((item) => enemyDoctrineFor(item).id === "cultist").length >= 2) { multiplier *= .92; modifiers.push("coro de sangue"); }
    if (enemy.posture === "guarded") { multiplier *= .84; modifiers.push("postura protegida"); }
    if (enemy.posture === "vulnerable") { multiplier *= 1.45; modifiers.push("postura vulnerável"); }
    if (enemy.posture === "enraged") { multiplier *= 1.12; modifiers.push("fúria exposta"); }
    let comboBonus = 0;
    let comboPosture = 0;
    if (hasStatus(enemy.statuses, "freeze") && type === "fire") { comboBonus += 20; comboPosture += 10; modifiers.push("combinação degelo explosivo"); }
    if (hasStatus(enemy.statuses, "burn") && type === "poison") { comboBonus += 16; modifiers.push("combinação seiva cáustica"); }
    if (lastDamageType === "ice" && type === "physical") { comboBonus += 14; comboPosture += 18; modifiers.push("combinação quebra-gelo"); }
    if (lastDamageType === "holy" && type === "shadow") { comboBonus += 12; modifiers.push("combinação cisão ritual"); }
    if (hasTalent("bone-vanguard") && enemy.posture === "vulnerable") { comboBonus += 8; modifiers.push("vanguarda sepulcral"); }
    if (hasTalent("reaper-mark") && hasStatus(enemy.statuses, "bleed")) { multiplier *= 1.25; modifiers.push("marca da foice"); }
    if (hasTalent("reaper-execute") && enemy.hp <= enemy.maxHp * .35) { multiplier *= 1.3; modifiers.push("último corte"); }
    if (currentOath?.id === "reaper" && enemy.hp <= enemy.maxHp * .35 && oathRank >= 20) { comboBonus += oathRank >= 40 ? 30 : 12; modifiers.push("sentença do juramento"); }
    if (equipmentEffects.executeThreshold && enemy.hp <= enemy.maxHp * equipmentEffects.executeThreshold / 100) { multiplier *= 1.75; modifiers.push(`execução abaixo de ${equipmentEffects.executeThreshold}%`); }
    let damage = Math.max(1, Math.round(rawDamage * multiplier) + comboBonus);
    const executionEligible = (equipmentEffects.executeThreshold > 0 && enemy.hp <= enemy.maxHp * equipmentEffects.executeThreshold / 100) || (hasTalent("reaper-execute") && enemy.hp <= enemy.maxHp * .35) || (currentOath?.id === "reaper" && enemy.hp <= enemy.maxHp * .35 && oathRank >= 20);
    if (encounter.ruleKey === "siege" && enemy.boss && enemies.some((item) => item.elite && item.hp > 0)) {
      damage = Math.max(1, Math.floor(damage * .55));
      modifiers.push("selo protetor");
    }
    if (enemy.id === activeArenaBoss?.id && bossArena) {
      if (bossArena.bossId === "warden" && bossArenaProgress > 0) { damage = Math.max(1, Math.floor(damage * (1 - Math.min(.4, bossArenaProgress * .1)))); modifiers.push("mortalhas-escudo"); }
      if (bossArena.bossId === "black-salt-hierophant" && bossArenaProgress > 0) { damage = Math.max(1, Math.floor(damage * (1 - Math.min(.36, bossArenaProgress * .09)))); modifiers.push("cristais salinos"); }
      if (bossArena.bossId === "starved-astronomer" && arenaPhase?.name === "Coroa Morta") { damage = Math.max(1, Math.floor(damage * .82)); modifiers.push("coroa constelar"); }
    }
    const postureDamage = Math.max(5, Math.floor(rawDamage * (type === "physical" ? .5 : .34)) + postureBonus + comboPosture + (enemy.weaknesses?.includes(type) ? 7 : 0) + (environment.phase.postureBonus ?? 0) + equipmentEffects.postureDamage + buildSynergyEffects.postureDamage);
    const postureBroken = (enemy.postureHp ?? 0) > 0 && (enemy.postureHp ?? 0) - postureDamage <= 0;
    const hp = Math.max(0, enemy.hp - damage);
    const appliedTurns = appliesStatus ? statusTurns + (hasTalent("lich-malediction") ? 1 : 0) + (currentOath?.id === "lich" && type !== "physical" ? Math.floor(oathRank / 20) : 0) : statusTurns;
    const updatedEnemy: Enemy = { ...enemy, hp, statuses: appliesStatus ? addStatus(enemy.statuses, appliesStatus, appliedTurns) : enemy.statuses, posture: postureBroken ? "vulnerable" : enemy.posture, postureHp: postureBroken ? enemy.maxPosture : Math.max(0, (enemy.postureHp ?? 0) - postureDamage), postureTurns: postureBroken ? 2 : enemy.postureTurns, intent: postureBroken ? undefined : enemy.intent };
    setEnemies((current) => current.map((item) => item.id === enemy.id ? updatedEnemy : item));
    if (type === "physical" && environment.phase.thornDamage) applyIncomingDamage(environment.phase.thornDamage, `${environment.phase.name} responde aos golpes`, "poison");
    if (postureBroken) { updateCombatRecord({ posturesBroken: 1 }); note(`POSTURA QUEBRADA: ${enemy.name} está vulnerável por 2 rodadas${enemy.intent ? " e o ritual foi interrompido" : ""}.`); }
    if (postureBroken) soundscape.cue("critical", enemy.id);
    if (type !== "physical") soundscape.cue(type, enemy.id);
    if (appliesStatus) note(`${enemy.name} sofre ${statusMeta[appliesStatus].label.toLowerCase()} por ${appliedTurns} rodada${appliedTurns === 1 ? "" : "s"}.`);
    const corruptionMana = type !== "physical" && hasStatus(enemy.statuses, "corruption") ? buildSynergyEffects.manaOnCorruptionHit : 0;
    if (corruptionMana) { setPlayer((current) => ({ ...current, mana: Math.min(current.maxMana, current.mana + corruptionMana) })); note(`FILACTÉRIO CONTAMINADO: a corrupção devolveu ${corruptionMana} de mana ao rito.`); }
    setLastDamageType(type);
    if (hp > 0) {
      const remaining = enemies.map((item) => item.id === enemy.id ? updatedEnemy : item).filter((item) => item.hp > 0);
      note(`${enemy.name} recebeu ${damage} de dano ${damageMeta[type].label.toLowerCase()}${modifiers.length ? ` · ${modifiers.join(" · ")}` : ""}.`);
      if (!skipEnemyTurn) enemyTurn(remaining, enemy.id);
      return;
    }
    const shouldReturn = Boolean(environment.phase.raiseDead) && !revivedIds.includes(enemy.id);
    if (shouldReturn) {
      const revivedHp = Math.ceil(enemy.maxHp * .35);
      const revivedEnemy = { ...updatedEnemy, hp: revivedHp, posture: "neutral" as EnemyPosture, postureHp: enemy.maxPosture, statuses: [] };
      setRevivedIds((current) => [...current, enemy.id]);
      setEnemies((current) => current.map((item) => item.id === enemy.id ? revivedEnemy : item));
      note(`${enemy.name} voltou com a maré. Ainda restam ${revivedHp} pontos de vida.`);
      if (!skipEnemyTurn) enemyTurn(enemies.map((item) => item.id === enemy.id ? revivedEnemy : item).filter((item) => item.hp > 0), enemy.id);
      return;
    }
    setQuestProgress((current) => ({ ...current, [enemy.id]: (current[enemy.id] ?? 0) + 1 }));
    setBestiaryDefeats((current) => ({ ...current, [enemy.id]: (current[enemy.id] ?? 0) + 1 }));
    if (executionEligible) updateCombatRecord({ executions: 1 });
    soundscape.cue(enemy.boss ? "boss" : "death", enemy.id);
    if (enemy.boss) setCorpses((current) => current.includes(enemy.id) ? current : [...current, enemy.id]);
    const firstDefeat = !bestiaryDefeats[enemy.id];
    const earnedCombatXp = combatXp({ enemy, playerLevel: player.level, repeatCount: bestiaryDefeats[enemy.id] ?? 0, firstDefeat, libraryLevel: citadelLevels.library, cycleMultiplier: cycleXpMultiplier });
    grantXp(earnedCombatXp, "combat", enemy.name, `${firstDefeat ? "Primeiro registro" : "Reencontro"} · nível ${enemy.level} contra Veyra nível ${player.level}.`);
    awardLegionXp(enemy); recruitServantFromEnemy(enemy); const executionMana = executionEligible ? buildSynergyEffects.manaOnExecution : 0; if (executionMana) note(`SENTENÇA DE FERRO E OSSO: a execução devolveu ${executionMana} de mana.`); setPlayer((current) => { const harvestMana = hasTalent("reaper-harvest") ? 8 + (current.specialization === "reaper" ? Math.floor(Math.min(70, current.level) / 14) : 0) : 0; return { ...current, gold: current.gold + Math.round(((enemy.boss ? 75 : 12) + citadelLevels.garden * 8) * cycleGoldMultiplier), hp: hasTalent("reaper-harvest") ? Math.min(current.maxHp, current.hp + 14 + (current.specialization === "reaper" ? Math.floor(Math.min(70, current.level) / 14) : 0)) : current.hp, mana: Math.min(current.maxMana, current.mana + harvestMana + executionMana), soulFragments: current.soulFragments + Math.round(((hasTalent("soul-fragments") ? 1 : 0) + (current.specialization === "soul-master" ? Math.floor(Math.min(70, current.level) / 35) : 0) + (enemy.boss ? equipmentEffects.soulFragmentsOnBoss : 0)) * cycleFragmentMultiplier) }; });
    note(`${enemy.name} tombou. ${enemy.loot} aguarda entre os restos.`);
    if (enemy.boss) { const firstBossDefeat = !defeatedBossIds.includes(enemy.id); const drops = bossEquipmentDrops[enemy.id] ?? []; const cycleRelic = cycleActive && !newCycle.bossRelicsClaimed.includes(enemy.id) ? cycleBossRelicDrops[enemy.id] : undefined; if (drops.length || cycleRelic) setPlayer((current) => ({ ...current, equipment: Array.from(new Set([...current.equipment, ...drops, ...(cycleRelic ? [cycleRelic] : [])])) })); if (cycleRelic) setNewCycle((current) => ({ ...current, bossRelicsClaimed: [...current.bossRelicsClaimed, enemy.id] })); setDefeatedBossIds((current) => current.includes(enemy.id) ? current : [...current, enemy.id]); setQuestDone(true); if (firstBossDefeat) grantXp(Math.round(52 * cycleXpMultiplier), "mastery", `Coroa de ${enemy.name}`, "Uma alma coroada foi vencida pela primeira vez nesta expedição."); toast.success("Chefe derrotado", { description: cycleRelic ? `${enemy.name} deixou a relíquia de eco ${equipmentCatalog.find((item) => item.id === cycleRelic)?.name ?? "coroada"}.` : drops.length ? `${enemy.name} deixou ${drops.map((id) => equipmentCatalog.find((item) => item.id === id)?.name).join(" e ")}.` : `${enemy.name} pode ser ressuscitado na Necromancia.` }); }
    const remaining = enemies.map((item) => item.id === enemy.id ? { ...item, hp: 0 } : item).filter((item) => item.hp > 0);
    const encounterFinished = remaining.length === 0;
    if (!encounterFinished) {
      setTargetId(remaining[0]?.id ?? "");
      if (!skipEnemyTurn) enemyTurn(remaining, remaining[0]?.id ?? "");
    }
    if (encounterFinished) {
      const firstCompletion = !clearedEncounters.includes(encounter.id);
      advanceEnvironment();
      resolveTacticalVictory(encounter);
      if (firstCompletion) {
        grantEncounterProgression(encounter);
        const mastery = masteryXp(combatRecordRef.current.weaknessesExploited, combatRecordRef.current.posturesBroken, encounter);
        if (mastery) grantXp(mastery, "mastery", encounter.name, "Fraquezas e rupturas de postura foram transformadas em conhecimento de campo.");
      }
      grantRegionalReward(encounter);
      soundscape.cue("victory", activeArenaBoss?.id);
      setCombatEngaged(false);
    }
  }

  function strike() {
    if (!beginPlayerAction()) return;
    updateCombatRecord({ directStrikes: 1 });
    const damage = player.power + 6 + Math.floor(Math.random() * 10) + armyTactics.damage;
    note(`Ordem de ataque: ${armyCount} servo${armyCount === 1 ? "" : "s"} soma${armyCount === 1 ? "" : "m"} +${armyTactics.damage} dano e ${armyTactics.guard}% de guarda.`);
    playImpact("strike");
    resolveDamage(target, damage, "physical", "bleed", 2);
  }

  function defend(move: DefenseMove) {
    if (!beginPlayerAction()) return;
    setLastDefense(move);
    soundscape.cue(move === "block" ? "block" : move === "evade" ? "evade" : "counter");
    const copy = move === "block" ? "Veyra firma o bloqueio: 52% do próximo golpe será negado." : move === "evade" ? "Veyra prepara a esquiva ritual: 68% de evitar o próximo golpe." : "Veyra aguarda a brecha: sobreviver ao golpe devolverá dano e postura.";
    note(copy);
    enemyTurn(liveEnemies, target.id, move);
  }

  function useArenaAction() {
    if (!bossArena || !activeArenaBoss || !beginPlayerAction()) return;
    if (player.mana < bossArena.action.cost) { note(`${bossArena.action.label} exige ${bossArena.action.cost} de mana.`); return; }
    setPlayer((current) => ({ ...current, mana: current.mana - bossArena.action.cost }));
    updateCombatRecord({ arenaRites: 1 });
    const boss = activeArenaBoss;
    if (boss.id === "warden") {
      const next = Math.max(0, bossArenaProgress - 2); setBossArenaProgress(next); note("Mortalhas queimadas: dois escudos funerários viraram cinza."); resolveDamage(boss, 20 + ritualDamage, "fire", "burn", 1, true, 14);
    } else if (boss.id === "tide-herald") {
      const next = Math.max(0, bossArenaProgress - 2); setBossArenaProgress(next); note("O altar de maré rachou. A água recuou por duas marcas."); resolveDamage(boss, 22 + ritualDamage, "holy", "fear", 1, true, 18);
    } else if (boss.id === "rose-matriarch") {
      const next = Math.max(0, bossArenaProgress - 2); setBossArenaProgress(next); note("Duas raízes foram podadas antes de fecharem o círculo."); resolveDamage(boss, 24 + ritualDamage, "fire", "burn", 2, true, 20);
    } else if (boss.id === "starved-astronomer") {
      setBossArenaProgress((current) => (current + 1) % bossArena.phases.length); setEnemies((current) => current.map((enemy) => enemy.id === boss.id ? { ...enemy, posture: "vulnerable", postureTurns: 2, intent: undefined } : enemy)); note("A carta celeste se rasgou. A constelação perdeu o cálculo e o Astrônomo ficou vulnerável.");
    } else if (boss.id === "black-salt-hierophant") {
      if (bossArenaProgress > 0) { setBossArenaProgress((current) => Math.max(0, current - 1)); note("Um cristal de sal negro foi pulverizado. O selo enfraquece."); resolveDamage(boss, 18 + ritualDamage, "holy", "fear", 1, true, 16); }
      else { setPlayer((current) => ({ ...current, mana: Math.min(current.maxMana, current.mana + 14) })); setEnemies((current) => current.map((enemy) => enemy.id === boss.id ? { ...enemy, posture: "vulnerable", postureTurns: 2, intent: undefined } : enemy)); note("O resíduo salino foi canalizado contra o Hierofante: +14 mana e postura vulnerável."); }
    }
    playImpact("boss");
    enemyTurn(liveEnemies, boss.id);
  }

  function completeBossResurrection(corpse: Enemy) {
    if (resurrectionCompletionLock.current.has(corpse.id)) return;
    resurrectionCompletionLock.current.add(corpse.id);
    const raisedServant = createBossServant(corpse);
    setCorpses((current) => current.filter((id) => id !== corpse.id));
    setRaisedBossIds((current) => current.includes(corpse.id) ? current : [...current, corpse.id]);
    setCinematicSeenBossIds((current) => current.includes(corpse.id) ? current : [...current, corpse.id]);
    setPlayer((current) => {
      const nextLegion = current.legion.some((unit) => unit.bossId === corpse.id) ? current.legion : [...current.legion, raisedServant];
      return { ...current, mana: Math.max(0, current.mana - 18), legion: nextLegion, army: nextLegion.map((unit) => unit.name) };
    });
    setActiveResurrectionCinematic(null);
    setResurrectionFx({ id: Date.now(), boss: corpse });
    soundscape.cue("resurrection", corpse.id);
    const reaction = bossWorldReactionFor(corpse.id);
    if (reaction) {
      note(`O MUNDO RESPONDE: ${reaction.rumor} ${reaction.consequence}`);
      toast.success("Rumor inscrito no Atlas", { description: reaction.title });
    }
    note(`${corpse.name} respondeu ao selo. ${corpse.ability?.name ?? "Sua presença"} foi inscrita nos comandos.`);
    toast.success("Chefe ressuscitado", { description: `${corpse.name} agora serve à formação.` });
  }

  function cast(spell: SpellKey) {
    if (spell === "raise") {
      if (activeResurrectionCinematic) return;
      if (!canRaise) { note(player.army.length >= armyLimit ? "Seu exército atingiu o limite atual." : "Apenas chefes derrotados podem atravessar este ritual."); return; }
      if (player.mana < 18) { note("Mana insuficiente para costurar uma alma de chefe."); return; }
      const corpseId = bossCorpses[0]; const corpse = enemyCatalog.find((enemy) => enemy.id === corpseId);
      if (!corpse?.boss) { note("O rito recusou uma alma que não carrega uma coroa."); return; }
      if (!resurrectionCinematics[corpse.id]) { completeBossResurrection(corpse); return; }
      if (cinematicSeenBossIds.includes(corpse.id)) { completeBossResurrection(corpse); return; }
      setActiveResurrectionCinematic(corpse);
      soundscape.cue("resurrection", corpse.id);
      note(`O círculo se fecha sobre ${corpse.name}. A HUD foi selada até a alma cruzar o limiar.`);
      return;
    }
    const spells: Record<Exclude<SpellKey, "raise">, { cost: number; damage: number; type: DamageType; status?: StatusType; turns?: number; label: string; heal?: number; posture?: number }> = {
      lance: { cost: Math.max(5, 12 - oathManaDiscount - equipmentEffects.manaCostReduction - buildSynergyEffects.manaCostReduction), damage: player.power + 25 + ritualDamage + armyTactics.magic, type: "shadow", status: "curse", turns: 2, label: "Lança óssea" },
      ember: { cost: Math.max(5, 14 - oathManaDiscount - equipmentEffects.manaCostReduction - buildSynergyEffects.manaCostReduction), damage: player.power + 22 + ritualDamage + armyTactics.magic, type: "fire", status: "burn", turns: 2, label: "Brasa funerária" },
      frost: { cost: Math.max(5, 15 - oathManaDiscount - equipmentEffects.manaCostReduction - buildSynergyEffects.manaCostReduction), damage: player.power + 17 + ritualDamage + armyTactics.magic, type: "ice", status: "freeze", turns: 1, label: "Geada sepulcral", posture: 8 + (currentOath?.id === "lich" && oathRank >= 40 ? 12 : 0) },
      rot: { cost: Math.max(5, 16 - oathManaDiscount - equipmentEffects.manaCostReduction - buildSynergyEffects.manaCostReduction), damage: player.power + 15 + ritualDamage + armyTactics.magic, type: "poison", status: "corruption", turns: 3, label: "Peste de osso" },
      rite: { cost: Math.max(5, 18 - oathManaDiscount - equipmentEffects.manaCostReduction - buildSynergyEffects.manaCostReduction), damage: player.power + 21 + ritualDamage + armyTactics.magic, type: "holy", status: "fear", turns: 2, label: "Rito da vela branca", posture: 12 + (currentOath?.id === "lich" && oathRank >= 40 ? 12 : 0) },
      drain: { cost: Math.max(5, 16 - oathManaDiscount - equipmentEffects.manaCostReduction - buildSynergyEffects.manaCostReduction), damage: player.power + 9 + ritualDamage + armyTactics.magic, type: "shadow", label: "Drenar vida", heal: Math.floor((22 + armyTactics.sustain) * (1 + equipmentEffects.healingPct / 100)) },
      cataclysm: { cost: Math.max(14, (hasTalent("lich-cataclysm") ? 26 : 34) - oathManaDiscount - equipmentEffects.manaCostReduction - buildSynergyEffects.manaCostReduction), damage: player.power + 58 + ritualDamage + armyTactics.magic * 2, type: "shadow", status: "curse", turns: 3, label: "Cataclismo necroso", posture: (hasTalent("lich-cataclysm") ? 34 : 24) + (currentOath?.id === "lich" && oathRank >= 40 ? 12 : 0) },
      echo: { cost: Math.max(10, 24 - oathManaDiscount - equipmentEffects.manaCostReduction - buildSynergyEffects.manaCostReduction), damage: player.power + 38 + ritualDamage + armyTactics.magic * 2, type: "shadow", status: "curse", turns: 2, label: "Ressonância do ciclo", posture: 20 },
    };
    const action = spells[spell];
    if (spell === "echo" && !cycleActive) { note("A Ressonância do Ciclo só responde depois que a Coroa Negra inaugura um Novo Ciclo."); return; }
    if (!beginPlayerAction()) return;
    if (player.mana < action.cost) { note(`${action.label} exige ${action.cost} de mana. Guarde recursos ou escolha outro rito.`); return; }
    const lichCost = cycleActive && newCycle.mode === "lich" ? Math.ceil(action.cost * 1.28) : action.cost;
    if (player.mana < lichCost) { note(`${action.label} exige ${lichCost} de mana sob a fome do Filactério.`); return; }
    const adjustedHeal = action.heal ? Math.max(1, Math.floor(action.heal * (environment.phase.healingMultiplier ?? 1) * (cycleActive && newCycle.mode === "lich" ? .55 : 1))) : 0;
    setPlayer((current) => ({ ...current, mana: current.mana - lichCost, hp: adjustedHeal ? Math.min(current.maxHp, current.hp + adjustedHeal) : current.hp }));
    updateCombatRecord({ rituals: 1 });
    note(`${action.label}: ${action.damage} dano ${damageMeta[action.type].label.toLowerCase()} · +${armyTactics.magic} canalizado pela formação.`);
    playImpact(action.type === "shadow" && spell !== "lance" ? "drain" : "lance");
    soundscape.cue(action.type);
    resolveDamage(target, action.damage, action.type, action.status, action.turns, false, action.posture);
    if (adjustedHeal) note(`Vida drenada: ${action.damage} de dano e ${adjustedHeal} de cura com suporte da formação.`);
  }

  function useBossAbility(boss: Enemy, ability: BossAbility) {
    if (!beginPlayerAction()) return;
    if (player.mana < ability.cost) { note(`${ability.name} exige ${ability.cost} de mana.`); return; }
    const damage = ability.damage + Math.floor(armyTactics.magic * .5);
    const adjustedHeal = ability.heal ? Math.max(1, Math.floor(ability.heal * (environment.phase.healingMultiplier ?? 1))) : 0;
    setPlayer((current) => ({ ...current, mana: current.mana - ability.cost, hp: adjustedHeal ? Math.min(current.maxHp, current.hp + adjustedHeal) : current.hp }));
    updateCombatRecord({ bossOrders: 1 });
    note(`${boss.name} usa ${ability.name}: ${damage} dano ritual${adjustedHeal ? ` · +${adjustedHeal} vitalidade` : ""} · ${ability.effect}.`);
    toast.success(ability.name, { description: `${boss.name} obedeceu ao chamado.` });
    playImpact("boss");
    soundscape.cue(ability.damageType, boss.id);
    resolveDamage(target, damage, ability.damageType, ability.appliesStatus, ability.statusTurns, false, ability.kind === "break" ? 28 : 0);
  }

  function useServantAbility(servant: Servant) {
    const ability = servant.active;
    if (servant.cooldown && servant.cooldown > 0) { note(`${ability.name} ainda ecoa por ${servant.cooldown} rodada${servant.cooldown === 1 ? "" : "s"}.`); return; }
    if (!beginPlayerAction()) return;
    const abilityCost = Math.max(1, ability.cost - (hasTalent("soul-tribute") ? 2 : 0) - oathServantDiscount);
    if (player.mana < abilityCost) { note(`${ability.name} exige ${abilityCost} de mana.`); return; }
    const damage = Math.max(1, (ability.damage ?? 0) + servant.stats.damage * 3 + (servant.role === "arcanist" ? armyTactics.magic : 0));
    const heal = ability.heal ? Math.max(1, Math.floor((ability.heal + servant.stats.sustain * 2 + (hasTalent("soul-tribute") ? 6 : 0) + (currentOath?.id === "soul-master" ? Math.floor(oathRank / 5) : 0)) * (1 + buildSynergyEffects.servantAbilityHealPct / 100) * (environment.phase.healingMultiplier ?? 1))) : 0;
    setPlayer((current) => ({ ...current, mana: current.mana - abilityCost, hp: heal ? Math.min(current.maxHp, current.hp + heal) : current.hp, legion: current.legion.map((unit) => unit.uid === servant.uid ? { ...unit, cooldown: 3 } : unit) }));
    updateCombatRecord({ servantOrders: 1 });
    if (ability.kind === "reveal") setRevealedIds((current) => current.includes(target.id) ? current : [...current, target.id]);
    note(`${servant.name} usa ${ability.name}: ${damage} dano ${damageMeta[ability.damageType].label.toLowerCase()}${ability.kind === "break" ? " · ruptura de postura" : ""}${heal ? ` · +${heal} vitalidade` : ""} · ${abilityCost} mana.`);
    playImpact(servant.role === "support" ? "drain" : "boss");
    soundscape.cue("servant");
    soundscape.cue(ability.damageType);
    resolveDamage(target, damage, ability.damageType, ability.status, ability.turns, false, ability.kind === "break" ? 24 : 0);
  }

  function useLegionCombo(combo: LegionCombo) {
    if (!activeLegionCombos.some((available) => available.id === combo.id)) { note("A formação se desfez antes que o sigilo coletivo pudesse responder."); return; }
    if (!beginPlayerAction()) return;
    if (player.mana < combo.cost) { note(`${combo.name} exige ${combo.cost} de mana.`); return; }
    const damage = Math.max(1, combo.damage + Math.floor(armyTactics.damage * .58) + Math.floor(armyTactics.magic * .38));
    setPlayer((current) => ({ ...current, mana: current.mana - combo.cost }));
    updateCombatRecord({ servantOrders: 1 });
    note(`${combo.name}: ${damage} dano ${damageMeta[combo.type].label.toLowerCase()}${combo.status ? ` · ${statusMeta[combo.status].label.toLowerCase()}` : ""}${combo.posture ? ` · +${combo.posture} ruptura de postura` : ""} · ${combo.cost} mana.`);
    toast.success(combo.name, { description: "A legião respondeu como uma única vontade." });
    playImpact("boss");
    soundscape.cue("servant");
    soundscape.cue(combo.type);
    resolveDamage(target, damage, combo.type, combo.status, combo.turns, false, combo.posture ?? 0);
  }

  function cycleEnemies(encounterId: string, cycleState = newCycle): Enemy[] {
    return enemiesForEncounter(encounterId).map((enemy): Enemy => {
      if (cycleState.cycle <= 0) return enemy;
      const nightmareBoss = cycleState.mode === "nightmare" && enemy.boss;
      const maxHp = Math.ceil(enemy.maxHp * (1 + cycleState.cycle * .45 + (cycleState.mode === "nightmare" ? .25 : 0)));
      const maxPosture = Math.ceil((enemy.maxPosture ?? 40) * (1 + cycleState.cycle * .16 + (nightmareBoss ? .18 : 0)));
      return {
        ...enemy,
        level: enemy.level + cycleState.cycle + (nightmareBoss ? 1 : 0),
        maxHp,
        hp: maxHp,
        atk: Math.ceil(enemy.atk * (1 + cycleState.cycle * .12 + (nightmareBoss ? .12 : 0))),
        maxPosture,
        postureHp: maxPosture,
        trait: nightmareBoss ? `${enemy.trait} · Coroa do Pesadelo: duas fases adicionais aguardam.` : enemy.trait,
      };
    });
  }

  function beginNewCycle(mode: ChallengeModeId) {
    if (!campaignCompleted) { note("O Novo Ciclo exige que as cinco coroas do reino tenham sido derrotadas nesta expedição."); toast.error("Coroas pendentes", { description: "Conclua todos os chefes antes de reescrever o atlas." }); return; }
    const nextCycle: NewCycleState = { cycle: newCycle.cycle + 1, mode, completedCycles: newCycle.completedCycles + 1, bossRelicsClaimed: [] };
    const nextEncounter = encounters.find((item) => item.id === "ashen-patrol") ?? encounters[0];
    const nextEnemies = cycleEnemies(nextEncounter.id, nextCycle);
    setNewCycle(nextCycle); setSelectedRegion("ashen"); setEncounterId(nextEncounter.id); setEnemies(nextEnemies); setTargetId(nextEnemies[0]?.id ?? ""); setClearedEncounters([]); setDefeatedBossIds([]); setCorpses([]); setRoadEvent(null); setResolvedRoadEvents([]); setEventFlags((current) => current.filter((flag) => flag.startsWith("campaign-ending-"))); setEventHistory([]); setEnvironmentActions(0); setBossArenaProgress(0); setRevivedIds([]); setRevealedIds([]); resetCombatRecord(); setDefeated(false); setPaused(false); setCombatEngaged(false);
    setPlayer((current) => ({ ...current, hp: current.maxHp, mana: mode === "lich" ? Math.max(1, Math.floor(current.maxMana * .55)) : current.maxMana }));
    note(`NOVO CICLO ${nextCycle.cycle}: ${challengeModes.find((item) => item.id === mode)?.name.toUpperCase()} foi selado. A fronteira lembra suas mortes.`);
    toast.success("Atlas reescrito", { description: `${challengeModes.find((item) => item.id === mode)?.name} iniciou. Relíquias e eventos de eco despertaram.` });
    setTab("expedition");
  }

  function pursueCampaignAct(actId: CampaignActId) {
    const act = campaignActs.find((entry) => entry.id === actId);
    if (!act?.targetBossId) { setTab("quests"); return; }
    const boss = enemyCatalog.find((enemy) => enemy.id === act.targetBossId);
    setTab("map");
    note(`${act.numeral} marcado: ${boss?.name ?? act.title} mantém a próxima chave da campanha.`);
    toast(`${act.numeral} marcado`, { description: act.objective });
  }

  function chooseCampaignEnding(endingId: CampaignEndingId) {
    if (!Object.keys(cycleBossRelicDrops).every((bossId) => defeatedBossIds.includes(bossId))) return;
    const ending = campaignEndings.find((candidate) => candidate.id === endingId);
    if (!ending) return;
    setCampaignStory((current) => ({ ...current, endingId, kingdom: { ...current.kingdom, sovereignDoctrineId: ending.doctrineId } }));
    setEventFlags((current) => Array.from(new Set([...current.filter((flag) => !flag.startsWith("campaign-ending-")), `campaign-ending-${endingId}`])));
    const endingAct = campaignActs.find((act) => act.id === "reino");
    note(`A última sentença foi inscrita: ${ending.title}. ${ending.seal} agora define o reino.`);
    toast.success("O Reino dos Mortos foi sentenciado", { description: endingAct?.revelation ?? ending.consequence });
  }

  function commitRoute(route: ExplorationRoute) {
    const next = regions.find((item) => item.id === route.regionId);
    if (!next) return;
    const travelMemories = worldMemoriesForRegion(next.id, activeWorldMemoryIds);
    const encounterOverride = encounterOverrideForRegion(next.id, activeWorldMemoryIds);
    const routeEncounterIds = next.encounterIds.filter((id) => id !== "ashen-silence" && (!encounterOverride || id !== "ashen-patrol"));
    if (encounterOverride) routeEncounterIds.unshift(encounterOverride);
    const routeEncounters = routeEncounterIds.map((id) => encounters.find((item) => item.id === id)).filter((item): item is Encounter => Boolean(item));
    const optionalBoss = route.kind === "unknown" && Math.random() < route.optionalBossChance ? routeEncounters.find((item) => item.kind === "boss") : undefined;
    const nextEncounter = optionalBoss ?? routeEncounters.find((item) => route.preferredKinds.includes(item.kind)) ?? routeEncounters[0] ?? encounters[0];
    const firstPassage = !visitedRegions.includes(next.id);
    const firstRoute = !routeHistory.includes(route.id);
    const transit = travelMemories.reduce((total, memory) => ({ hp: total.hp + (memory.transit?.hp ?? 0), mana: total.mana + (memory.transit?.mana ?? 0), gold: total.gold + (memory.transit?.gold ?? 0), soulFragments: total.soulFragments + (memory.transit?.soulFragments ?? 0) }), { hp: 0, mana: 0, gold: 0, soulFragments: 0 });
    const eventChance = Math.max(0, Math.min(1, route.eventChance + travelMemories.reduce((total, memory) => total + (memory.eventChanceDelta ?? 0), 0)));
    const nextEnemies = cycleEnemies(nextEncounter.id).map((enemy) => ({ ...enemy, hp: Math.ceil(enemy.hp * route.enemyHpMultiplier), maxHp: Math.ceil(enemy.maxHp * route.enemyHpMultiplier), atk: Math.ceil(enemy.atk * route.enemyAttackMultiplier) }));
    setVisitedRegions((current) => current.includes(next.id) ? current : [...current, next.id]); setSelectedRegion(next.id); setEncounterId(nextEncounter.id); setEnemies(nextEnemies); setBestiarySightings((current) => nextEnemies.reduce<Record<string, number>>((records, enemy) => ({ ...records, [enemy.id]: (records[enemy.id] ?? 0) + 1 }), current)); setTargetId(nextEncounter.enemyIds[0]); setEnvironmentActions(0); setBossArenaProgress(0); setRevivedIds([]); setRevealedIds([]); setPendingRouteRegionId(null); resetCombatRecord(); setDefeated(false); setPaused(false); setCombatEngaged(false); setTab("expedition");
    if (firstRoute || transit.hp || transit.mana || transit.gold || transit.soulFragments) {
      if (firstRoute) setRouteHistory((current) => current.includes(route.id) ? current : [...current, route.id]);
      if (firstRoute) grantXp(route.xpBonus, "discovery", route.name, `${route.name} · ${route.reward}.`);
      setPlayer((current) => {
        let legion = current.legion;
        let fallenServants = current.fallenServants;
        const servantLost = firstRoute && route.kind === "cursed" && legion.length > 1 && Math.random() < .18;
        if (servantLost) {
          const fallen = legion[legion.length - 1];
          legion = legion.slice(0, -1);
          fallenServants = [...fallenServants, { ...fallen, cause: `perdido na ${route.name}`, fallenAt: new Date().toISOString() }];
          queueMicrotask(() => toast.error("Estrada cobrou um vínculo", { description: `${fallen.name} foi levado ao Ossuário dos Caídos.` }));
        }
        return { ...current, gold: current.gold + (firstRoute ? route.goldBonus : 0) + transit.gold, soulFragments: current.soulFragments + (firstRoute ? route.soulFragmentBonus : 0) + transit.soulFragments, hp: Math.min(current.maxHp, Math.max(1, current.hp - (firstRoute ? route.legionStrain : 0)) + transit.hp), mana: Math.min(current.maxMana, current.mana + transit.mana), legion, army: legion.map((unit) => unit.name), fallenServants };
      });
      if (firstRoute && route.kind === "unknown") setRouteRelicIds((current) => current.includes(route.id) ? current : [...current, route.id]);
      if (firstRoute && route.kind === "unknown") setEventFlags((current) => current.includes(`route-${route.id}`) ? current : [...current, `route-${route.id}`]);
    }
    if (firstPassage) { grantXp(discoveryXp(next), "discovery", next.name, "A primeira passagem revelou rotas, marcos e ameaças do território."); soundscape.cue("discovery"); }
    soundscape.cue(nextEnemies.some((enemy) => enemy.boss) ? "boss" : "ritual", nextEnemies.find((enemy) => enemy.boss)?.id);
    note(`${firstRoute ? "Rota inscrita" : "Rota retomada"}: ${route.name}. ${route.consequence}${travelMemories.length ? ` ${travelMemories.map((memory) => memory.title).join(" · ")} alterou esta passagem.` : ""}${optionalBoss ? " Um chefe opcional respondeu ao desvio." : ""}`);
    toast(route.seal, { description: `${route.name} · ${route.reward}` });
    window.setTimeout(() => { if (Math.random() < eventChance) drawRoadEvent(next.id); }, 260);
  }

  function chooseRegion(next: Region) {
    if (next.unlockAt > player.level) { note(`${next.name} permanece selada. Alcance o nível ${next.unlockAt}.`); return; }
    setPendingRouteRegionId(next.id);
    note(`Três estradas foram marcadas para ${next.name}. Escolha como a expedição atravessará o limiar.`);
  }

  function selectEncounter(next: Encounter) {
    setEncounterId(next.id); const nextEnemies = cycleEnemies(next.id); setEnemies(nextEnemies); setBestiarySightings((current) => nextEnemies.reduce<Record<string, number>>((records, enemy) => ({ ...records, [enemy.id]: (records[enemy.id] ?? 0) + 1 }), current)); setTargetId(nextEnemies[0]?.id ?? ""); setEnvironmentActions(0); setBossArenaProgress(0); setRevivedIds([]); setRevealedIds([]); resetCombatRecord(); setDefeated(false); setPaused(false); setCombatEngaged(false); soundscape.cue(nextEnemies.some((enemy) => enemy.boss) ? "boss" : "creature", nextEnemies.find((enemy) => enemy.boss)?.id); note(`Placa de encontro aberta: ${next.name}. ${next.rule}${cycleActive ? ` · Ciclo ${newCycle.cycle} amplificou a ameaça.` : ""}`);
  }

  function retreatFromDefeat() {
    const resetEnemies = cycleEnemies(encounter.id);
    setEnemies(resetEnemies); setTargetId(resetEnemies[0]?.id ?? ""); setEnvironmentActions(0); setBossArenaProgress(0); setRevivedIds([]); setRevealedIds([]); setCorpses([]); resetCombatRecord(); setDefeated(false); setPaused(false); setCombatEngaged(false);
    setPlayer((current) => ({ ...current, hp: Math.ceil(current.maxHp * 0.62), mana: Math.ceil(current.maxMana * 0.55), gold: Math.max(0, current.gold - 18), legion: current.legion.map((unit) => ({ ...unit, hp: Math.max(1, Math.ceil(unit.maxHp * .62)), cooldown: 0 })) }));
    note("Veyra recuou com uma ferida aberta. A próxima investida exigirá outra formação.");
    toast("Retirada registrada", { description: "Vitalidade e mana parcialmente restauradas; 18 ouro foram perdidos." });
  }

  function sideQuest() {
    if (!questDone) { note("A quest principal precisa ser concluída antes de desviar a rota."); return; }
    if (sideQuestDone || sideQuestLock.current) { note("Os três sinos já foram silenciados. A estrada não oferece a mesma recompensa duas vezes."); toast("Side quest registrada", { description: "Esta recompensa já foi recolhida neste ciclo." }); return; }
    sideQuestLock.current = true;
    setSideQuestDone(true);
    grantXp(20, "quest", "Três sinos silenciados", "Desvio opcional concluído sem repetir a recompensa."); soundscape.cue("quest"); setPlayer((current) => ({ ...current, gold: current.gold + 20 })); note("Side quest concluída: três sinos foram silenciados na estrada. A rota ficou mais quieta."); toast.success("Recompensa recebida", { description: "+20 XP · +20 ouro" });
  }

  function equipItem(itemId: string) {
    const item = equipmentCatalog.find((candidate) => candidate.id === itemId);
    if (!item || !player.equipment.includes(item.id)) return;
    setPlayer((current) => ({ ...current, equipped: { ...(current.equipped ?? {}), [item.slot]: item.id } }));
    note(`${item.name} foi equipado. ${item.effectText}`);
    toast.success("Loadout atualizado", { description: `${item.name} agora molda a próxima batalha.` });
  }

  function upgradeCitadel(building: CitadelBuilding) {
    const currentLevel = citadelLevels[building.id];
    if (currentLevel >= building.maxLevel) { note(`${building.name} já alcançou a maestria desta campanha.`); return; }
    const nextLevel = currentLevel + 1;
    const goldCost = building.baseGold * nextLevel;
    const soulCost = (building.baseSouls ?? 0) * Math.ceil(nextLevel / 2);
    if (player.gold < goldCost || player.soulFragments < soulCost) { note(`${building.name} exige ${goldCost} ouro${soulCost ? ` e ${soulCost} Fragmentos de Alma` : ""}.`); return; }
    setCitadel((current) => ({ buildings: { ...current.buildings, [building.id]: nextLevel } }));
    setPlayer((current) => ({ ...current, gold: current.gold - goldCost, soulFragments: current.soulFragments - soulCost, maxMana: building.id === "tower" ? current.maxMana + 5 : current.maxMana, mana: building.id === "tower" ? Math.min(current.maxMana + 5, current.mana + 5) : current.mana }));
    if (building.id === "library") setRevealedIds((current) => Array.from(new Set([...current, ...enemyCatalog.slice(0, nextLevel * 4).map((enemy) => enemy.id)])));
    note(`${building.name} alcançou o nível ${nextLevel}. ${building.benefit}`);
    toast.success("Cidadela fortalecida", { description: `${building.name} agora sustenta o reino de Veyra.` });
  }

  function consultCitadelNpc(npc: CitadelNpc) {
    if (player.level < npc.unlockAt) { note(`${npc.name} só responde quando Veyra alcançar o nível ${npc.unlockAt}.`); return; }
    const alreadyMet = citadelNpcProgress.metIds.includes(npc.id);
    if (!alreadyMet) setCitadelNpcProgress((current) => ({ ...current, metIds: [...current.metIds, npc.id] }));
    if (!alreadyMet) note(`${npc.name.toUpperCase()} foi inscrito entre os habitantes da Cidadela. ${npc.introduction}`);
    if (citadelNpcProgress.usedServiceIds.includes(npc.id)) { toast("Serviço já registrado", { description: `${npc.name} não repete o mesmo favor neste ciclo.` }); return; }
    const completeService = (message: string, description: string) => {
      setCitadelNpcProgress((current) => ({ ...current, usedServiceIds: current.usedServiceIds.includes(npc.id) ? current.usedServiceIds : [...current.usedServiceIds, npc.id] }));
      note(message); toast.success("Favor da Cidadela", { description });
    };
    if (npc.id === "cartographer") {
      const frontier = regions.find((item) => item.unlockAt <= player.level && !visitedRegions.includes(item.id) && !citadelNpcProgress.chartedRegionIds.includes(item.id));
      if (!frontier) { note("O Cartógrafo fecha a lente: não há fronteira acessível sem uma primeira passagem."); toast("Atlas completo por ora", { description: "Explore novas regiões ou suba de nível para criar outra margem." }); return; }
      setCitadelNpcProgress((current) => ({ ...current, usedServiceIds: [...current.usedServiceIds, npc.id], chartedRegionIds: [...current.chartedRegionIds, frontier.id] }));
      setSelectedRegion(frontier.id); setCitadelRoomId(null); setTab("map");
      note(`O Cartógrafo delineou ${frontier.name}. A região está revelada no Atlas, mas sua primeira passagem ainda precisa ser conquistada.`);
      toast.success("Fronteira delineada", { description: `${frontier.name} recebeu a marca de campo no Atlas.` }); return;
    }
    if (npc.id === "ash-merchant") {
      const itemId = "thorn-margin";
      if (player.equipment.includes(itemId)) { completeService("A Mercadora de Cinzas fecha o estojo: a Margem de Espinho Vivo já responde à sua mão.", "O estoque único já está no inventário."); return; }
      if (player.gold < 78) { note("A Mercadora de Cinzas devolve a bolsa: faltam 78 ouro para a Margem de Espinho Vivo."); toast.error("Ouro insuficiente", { description: "A peça continuará reservada até o próximo retorno." }); return; }
      setPlayer((current) => ({ ...current, gold: current.gold - 78, equipment: [...current.equipment, itemId] }));
      completeService("A Mercadora entregou a Margem de Espinho Vivo. A página se move como raiz ao redor de seus ritos.", "-78 ouro · Margem de Espinho Vivo adicionada ao Arsenal."); return;
    }
    if (npc.id === "mortuary-smith") {
      const itemId = "reaper-scythe";
      if (player.equipment.includes(itemId)) { completeService("O Ferreiro Mortuário toca a foice já pronta e a brasa azul se aquieta.", "A Foice do Carrasco já foi forjada."); return; }
      if (player.gold < 64 || player.soulFragments < 2) { note("O Ferreiro aponta a bigorna: a Foice do Carrasco exige 64 ouro e 2 Fragmentos de Alma."); toast.error("Material insuficiente", { description: "A forja preservará o molde até Veyra retornar." }); return; }
      setPlayer((current) => ({ ...current, gold: current.gold - 64, soulFragments: current.soulFragments - 2, equipment: [...current.equipment, itemId] }));
      completeService("A Foice do Carrasco foi martelada no silêncio. Sua borda agora procura sentenças incompletas.", "-64 ouro · -2 Fragmentos · Foice do Carrasco adicionada."); return;
    }
    if (npc.id === "exiled-priestess") {
      if (player.soulFragments < 1) { note("A Sacerdotisa Exilada recusa a vigília: um Fragmento de Alma ainda é necessário para acender a graça ferida."); toast.error("Fragmento ausente", { description: "Retorne ao altar quando houver uma alma para converter." }); return; }
      setPlayer((current) => ({ ...current, soulFragments: current.soulFragments - 1, hp: Math.min(current.maxHp, current.hp + 26), mana: Math.min(current.maxMana, current.mana + 34) }));
      completeService("A Sacerdotisa Exilada vira o sol enterrado. A graça devolve fôlego sem absolver a necromante.", "-1 Fragmento · +26 vitalidade · +34 mana."); return;
    }
    grantXp(32, "discovery", "Carta da Casa Antiga", "O Servo Antigo abriu uma memória de Veyra sem pedir que ela fosse perdoada.");
    setPlayer((current) => ({ ...current, attributePoints: current.attributePoints + 1 }));
    completeService("O Servo Antigo entregou a chave e a carta. Uma verdade sobre a casa antiga agora reforça a vontade de Veyra.", "+32 XP de descoberta · +1 ponto de atributo.");
  }

  function drawRoadEvent(regionId = region.id) {
    if (roadEvent) return;
    const candidates = [...roadEvents, ...(cycleActive ? newCycleRoadEvents : [])].filter((event) => !resolvedRoadEvents.includes(event.id)
      && (event.regionIds === "all" || event.regionIds.includes(regionId))
      && (event.requiresFlags ?? []).every((flag) => eventFlags.includes(flag))
      && (event.requiresRaisedBossIds ?? []).every((bossId) => raisedBossIds.includes(bossId))
      && !(event.excludeFlags ?? []).some((flag) => eventFlags.includes(flag)));
    if (!candidates.length) { note("A estrada ficou silenciosa. Nenhum novo presságio respondeu ao sigilo."); return; }
    const cultEvent = candidates.find((event) => event.id.startsWith("veiled-cult-"));
    const sovereignRumor = candidates.find((event) => event.id.startsWith("boss-rumor-"));
    const servantLegacy = candidates.find((event) => event.id.startsWith("servant-legacy-"));
    const legionConfrontation = candidates.find((event) => event.id.startsWith("legion-bond-"));
    const selected = cultEvent ?? sovereignRumor ?? servantLegacy ?? legionConfrontation ?? candidates[Math.floor(Math.random() * candidates.length)];
    setRoadEvent(selected);
    soundscape.cue("roadEvent");
    note(`PRESSÁGIO DE ESTRADA: ${selected.title.toUpperCase()}. Uma decisão aguarda.`);
  }

  function resolveRoadEvent(event: RoadEvent, choice: RoadEventChoice) {
    const effect = choice.effect;
    const doctrineId = doctrineFromRoadDecision(event.id, choice.label);
    setCampaignStory((current) => ({ ...current, kingdom: inscribeDoctrineDecision(current.kingdom, `${event.id}:${choice.id}`, doctrineId) }));
    const canBindServant = Boolean(effect.servantTemplateId && player.legion.length < armyLimit);
    setPlayer((current) => {
      const nextLegion = effect.servantTemplateId && current.legion.length < armyLimit
        ? [...current.legion, createServant(effect.servantTemplateId, Math.max(1, current.level))]
        : current.legion;
      const equipment = effect.equipment && !current.equipment.includes(effect.equipment) ? [...current.equipment, effect.equipment] : current.equipment;
      return { ...current, gold: Math.max(0, current.gold + (effect.gold ?? 0)), hp: Math.min(current.maxHp, Math.max(1, current.hp + (effect.hp ?? 0))), mana: Math.min(current.maxMana, Math.max(0, current.mana + (effect.mana ?? 0))), soulFragments: Math.max(0, current.soulFragments + (effect.soulFragments ?? 0)), equipment, legion: nextLegion, army: nextLegion.map((unit) => unit.name) };
    });
    if (effect.xp) grantXp(effect.xp, "road-event", event.title, "Escolha única de estrada registrada no atlas.");
    if (effect.setFlag) setEventFlags((current) => current.includes(effect.setFlag!) ? current : [...current, effect.setFlag!]);
    const doctrine = doctrineById(doctrineId);
    if (!campaignStory.kingdom.markedDecisionIds.includes(`${event.id}:${choice.id}`)) note(`A escolha inclinou o reino para ${doctrine?.title ?? "uma coroa ainda sem nome"}.`);
    if (effect.bondDeltas) setLegionBonds((current) => applyBondDeltas(current, effect.bondDeltas));
    setResolvedRoadEvents((current) => current.includes(event.id) ? current : [...current, event.id]);
    const result = `${event.title}: ${choice.label}. ${choice.consequence}${effect.servantTemplateId && !canBindServant ? " A legião estava cheia; o vínculo virou Fragmentos de Alma." : ""}`;
    setEventHistory((current) => [result, ...current].slice(0, 8));
    note(result);
    soundscape.cue(effect.servantTemplateId && canBindServant ? "servant" : "roadEvent");
    toast.success("Decisão registrada", { description: effect.servantTemplateId && canBindServant ? "Um novo vínculo entrou na legião." : choice.consequence });
    if (effect.servantTemplateId && !canBindServant) setPlayer((current) => ({ ...current, soulFragments: current.soulFragments + 3 }));
    setRoadEvent(null);
  }

  const nav = [
    ["expedition", "Expedição", Target, "campo"], ["map", "Mapa", Map, `${unlocked}/${regions.length}`], ["citadel", "Cidadela", Crown, `nível ${citadelTotalLevel}`], ["necromancy", "Necromancia", Skull, `${player.army.length} servos`], ["bestiary", "Bestiário", BookOpen, `${bestiaryKnownCount}/${enemyCatalog.length}`], ["grimoire", "Grimório", BookOpen, `${player.spellSlots} espaços`], ["inventory", "Inventário", Archive, `${player.gold} ouro`], ["quests", "Diário", ScrollText, `${completedSecondaryQuestIds.length}/${secondaryQuests.length}`], ["cycle", "Novo Ciclo", Crown, cycleActive ? `ciclo ${newCycle.cycle}` : "selado"],
  ] as const;

  return <main className={`game-shell ${activeResurrectionCinematic ? "is-cinematic-active" : ""}`}><div className="grain" />
    {activeResurrectionCinematic && activeCinematicConfig && <ResurrectionCinematic cinematic={activeCinematicConfig} onComplete={() => completeBossResurrection(activeResurrectionCinematic)} />}
    <aside className="sidebar"><div className="brand-lockup"><img className="brand-sigil" src={assets.sigil} alt="Sigilo de Necromancer Realms" /><div><span className="eyebrow">DIÁRIO DE CAMPO</span><strong>NECROMANCER<br /><em>REALMS</em></strong></div></div><div className="sidebar-rule" /><div className="nav-caption">NAVEGAÇÃO</div><nav className="game-nav" aria-label="Navegação do jogo">{nav.map(([id, label, Icon, hint]) => <button key={id} className={`nav-item ${tab === id ? "active" : ""}`} onClick={() => { soundscape.cue("ui"); setTab(id); }}><Icon size={17} /><span>{label}</span><small>{hint}</small>{tab === id && <img className="nav-sigil" src={assets.sigil} alt="" />}</button>)}</nav><div className="sidebar-spacer" /><div className="sidebar-note"><span className="stamp">ATLAS 01</span><p>“O corpo caiu.<br />A ordem permanece.”</p><span>— Fragmento do Voto de Sal</span></div><button className="help-button" onClick={() => { soundscape.cue("ui"); setHelp(true); }}><CircleDot size={14} /> Como jogar <span>?</span></button></aside>
    <section className="main-stage"><header className="topbar"><div className="mobile-brand"><img src={assets.sigil} alt="" /><strong>NECROMANCER REALMS</strong></div><div className="breadcrumb"><span>EXPEDIÇÃO 01</span><ChevronRight size={13} /><b>{region.name}</b><ChevronRight size={13} /><span>{region.landmark}</span></div><div className="top-actions"><details className={`soundscape-strip ${muted ? "is-muted" : ""} ${soundscape.unlocked ? "" : "is-locked"}`}><summary onPointerDown={() => { void soundscape.unlock(); }} onKeyDown={() => { void soundscape.unlock(); }} title={soundscape.unlocked ? `Ambiência: ${soundscape.profile.detail}` : "Toque aqui para despertar a ambiência"}><span className="soundscape-mark"><Volume2 size={13} /></span><div className="soundscape-reading"><small>{soundscape.unlocked ? `CENA · ${soundscape.scene.toUpperCase()}` : "TOQUE PARA DESPERTAR O SOM"}</small><strong>{muted ? "Selo de silêncio" : soundscape.profile.name}</strong></div><span className="soundscape-expand">MIX</span></summary><div className="soundscape-mixer" onClick={(event) => event.stopPropagation()}><label>Mestre <input aria-label="Volume mestre" type="range" min="0" max="1" step="0.05" value={soundVolume} onPointerDown={() => { void soundscape.unlock(); }} onChange={(event) => setSoundVolume(Number(event.target.value))} /></label><label>Música <input aria-label="Volume da música" type="range" min="0" max="1" step="0.05" value={musicVolume} onPointerDown={() => { void soundscape.unlock(); }} onChange={(event) => setMusicVolume(Number(event.target.value))} /></label><label>Ambiente <input aria-label="Volume do ambiente" type="range" min="0" max="1" step="0.05" value={ambienceVolume} onPointerDown={() => { void soundscape.unlock(); }} onChange={(event) => setAmbienceVolume(Number(event.target.value))} /></label><label>Efeitos <input aria-label="Volume dos efeitos" type="range" min="0" max="1" step="0.05" value={effectsVolume} onPointerDown={() => { void soundscape.unlock(); }} onChange={(event) => setEffectsVolume(Number(event.target.value))} /></label><label>Interface <input aria-label="Volume da interface" type="range" min="0" max="1" step="0.05" value={interfaceVolume} onPointerDown={() => { void soundscape.unlock(); }} onChange={(event) => setInterfaceVolume(Number(event.target.value))} /></label></div></details><button className="icon-button" onClick={() => { void soundscape.unlock(); soundscape.cue("ui"); setMuted(!muted); }} title={muted ? "Ativar som" : "Silenciar"} aria-label={muted ? "Ativar som" : "Silenciar"}><Volume2 size={16} /></button><button className="icon-button" onClick={() => { void soundscape.unlock(); soundscape.cue("ui"); setPaused(!paused); }} title={paused ? "Retomar" : "Pausar"}>{paused ? <Play size={16} /> : <Pause size={16} />}</button><button className="save-button" onClick={() => { void soundscape.unlock(); soundscape.cue("ui"); save(); }}><Save size={15} /><span>Salvar</span></button></div></header>
      <div className={`content-scroll manuscript-page page-${tab}`} key={tab}><section className="player-strip"><div className="player-identity"><div className="avatar-frame"><img src={assets.sigil} alt="" /></div><div><span className="eyebrow">NECROMANTE ERRANTE</span><h1>Veyra, a Insepulta</h1><div className="level-line"><span className="level-badge">NV. {player.level}</span><span>{currentOath ? `${currentOath.name} · Juramento Nv. ${oathRank}/70` : "Juramento não selado · Abra o Grimório"}</span></div></div></div><Resource label="VITALIDADE" value={player.hp} max={player.maxHp} kind="hp" icon={<Heart size={13} />} /><Resource label="MANA" value={player.mana} max={player.maxMana} kind="mana" icon={<Zap size={13} />} /><div className="xp-group"><div className="resource-row"><span className="resource-label">PROGRESSÃO</span><strong>{xpLabel(player)} XP</strong></div><div className="bar xp-bar"><span className="bar-fill xp-fill" style={{ width: `${xpProgress}%` }} /></div><div className="next-unlock"><Sparkles size={12} /> {player.level >= 70 ? "Maestria do juramento alcançada" : player.level < 2 ? "Próximo: espaço de feitiço" : "Novos territórios à vista"}</div></div><div className="currency"><span>OURO</span><strong>{player.gold.toString().padStart(3, "0")}</strong><small>✦</small></div></section>
      {paused && <div className="pause-banner"><Pause size={16} /> EXPEDIÇÃO PAUSADA <button onClick={() => setPaused(false)}>Retomar</button></div>}
      {tab === "expedition" && <RegionalCycleDossier environment={environment} />}
      {tab === "expedition" && <><TacticalCommandDeck target={target} player={player} playerStatuses={playerStatuses} lastDamageType={lastDamageType} disabled={paused || defeated || target.hp <= 0} strike={strike} defend={defend} cast={cast} legion={legion} bosses={raisedBosses} combos={activeLegionCombos} useServantAbility={useServantAbility} useBossAbility={useBossAbility} useLegionCombo={useLegionCombo} bossArena={bossArena} arenaPhase={arenaPhase} arenaProgress={bossArenaProgress} useArenaAction={useArenaAction} /><WorldMemoryStrip memories={regionMemories} /><CultPresenceStrip faction={cultFaction} present={cultPresentHere} /><BossRumorStrip rumors={bossRumorsHere} /><Expedition region={region} encounter={encounter} encounterOptions={regionEncounters} target={target} enemies={enemies} log={log} pulse={pulse} setTargetId={setTargetId} strike={strike} cast={cast} setTab={setTab} assets={assets} WeatherIcon={WeatherIcon} selectEncounter={selectEncounter} revealedIds={revealedIds} regionalReward={regionalReward} regionRelicOwned={regionRelicOwned} encounterCleared={encounterCleared} drawRoadEvent={drawRoadEvent} eventHistory={eventHistory} /><BestiaryStrip enemies={enemies} /></>}
      {tab === "map" && <MapView region={region} selectedRegion={selectedRegion} player={player} unlocked={unlocked} visitedRegions={visitedRegions} chartedRegionIds={citadelNpcProgress.chartedRegionIds} clearedEncounters={clearedEncounters} relicIds={player.relics} chooseRegion={chooseRegion} pendingRouteRegionId={pendingRouteRegionId} routeHistory={routeHistory} routeRelicIds={routeRelicIds} commitRoute={commitRoute} worldMemoryIds={activeWorldMemoryIds} cultFaction={cultFaction} bossReactions={bossReactions} setTab={setTab} />}
      {tab === "citadel" && <Citadel citadel={citadel} player={player} totalLevel={citadelTotalLevel} bestiaryKnownCount={bestiaryKnownCount} doctrine={dominantDoctrine} npcProgress={citadelNpcProgress} onNpcService={consultCitadelNpc} selectedRoomId={citadelRoomId} openRoom={setCitadelRoomId} closeRoom={() => setCitadelRoomId(null)} upgradeCitadel={upgradeCitadel} returnToField={() => { setCitadelRoomId(null); setTab("expedition"); }} navigateTo={(nextTab) => { setCitadelRoomId(null); setTab(nextTab); }} />}
      {tab === "necromancy" && <><BuildSynergyLedger activeSynergies={activeBuildSynergies} specialization={player.specialization} placement="necromancy" /><ServantMemoryLedger records={personalServantRecords} /><LegionBondLedger legion={legion} bonds={legionBonds} /><LegionComboPanel legion={legion} bosses={raisedBosses} combos={activeLegionCombos} /><LegionCodex player={player} bossCorpses={bossCorpses} canRaise={canRaise} cast={cast} armyLimit={armyLimit} note={note} tactics={armyTactics} defeatedBossIds={defeatedBossIds} raisedBossIds={raisedBossIds} evolveServant={evolveServant} resurrectFallenServant={resurrectFallenServant} /></>}
      {tab === "bestiary" && <BestiaryCodex sightings={bestiarySightings} defeats={bestiaryDefeats} completedIds={completedBestiaryIds} knownCount={bestiaryKnownCount} returnToField={() => setTab("expedition")} />}
      {tab === "grimoire" && <><ProgressionGrimoire player={player} investAttribute={investAttribute} chooseOath={chooseOath} unlockTalent={unlockTalent} enterExpedition={() => setTab("expedition")} xpLedger={xpLedger} /><BuildSynergyLedger activeSynergies={activeBuildSynergies} specialization={player.specialization} placement="grimoire" /></>}
      {tab === "inventory" && <><ItemGallery player={player} /><Inventory player={player} equipItem={equipItem} /></>}
      {tab === "quests" && <FieldJournal questDone={questDone} sideQuestDone={sideQuestDone} setTab={setTab} setTargetId={setTargetId} note={note} sideQuest={sideQuest} snapshot={secondaryQuestSnapshot} completedSecondaryQuestIds={completedSecondaryQuestIds} worldMemories={worldMemoryCatalog.filter((memory) => activeWorldMemoryIds.includes(memory.id))} cultFaction={cultFaction} bossReactions={bossReactions} servantMemoryRecords={personalServantRecords} legionBondRecords={legionBondRecords} campaignActs={campaignActs} campaignEndingId={campaignStory.endingId} kingdomDoctrineState={campaignStory.kingdom} onPursueCampaignAct={pursueCampaignAct} onChooseCampaignEnding={chooseCampaignEnding} />}
      {tab === "cycle" && <NewCycleLedger newCycle={newCycle} campaignCompleted={campaignCompleted} endingId={campaignStory.endingId} beginNewCycle={beginNewCycle} defeatedBossIds={defeatedBossIds} returnToField={() => setTab("expedition")} />}
      </div></section>
    {help && <div className="modal-backdrop" onClick={() => setHelp(false)}><div className="help-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setHelp(false)}><X size={18} /></button><span className="eyebrow violet">NOTAS DO PRIMEIRO RITUAL</span><h2>Como jogar</h2><p>Marque um inimigo na Expedição, ataque ou use um feitiço. Ao derrotar um <strong>chefe</strong>, abra a Necromancia para ressuscitá-lo e usar a habilidade exclusiva dele no campo.</p><div className="help-steps"><HelpStep n="01" title="Explore" text="Abra regiões pelo nível e escolha a próxima rota no Mapa." /><HelpStep n="02" title="Confronte" text="Cada encontro tem uma regra. Leia a placa antes de gastar mana." /><HelpStep n="03" title="Ressuscite chefes" text="Somente chefes derrotados atravessam o ritual e entram na barra de comandos." /></div><div className="modal-actions"><button className="ghost-button" onClick={reset}><RefreshCw size={14} /> Restaurar ciclo</button><button className="primary-button" onClick={() => setHelp(false)}>Entendi <ChevronRight size={14} /></button></div></div></div>}
    {combatFx && <CombatImpact effect={combatFx} />}
    {resurrectionFx && <ResurrectionRitual boss={resurrectionFx.boss} onClose={() => setResurrectionFx(null)} />}
    {relicDrop && <RelicDrop reward={relicDrop.reward} encounterName={relicDrop.encounterName} onClose={() => setRelicDrop(null)} onInventory={() => { setRelicDrop(null); setTab("inventory"); }} />}
    {roadEvent && <RoadEventOverlay event={roadEvent} onChoose={(choice) => resolveRoadEvent(roadEvent, choice)} onLeave={() => { note(`Você deixou ${roadEvent.title.toLowerCase()} para trás. A estrada guardará a cena, mas não a consequência.`); setRoadEvent(null); }} />}
    {tacticalVerdict && <CombatVerdictOverlay verdict={tacticalVerdict} onClose={() => setTacticalVerdict(null)} />}
    {defeated && <div className="defeat-backdrop" role="alertdialog" aria-modal="true" aria-labelledby="defeat-title"><div className="defeat-modal"><span className="eyebrow amber"><Skull size={12} /> FORMAÇÃO ROMPIDA</span><h2 id="defeat-title">O osso cedeu.</h2><p>As ameaças atravessaram a linha. Recuar preserva as relíquias, mas custa vitalidade, mana e ouro.</p><div className="defeat-verdict-line"><b>ÚLTIMA RUPTURA:</b> {lastDefeatSource}. {combatRecord.servantsFallen ? `${combatRecord.servantsFallen} servo${combatRecord.servantsFallen === 1 ? " tombou" : "s tombaram"} nesta investida.` : "A formação ainda aguardava sua primeira queda."}</div><div className="defeat-stats"><span><strong>{armyCount}</strong><small>servos em campo</small></span><span><strong>{armyTactics.guard}%</strong><small>guarda absorvida</small></span><span><strong>18</strong><small>ouro perdido</small></span></div><button className="primary-button" onClick={retreatFromDefeat}><RefreshCw size={15} /> Recuar e recompor</button></div></div>}
    <div className="quick-save"><button onClick={save} title="Salvar progresso"><Save size={15} /></button><button onClick={reset} title="Recomeçar expedição"><RefreshCw size={15} /></button></div>
  </main>;
}

function FlameIcon(props: { size?: number }) { return <Sparkles {...props} />; }
function Resource({ label, value, max, kind, icon }: { label: string; value: number; max: number; kind: string; icon: React.ReactNode }) { return <div className="resource-group"><div className="resource-row"><span className="resource-label">{icon} {label}</span><strong>{value}<i> / {max}</i></strong></div><div className="bar"><span className={`bar-fill ${kind}-fill`} style={{ width: `${Math.max(0, (value / max) * 100)}%` }} /></div></div>; }
function CombatVerdictOverlay({ verdict, onClose }: { verdict: TacticalVerdictResult; onClose: () => void }) {
  const hasVerdicts = verdict.verdicts.length > 0;
  const labelFor = (item: TacticalVerdict) => [item.xp ? `+${item.xp} XP` : "", item.gold ? `+${item.gold} ouro` : "", item.fragments ? `+${item.fragments} Fragmentos` : "", item.knowledge ? `+${item.knowledge} registros` : ""].filter(Boolean);
  return <div className="combat-verdict-backdrop" role="presentation" onClick={onClose}><section className="combat-verdict-modal" role="dialog" aria-modal="true" aria-labelledby="verdict-title" onClick={(event) => event.stopPropagation()}><header className="verdict-header"><span className="verdict-seal"><Crown size={22} /></span><div><span className="eyebrow">AUTO DA EXPEDIÇÃO · {verdict.regionName.toUpperCase()}</span><h2 id="verdict-title">{hasVerdicts ? "Veredito de vitória" : "Vitória registrada"}</h2></div></header><p className="verdict-intro">{hasVerdicts ? "O manuscrito reconheceu a forma como a fronteira foi vencida." : "A ameaça caiu, mas nenhum juramento tático adicional foi inscrito nesta passagem."}</p>{hasVerdicts ? <ul className="verdict-list">{verdict.verdicts.map((item) => <li key={item.id}><ScrollText size={17} /><div><strong>{item.title} · {item.seal}</strong><p>{item.detail}</p><div className="verdict-reward">{labelFor(item).map((reward) => <span key={reward}>{reward}</span>)}</div></div></li>)}</ul> : <p className="verdict-empty">Experimente preservar a legião, executar mais de um inimigo, vencer apenas com ritos ou comandar servos sem atacar diretamente.</p>}<div className="verdict-record"><span><b>{verdict.record.rounds}</b><small>TURNOS INIMIGOS</small></span><span><b>{verdict.record.executions}</b><small>EXECUÇÕES</small></span><span><b>{verdict.record.rituals + verdict.record.arenaRites}</b><small>RITOS</small></span><span><b>{verdict.record.servantsFallen}</b><small>SERVOS CAÍDOS</small></span></div><footer className="verdict-actions"><button className="primary-button" onClick={onClose}><Check size={15} /> Selar no manuscrito</button></footer></section></div>;
}
function RegionalCycleDossier({ environment }: { environment: EnvironmentReadout }) {
  const { cycle, phase, actionsUntilShift } = environment;
  return <article className="regional-dossier" aria-live="polite"><div className="regional-cycle-seal">{String(environment.turnInPhase).padStart(2, "0")}</div><div><span className="eyebrow amber"><Compass size={12} /> REGRA DO TERRITÓRIO · PREPARE A FORMAÇÃO</span><h3>{cycle.title} · {phase.name}</h3><p>{phase.detail}</p></div><div className="regional-phase-reading"><span>CONTRAJOGO</span><strong>{phase.counterplay}</strong><small>{actionsUntilShift === 1 ? "A fase muda após a próxima ação." : `Muda em ${actionsUntilShift} ações.`}</small><div className="regional-phase-track">{cycle.phases.map((item) => <i key={item.id} className={item.id === phase.id ? "active" : ""} />)}</div></div></article>;
}
function Citadel({ citadel, player, totalLevel, bestiaryKnownCount, doctrine, npcProgress, onNpcService, selectedRoomId, openRoom, closeRoom, upgradeCitadel, returnToField, navigateTo }: { citadel: CitadelState; player: PlayerState; totalLevel: number; bestiaryKnownCount: number; doctrine?: KingdomDoctrine; npcProgress: CitadelNpcProgress; onNpcService: (npc: CitadelNpc) => void; selectedRoomId: CitadelBuildingId | null; openRoom: (id: CitadelBuildingId) => void; closeRoom: () => void; upgradeCitadel: (building: CitadelBuilding) => void; returnToField: () => void; navigateTo: (tab: Tab) => void }) {
  const stage = totalLevel === 0 ? { name: "RUÍNA", detail: "Pedra quebrada, ossos expostos e um único sigilo ainda aceso." } : totalLevel < 7 ? { name: "BASTIÃO", detail: "As primeiras torres se erguem. O reino começa a recordar seu nome." } : totalLevel < 16 ? { name: "CIDADELA", detail: "A ordem dos mortos já sustenta muralhas, ritos e forjas." } : { name: "REINO", detail: "Uma soberania funerária domina a fronteira entre a estrada e a sepultura." };
  const selectedBuilding = selectedRoomId ? citadelBuildings.find((building) => building.id === selectedRoomId) : undefined;
  if (selectedBuilding) return <CitadelInterior building={selectedBuilding} level={citadel.buildings[selectedBuilding.id]} player={player} bestiaryKnownCount={bestiaryKnownCount} doctrine={doctrine} npc={citadelNpcForRoom(selectedBuilding.id)} npcProgress={npcProgress} onNpcService={onNpcService} onClose={closeRoom} onUpgrade={() => upgradeCitadel(selectedBuilding)} onNavigate={navigateTo} />;
  return <section className="citadel-view"><header className="citadel-hero"><div className="citadel-copy"><span className="eyebrow amber"><Crown size={13} /> CIDADELA NECROMÂNTICA · CASA DE VEYRA</span><h2>O reino começa onde a ruína aceita um nome.</h2><p>O pátio agora leva a salas vivas. Entre, encontre quem sustenta a campanha e use cada edifício como uma extensão material de sua formação.</p><div className="citadel-metrics"><span><small>DESENVOLVIMENTO</small><strong>{totalLevel} / 30 níveis</strong></span><span><small>TESOURO</small><strong>{player.gold} ouro</strong></span><span><small>ALMAS</small><strong>{player.soulFragments} Fragmentos</strong></span></div></div><div className="citadel-stage"><img src="/manus-storage/citadel-art-direction_d65a4ca9.png" alt="Pátio e interiores da Cidadela Necromântica" /><div><span>ESTÁGIO DO REINO</span><b>{stage.name}</b><small>{stage.detail}</small></div></div></header><div className="citadel-building-grid">{citadelBuildings.map((building) => { const level = citadel.buildings[building.id]; const next = level + 1; const maxed = level >= building.maxLevel; const goldCost = building.baseGold * next; const soulCost = (building.baseSouls ?? 0) * Math.ceil(next / 2); const canUpgrade = !maxed && player.gold >= goldCost && player.soulFragments >= soulCost; return <article key={building.id} className={`citadel-building building-${building.id} ${level ? "raised" : "ruin"}`}><img src="/manus-storage/citadel-art-direction_d65a4ca9.png" alt="" /><header><span>{String(citadelBuildings.indexOf(building) + 1).padStart(2, "0")}</span><div><small>{building.title.toUpperCase()}</small><strong>{building.name}</strong></div><b className="building-level">NV. {level}/{building.maxLevel}</b></header><p>{building.description}</p><div className="building-benefit">{building.benefit}</div><footer><span className="building-cost"><b>{maxed ? "MAESTRIA ATINGIDA" : `${goldCost} ouro${soulCost ? ` · ${soulCost} alma${soulCost > 1 ? "s" : ""}` : ""}`}</b>{maxed ? "A construção não pode crescer além deste marco." : `Melhoria ${next} de ${building.maxLevel}`}</span><div className="citadel-building-actions"><button className="citadel-enter" onClick={() => openRoom(building.id)}>ENTRAR</button><button onClick={() => upgradeCitadel(building)} disabled={!canUpgrade}>{maxed ? "CONCLUÍDO" : canUpgrade ? "APRIMORAR" : "FALTAM RECURSOS"}</button></div></footer></article>; })}</div><section className="citadel-notes"><article className="citadel-note"><span className="eyebrow violet">REGISTRO DO ARQUIVO</span><h3>Uma casa que serve à expedição.</h3><p>Cada porta não só fortalece o reino: ela abre o instrumento correspondente — ritos, legião, arsenal, ossuário, pesquisa ou rota de partida.</p></article><button className="citadel-return" onClick={returnToField}><span><small>RETORNAR À FRONTEIRA</small><strong>Levar o reino para a estrada</strong></span><ChevronRight size={18} /></button></section></section>;
}
function HelpStep({ n, title, text }: { n: string; title: string; text: string }) { return <div><b>{n}</b><span><strong>{title}</strong><small>{text}</small></span></div>; }
function RelicDrop({ reward, encounterName, onClose, onInventory }: { reward: RegionalReward; encounterName: string; onClose: () => void; onInventory: () => void }) { const particles = Array.from({ length: 12 }); return <div className="relic-drop-backdrop" role="presentation" onClick={onClose}><div className={`relic-drop-modal tone-${reward.tone}`} role="dialog" aria-modal="true" aria-labelledby="relic-drop-title" aria-describedby="relic-drop-description" onClick={(event) => event.stopPropagation()}><div className="relic-drop-aura" /><div className="relic-drop-particles" aria-hidden="true">{particles.map((_, index) => <i key={index} style={{ "--particle-index": index } as React.CSSProperties} />)}</div><button className="modal-close" onClick={onClose} aria-label="Fechar recompensa"><X size={18} /></button><span className="eyebrow amber"><Sparkles size={12} /> RELÍQUIA DESENTERRADA</span><div className="relic-drop-sigil"><img src={assets.sigil} alt="" /><span>{reward.tone.toUpperCase()}</span></div><img className="relic-drop-art" src={reward.art} alt={`Arte de ${reward.name}`} /><span className="relic-drop-kicker">{encounterName} · PRIMEIRO REGISTRO</span><h2 id="relic-drop-title">{reward.name}</h2><p id="relic-drop-description">{reward.description}</p><div className="relic-drop-rewards"><span><strong>+{reward.xpBonus} XP</strong><small>bônus do encontro</small></span><span><strong>+{reward.firstClearGold} ouro</strong><small>marca regional</small></span><span><strong>{reward.effect}</strong><small>efeito permanente</small></span></div><div className="relic-drop-actions"><button className="primary-button" onClick={onInventory}><Archive size={15} /> Abrir inventário</button><button className="ghost-button" onClick={onClose}>Guardar no grimório <ChevronRight size={14} /></button></div><span className="relic-drop-hint">Pressione Esc ou toque fora para fechar</span></div></div>; }
function RoadEventOverlay({ event, onChoose, onLeave }: { event: RoadEvent; onChoose: (choice: RoadEventChoice) => void; onLeave: () => void }) { return <div className="road-event-backdrop" role="presentation"><article className="road-event-modal" role="dialog" aria-modal="true" aria-labelledby="road-event-title" aria-describedby="road-event-description"><div className="road-event-scratch" aria-hidden="true" /><div className="road-event-visual"><img src={event.art} alt="" /><div className="road-event-sigil"><img src={assets.sigil} alt="" /><span>FOLHA<br />DE ESTRADA</span></div></div><div className="road-event-copy"><span className="eyebrow amber"><ScrollText size={12} /> DECISÃO DE ESTRADA</span><span className="road-event-subtitle">{event.subtitle}</span><h2 id="road-event-title">{event.title}</h2><p id="road-event-description">{event.description}</p><aside><KeyRound size={15} /><span><strong>PRESSÁGIO</strong>{event.omen}</span></aside></div><div className="road-event-choices">{event.choices.map((choice) => <button key={choice.id} onClick={() => onChoose(choice)}><span className="road-choice-mark">{choice.label.slice(0, 1)}</span><span><strong>{choice.label}</strong><em>{choice.ritual}</em><small>{choice.description}</small><b>{choice.consequence}</b></span><ChevronRight size={16} /></button>)}</div><footer><span>As escolhas ficam registradas no atlas e podem retornar em outras rotas.</span><button className="ghost-button" onClick={onLeave}>Deixar a cena para trás <ChevronRight size={14} /></button></footer></article></div>; }
function MonsterPortrait({ enemy, className = "" }: { enemy: Enemy; className?: string }) { const mark = enemy.id === "marauder" ? <Swords /> : enemy.id === "wisp" || enemy.id === "drowned-acolyte" || enemy.id === "tide-herald" ? <Waves /> : enemy.id === "thorn-hound" ? <Skull /> : enemy.id === "briar-sentinel" || enemy.id === "rose-matriarch" ? <Heart /> : enemy.id === "bell-revenant" || enemy.id === "warden" ? <CircleDot /> : enemy.id === "eclipse-shade" || enemy.id === "starved-astronomer" ? <Moon /> : enemy.id.startsWith("salt-knight") ? <Shield /> : <Crown />; return <div className={`monster-portrait portrait-${enemy.id} ${enemy.boss ? "portrait-boss" : ""} ${className}`}><img src={enemy.art} alt={`Retrato de ${enemy.name}`} /><span className="portrait-ink" /><span className="portrait-mark" aria-hidden="true">{mark}</span><span className="portrait-name" aria-hidden="true">{enemy.name}</span></div>; }
function CombatImpact({ effect }: { effect: { id: number; kind: "strike" | "lance" | "drain" | "boss"; targetName: string } }) { const labels = { strike: ["GOLPE DE FORMAÇÃO", Swords], lance: ["LANÇA ÓSSEA", WandSparkles], drain: ["DRENO VITAL", Heart], boss: ["COMANDO DE CHEFE", Crown] } as const; const [label, Icon] = labels[effect.kind]; return <div key={effect.id} className={`combat-impact impact-${effect.kind}`} aria-live="polite"><div className="impact-rings" /><div className="impact-shards"><i /><i /><i /><i /><i /><i /></div><div className="impact-core"><Icon size={25} /><span>{label}</span><strong>{effect.targetName}</strong></div></div>; }
function TacticalCommandDeck({ target, player, playerStatuses, lastDamageType, disabled, strike, defend, cast, legion, bosses, combos, useServantAbility, useBossAbility, useLegionCombo, bossArena, arenaPhase, arenaProgress, useArenaAction }: { target: Enemy; player: PlayerState; playerStatuses: CombatStatus[]; lastDamageType: DamageType | null; disabled: boolean; strike: () => void; defend: (move: DefenseMove) => void; cast: (spell: SpellKey) => void; legion: Servant[]; bosses: Enemy[]; combos: LegionCombo[]; useServantAbility: (servant: Servant) => void; useBossAbility: (boss: Enemy, ability: BossAbility) => void; useLegionCombo: (combo: LegionCombo) => void; bossArena?: BossArena; arenaPhase?: BossArena["phases"][number]; arenaProgress: number; useArenaAction: () => void }) {
  const spells: Array<{ id: Exclude<SpellKey, "raise">; label: string; cost: number; type: DamageType; detail: string }> = [
    { id: "lance", label: "Lança óssea", cost: 12, type: "shadow", detail: "amaldiçoa" }, { id: "ember", label: "Brasa funerária", cost: 14, type: "fire", detail: "queima" },
    { id: "frost", label: "Geada sepulcral", cost: 15, type: "ice", detail: "congela" }, { id: "rot", label: "Peste de osso", cost: 16, type: "poison", detail: "corrompe" },
    { id: "rite", label: "Vela branca", cost: 18, type: "holy", detail: "amedronta" }, { id: "drain", label: "Drenar vida", cost: 16, type: "shadow", detail: "cura" },
    { id: "cataclysm", label: "Cataclismo", cost: 34, type: "shadow", detail: "alto risco" }, { id: "echo", label: "Ressonância", cost: 24, type: "shadow", detail: "novo ciclo" },
  ];
  const intent = target.intent;
  const enemyHpPercent = Math.max(0, Math.min(100, (target.hp / Math.max(1, target.maxHp)) * 100));
  const playerHpPercent = Math.max(0, Math.min(100, (player.hp / Math.max(1, player.maxHp)) * 100));
  const playerManaPercent = Math.max(0, Math.min(100, (player.mana / Math.max(1, player.maxMana)) * 100));
  const servantCommands = legion.filter((unit) => !unit.bossId);
  const bossCommands = bosses.filter((boss) => boss.ability);
  const arenaStep = bossArena ? (bossArena.cyclic ? (arenaProgress % bossArena.phases.length) + 1 : Math.min(bossArena.maxProgress, arenaProgress) + 1) : 0;
  const arenaActionLabel = bossArena?.bossId === "black-salt-hierophant" && arenaProgress === 0 ? "Canalizar sal" : bossArena?.action.label;
  return <section className="tactical-command-deck combat-station" aria-label="Estação única de combate">
    <div className="tactical-heading"><div><span className="eyebrow violet"><Shield size={13} /> ESTAÇÃO DE COMBATE</span><h2>Um alvo. Uma formação. Uma decisão.</h2></div><div className="tactical-history"><span>ÚLTIMO ELO</span><strong>{lastDamageType ? damageMeta[lastDamageType].label : "nenhum"}</strong></div></div>
    <aside className="combat-world-proof" aria-label={`Dossiê cartográfico de ${target.name}`}><img className="world-proof-art" src={target.art} alt="" /><div className="world-proof-copy"><span>FRAGMENTO DO ATLAS · AMEAÇA SENTENCIADA</span><strong>{target.name}</strong><p>{target.kind} · frente ativa · evidência presa à folha de vigília</p></div><div className="world-proof-coordinates"><span>TRAÇO</span><b>V-01</b><small>norte em ruína</small></div><img className="world-proof-sigil" src={assets.sigil} alt="" /></aside>
    <div className="station-vitals">
      <div className="station-vital enemy-vital"><div><span>INTEGRIDADE DO ALVO</span><strong>{target.name}</strong><em className={`damage-type type-${target.damageType ?? "physical"}`}>{damageMeta[target.damageType ?? "physical"].short}</em></div><b>{target.hp} <small>/ {target.maxHp} VIT</small></b><i><u style={{ width: `${enemyHpPercent}%` }} /></i></div>
      <div className="station-vital player-vital"><div><span>VEYRA · VITALIDADE</span><strong>{player.hp} <small>/ {player.maxHp}</small></strong></div><i><u style={{ width: `${playerHpPercent}%` }} /></i></div>
      <div className="station-vital mana-vital"><div><span>MANÁ RITUAL</span><strong>{player.mana} <small>/ {player.maxMana}</small></strong></div><i><u style={{ width: `${playerManaPercent}%` }} /></i></div>
    </div>
    <article className="combat-target-brief" aria-live="polite">
      <MonsterPortrait enemy={target} className="command-target-portrait" />
      <div className="combat-target-identity"><span>ALVO AUTOMÁTICO · PRÓXIMA AMEAÇA VIVA</span><h3>{target.name}</h3><p>{target.kind} · Nv. {target.level}{target.elite ? " · elite" : target.boss ? " · chefe" : ""}<em className={`damage-type type-${target.damageType ?? "physical"}`}>{damageMeta[target.damageType ?? "physical"].label}</em></p></div>
      <div className="combat-target-reading"><div className="affinity-row"><span><b>FRACO</b>{(target.weaknesses ?? []).map((type) => <i key={type} className={`type-${type}`}>{damageMeta[type].short}</i>)}</span><span><b>RESISTE</b>{(target.resistances ?? []).map((type) => <i key={type} className={`type-${type}`}>{damageMeta[type].short}</i>)}</span></div><div className="posture-readout"><div><span>POSTURA</span><strong className={`posture-${target.posture ?? "neutral"}`}>{postureMeta[target.posture ?? "neutral"].label}</strong></div><div className="posture-bar"><i style={{ width: `${Math.min(100, ((target.postureHp ?? 0) / Math.max(1, target.maxPosture ?? 1)) * 100)}%` }} /></div><small>{target.posture === "vulnerable" ? "Dano amplificado: explore a abertura." : postureMeta[target.posture ?? "neutral"].detail}</small></div></div>
      {intent && <div className="telegraph-alert"><Waves size={16} /><div><span>TELEGRÁFICO · {intent.turnsLeft} TURNO{intent.turnsLeft === 1 ? "" : "S"}</span><strong>{intent.name}</strong><p>{intent.description}</p></div><b>QUEBRE {Math.max(0, target.postureHp ?? intent.postureToBreak)}</b></div>}
      {statusText(target.statuses) && <div className="status-readout enemy-status"><span>ESTADOS</span><strong>{statusText(target.statuses)}</strong></div>}
    </article>
    {bossArena && arenaPhase && <article className={`boss-arena-dossier arena-${bossArena.bossId}`} aria-label={`Arena do chefe: ${bossArena.title}`}><div className="arena-dossier-seal"><Crown size={17} /><span>ARENA<br />DE CHEFE</span></div><div className="arena-dossier-main"><span>{bossArena.seal}</span><h3>{bossArena.title}</h3><p>{arenaPhase.detail}</p><div className="arena-phase-track">{bossArena.phases.map((phase, index) => <i key={phase.name} className={index <= (bossArena.cyclic ? arenaProgress % bossArena.phases.length : Math.min(arenaProgress, bossArena.phases.length - 1)) ? "lit" : ""}><b>{index + 1}</b><small>{phase.name}</small></i>)}</div></div><div className="arena-dossier-threat"><span>FASE {arenaStep} · {bossArena.cyclic ? "CICLO CELESTE" : "PRESSÃO"}</span><strong>{arenaPhase.name}</strong><p>{arenaPhase.threat}</p><button onClick={useArenaAction} disabled={disabled || player.mana < bossArena.action.cost}><WandSparkles size={14} /><span>{arenaActionLabel}</span><small>{bossArena.action.cost} mana</small></button></div></article>}
    <div className="tactical-grid">
      <article className="player-tactics"><div className="player-tactics-head"><span>REAÇÃO DE VEYRA</span><strong>{statusText(playerStatuses) || "sem estados"}</strong></div><div className="defense-actions"><button onClick={() => defend("block")} disabled={disabled}><Shield size={15} /><span>Bloquear</span><small>−52%</small></button><button onClick={() => defend("evade")} disabled={disabled}><Wind size={15} /><span>Esquivar</span><small>68%</small></button><button onClick={() => defend("counter")} disabled={disabled}><Swords size={15} /><span>Contra-atacar</span><small>postura</small></button></div><button className="tactical-strike station-primary-strike" onClick={strike} disabled={disabled}><Swords size={16} /> Golpear <small>FÍS · SANGRAMENTO</small></button></article>
      <article className="spell-tactics"><div className="spell-tactics-head"><span>RITOS, SERVOS E COMBOS</span><small>Todos os ataques reunidos abaixo.</small></div><div className="tactical-spells">{spells.map((spell) => <button key={spell.id} className={`tactical-spell type-${spell.type} ${spell.id === "cataclysm" ? "high-risk" : ""}`} onClick={() => cast(spell.id)} disabled={disabled || player.mana < spell.cost}><span>{damageMeta[spell.type].short}</span><div><strong>{spell.label}</strong><small>{spell.detail}</small></div><em>{spell.cost}</em></button>)}</div>{combos.length > 0 && <div className="legion-combo-commands"><span className="compact-command-label"><Sparkles size={11} /> TÉCNICAS DE FORMAÇÃO</span>{combos.map((combo) => <button key={combo.id} onClick={() => useLegionCombo(combo)} disabled={disabled || player.mana < combo.cost}><span>{combo.seal}</span><strong>{combo.name}</strong><small>{combo.recipe} · {combo.cost} mana</small></button>)}</div>}{(servantCommands.length > 0 || bossCommands.length > 0) && <div className="compact-ally-actions"><span className="compact-command-label"><Skull size={11} /> ORDENS DA LEGIÃO</span><div>{servantCommands.map((servant) => <button key={servant.uid} className={`compact-ally-command type-${servant.active.damageType}`} onClick={() => useServantAbility(servant)} disabled={disabled || Boolean(servant.cooldown && servant.cooldown > 0)}><strong>{servant.active.name}</strong><small>{servant.cooldown ? `${servant.cooldown}r · ` : ""}{servant.active.cost} mana</small></button>)}{bossCommands.map((boss) => <button key={boss.id} className={`compact-ally-command boss-command type-${boss.ability!.damageType}`} onClick={() => useBossAbility(boss, boss.ability!)} disabled={disabled}><strong>{boss.ability!.name}</strong><small>{boss.name} · {boss.ability!.cost} mana</small></button>)}</div></div>}</article>
    </div>
  </section>;
}
function ResurrectionRitual({ boss, onClose }: { boss: Enemy; onClose: () => void }) { return <div className="resurrection-backdrop" role="presentation" onClick={onClose}><div className="resurrection-ritual" role="dialog" aria-modal="true" aria-labelledby="resurrection-title" onClick={(event) => event.stopPropagation()}><div className="resurrection-circles" /><div className="resurrection-embers">{Array.from({ length: 16 }).map((_, index) => <i key={index} style={{ "--ember-index": index } as React.CSSProperties} />)}</div><span className="eyebrow violet"><Crown size={12} /> A COROA RESPONDE</span><MonsterPortrait enemy={boss} className="ritual-portrait" /><h2 id="resurrection-title">{boss.name}</h2><p>O cadáver abre os olhos sob o selo. <strong>{boss.ability?.name}</strong> foi inscrita entre os comandos de batalha.</p><button className="primary-button" onClick={onClose}>Selar o pacto <ChevronRight size={15} /></button></div></div>; }
function BossAbilityBar({ bosses, useBossAbility, disabled }: { bosses: Enemy[]; useBossAbility: (boss: Enemy, ability: BossAbility) => void; disabled: boolean }) { if (!bosses.length) return null; return <section className="boss-ability-bar"><div className="boss-ability-heading"><span className="eyebrow violet"><Crown size={13} /> CHEFES RESSUSCITADOS</span><strong>Comandos do ossuário</strong></div><div className="boss-ability-list">{bosses.map((boss) => boss.ability && <button key={boss.id} className={`boss-ability-card ability-${boss.ability.kind}`} onClick={() => useBossAbility(boss, boss.ability!)} disabled={disabled}><MonsterPortrait enemy={boss} className="ability-portrait" /><span><small>{boss.name}</small><strong>{boss.ability.name}</strong><em>{boss.ability.cost} mana · {boss.ability.damage} dano</em></span><Sparkles size={15} /></button>)}</div></section>; }
function ServantAbilityBar({ legion, useServantAbility, disabled }: { legion: Servant[]; useServantAbility: (servant: Servant) => void; disabled: boolean }) { const servants = legion.filter((unit) => !unit.bossId); if (!servants.length) return null; return <section className="servant-ability-bar"><div className="boss-ability-heading"><span className="eyebrow violet"><Skull size={13} /> ORDENS DA LEGIÃO</span><strong>Habilidades ativas dos servos</strong></div><div className="boss-ability-list">{servants.map((servant) => <button key={servant.uid} className={`boss-ability-card servant-ability-card ability-${servant.active.kind}`} onClick={() => useServantAbility(servant)} disabled={disabled || Boolean(servant.cooldown && servant.cooldown > 0)}><img src={servant.art} alt="" /><span><small>{servant.name} · {servantRank(servant.rarity)}</small><strong>{servant.active.name}</strong><em>{servant.cooldown ? `recarga ${servant.cooldown} · ` : ""}{servant.active.cost} mana · {damageMeta[servant.active.damageType].short}</em></span><Sparkles size={15} /></button>)}</div></section>; }
function BestiaryStrip({ enemies }: { enemies: Enemy[] }) { return <section className="bestiary-strip"><div className="bestiary-heading"><span className="eyebrow"><Skull size={13} /> BESTIÁRIO DO ENCONTRO</span><small>nomes e retratos confirmados</small></div><div className="bestiary-cards">{enemies.map((enemy) => <article className={`bestiary-card ${enemy.boss ? "boss" : ""}`} key={enemy.id}><MonsterPortrait enemy={enemy} /><div><span>{enemy.boss ? "CHEFE" : enemy.elite ? "ELITE" : enemy.kind}</span><strong>{enemy.name}</strong><small>{enemy.trait}</small></div></article>)}</div></section>; }
function BestiaryCodex({ sightings, defeats, completedIds, knownCount, returnToField }: { sightings: Record<string, number>; defeats: Record<string, number>; completedIds: string[]; knownCount: number; returnToField: () => void }) {
  const [filter, setFilter] = useState<"all" | "known" | "complete" | "boss">("all");
  const filters = [{ id: "all", label: "Todas" }, { id: "known", label: "Registradas" }, { id: "complete", label: "Completas" }, { id: "boss", label: "Chefes" }] as const;
  const entries = enemyCatalog.filter((enemy) => filter === "all" || filter === "known" && Boolean(sightings[enemy.id]) || filter === "complete" && completedIds.includes(enemy.id) || filter === "boss" && Boolean(enemy.boss));
  return <section className="bestiary-codex"><header className="bestiary-hero"><div className="bestiary-hero-copy"><span className="eyebrow violet"><BookOpen size={13} /> ARQUIVO DE AMEAÇAS · BIBLIOTECA DE VEYRA</span><h2>Conhecimento é uma lâmina antes do golpe.</h2><p>Avistar uma criatura registra afinidades e padrão de ataque. Derrubá-la repetidas vezes revela o espólio, a história e a sentença tática que a formação deve obedecer.</p><div className="bestiary-hero-stats"><span><small>AMEAÇAS REGISTRADAS</small><strong>{knownCount} <i>/ {enemyCatalog.length}</i></strong></span><span><small>DOSSIÊS COMPLETOS</small><strong>{completedIds.length} <i>/ {enemyCatalog.length}</i></strong></span><span><small>PRÓXIMO PROTOCOLO</small><strong>AVISTAR · CAIR · DOMINAR</strong></span></div></div><aside className="bestiary-seal-card"><img src={assets.sigil} alt="" /><span>SELO DA<br />BIBLIOTECA</span><b>{String(knownCount).padStart(2, "0")}</b><small>registros vivos</small><button className="ghost-button" onClick={returnToField}>Voltar ao campo <ChevronRight size={14} /></button></aside></header>
    <div className="bestiary-protocol"><div><span className="bestiary-protocol-index">I</span><span><strong>AVISTADO</strong><small>fraqueza, resistência e comportamento</small></span></div><div><span className="bestiary-protocol-index">II</span><span><strong>ESTUDADO</strong><small>padrão, postura, estado e espólio</small></span></div><div><span className="bestiary-protocol-index">III</span><span><strong>COMPLETO</strong><small>lore, animação, estratégia e recompensa</small></span></div></div>
    <div className="bestiary-toolbar"><div><span className="eyebrow amber"><Skull size={13} /> CATÁLOGO DE CAMPO</span><h3>{filter === "all" ? "Toda ameaça deixa uma pista." : filter === "known" ? "Registros preservados." : filter === "complete" ? "Sentenças inteiramente decifradas." : "Coroas que a morte não esqueceu."}</h3></div><div className="bestiary-filters" role="group" aria-label="Filtrar bestiário">{filters.map((item) => <button key={item.id} className={filter === item.id ? "active" : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div></div>
    <div className="bestiary-grid">{entries.map((enemy) => { const level = bestiaryKnowledgeLevel(enemy, sightings, defeats); const dossier = enemyBestiary[enemy.id]; const doctrine = enemyDoctrineFor(enemy); const kills = defeats[enemy.id] ?? 0; const goal = bestiaryStudyGoal(enemy); const isComplete = completedIds.includes(enemy.id); const label = level === 0 ? "NÃO REGISTRADO" : level === 1 ? "AVISTADO" : isComplete ? "CONHECIMENTO COMPLETO" : "SOB OBSERVAÇÃO"; return <article className={`bestiary-dossier level-${level} ${isComplete ? "complete" : ""} ${enemy.boss ? "boss" : ""}`} key={enemy.id}><div className="dossier-portrait-wrap"><MonsterPortrait enemy={enemy} className={level === 0 ? "portrait-veiled" : ""} /><span className="dossier-level">{level === 0 ? <LockKeyhole size={13} /> : <Check size={13} />} {label}</span>{enemy.boss && <span className="dossier-crown"><Crown size={14} /> COROADO</span>}</div><div className="dossier-body">{level === 0 ? <><span className="eyebrow">PÁGINA SELADA</span><h3>Ameaça não registrada</h3><p>Leve Veyra a uma rota desconhecida para marcar esta página no arquivo.</p></> : <><div className="dossier-title"><span>{enemy.boss ? "CHEFE" : enemy.elite ? "ELITE" : enemy.kind.toUpperCase()}</span><h3>{enemy.name}</h3><small>Nv. {enemy.level} · {enemy.trait}</small></div><div className="dossier-affinities"><span className="weak"><b>FRACA A</b>{enemy.weaknesses?.map((type) => damageMeta[type].short).join(" · ") || "—"}</span><span className="resist"><b>RESISTE</b>{enemy.resistances?.map((type) => damageMeta[type].short).join(" · ") || "—"}</span></div><div className="dossier-behavior"><span>COMPORTAMENTO</span><p>{dossier?.behavior ?? enemy.trait}</p></div><div className="bestiary-doctrine"><span>DOUTRINA · {doctrine.marker}</span><strong>{doctrine.title}</strong><p>{doctrine.behavior}</p>{level >= 2 && <small><b>CONTRAJOGADA.</b> {doctrine.counterplay}</small>}{level === 3 && <small><b>DOMÍNIO.</b> {doctrine.bestiaryReward}</small>}</div>{level >= 2 && <div className="dossier-study"><span><b>PADRÃO</b>{postureMeta[enemy.posture ?? "neutral"].label} · {enemy.statusOnHit ? `aplica ${statusMeta[enemy.statusOnHit].label.toLowerCase()}` : "sem estado recorrente"}</span><span><b>ESPÓLIO</b>{enemy.loot}</span></div>}{level === 3 && <div className="dossier-complete"><p><b>MEMÓRIA.</b> {dossier?.lore}</p><p><b>ESTRATÉGIA.</b> {dossier?.strategy}</p><p><b>PADRÃO ANIMADO.</b> {dossier?.animation}</p></div>}<footer className="dossier-progress"><div><span>{level === 3 ? "Dossiê gravado na Biblioteca" : `Derrotas registradas: ${Math.min(kills, goal)} / ${goal}`}</span><div className="dossier-progress-track"><i style={{ width: `${level === 3 ? 100 : Math.min(100, (kills / goal) * 100)}%` }} /></div></div><strong>{level === 3 ? "+ ouro · + Fragmentos" : level === 1 ? "DERROTE PARA ESTUDAR" : "PESQUISA EM CURSO"}</strong></footer></>}</div></article>; })}</div>
  </section>;
}
function LegionComboPanel({ legion, bosses, combos }: { legion: Servant[]; bosses: Enemy[]; combos: LegionCombo[] }) {
  const activeIds = new Set(combos.map((combo) => combo.id));
  return <section className="legion-combo-codex"><header><div><span className="eyebrow violet"><Sparkles size={13} /> GRIMÓRIO DE FORMAÇÕES</span><h2>Uma legião também aprende a lutar como uma só.</h2><p>As receitas não consomem servos: elas ensinam quais vínculos de classe, afinidade e coroa precisam estar vivos para selar uma técnica coletiva.</p></div><aside><strong>{combos.length}</strong><small>SEL{combos.length === 1 ? "O ATIVO" : "OS ATIVOS"}</small></aside></header><div className="legion-combo-codex-grid">{legionComboCatalog.map((combo) => { const active = activeIds.has(combo.id); return <article className={active ? "combo-recipe-active" : "combo-recipe-locked"} key={combo.id}><div className="combo-recipe-mark"><span>{combo.seal}</span><i>{active ? "ATIVO" : "SELADO"}</i></div><div><h3>{combo.name}</h3><p>{combo.detail}</p><strong>RECEITA · {combo.recipe}</strong><small>{active ? `${combo.cost} mana · ${combo.damage} dano ${damageMeta[combo.type].label.toLowerCase()}` : "Altere a composição da legião ou recupere a coroa exigida."}</small></div></article>; })}</div><footer><span>{legion.length} servo{legion.length === 1 ? " inscrito" : "s inscritos"} · {bosses.length} coroa{bosses.length === 1 ? " reanimada" : "s reanimadas"}</span><small>As técnicas ativas aparecem automaticamente na Estação de Combate.</small></footer></section>;
}
function LegionCodex({ player, bossCorpses, canRaise, cast, armyLimit, note, tactics, defeatedBossIds, raisedBossIds, evolveServant, resurrectFallenServant }: any) {
  return <section className="necromancy-view legion-codex"><div className="section-heading"><div><span className="eyebrow violet">LEGIONÁRIO · OSSUÁRIO VIVO</span><h2>Os mortos têm história. E preço.</h2></div><div className="legion-counters"><span><Skull size={13} /> {player.legion.length} / {armyLimit}</span><span><Sparkles size={13} /> {player.soulFragments} fragmentos</span><span><Archive size={13} /> {player.fallenServants.length} caídos</span></div></div><div className="legion-intro"><img src={assets.sigil} alt="" /><p><strong>Cada servo preserva classe, origem, afinidade e cicatrizes.</strong> A evolução melhora a criatura; uma queda pode removê-la da formação. Fragmentos de Alma trazem um morto de volta, mas nunca inteiro.</p></div><div className="legion-roster">{player.legion.map((servant: Servant) => { const template = servantTemplates.find((item) => item.id === servant.templateId); const next = template?.evolutions[servant.evolutionStage]; return <article className={`servant-codex-card rarity-${servant.rarity}`} key={servant.uid}><div className="servant-card-art"><img src={servant.art} alt={`Retrato de ${servant.name}`} /><span>{servantStars(servant.stars)}</span></div><div className="servant-card-main"><div className="servant-card-heading"><div><span>{servantRank(servant.rarity)} · {servant.role.toUpperCase()}</span><h3>{servant.name}</h3></div><em className={`damage-type type-${servant.affinity}`}>{damageMeta[servant.affinity].short}</em></div><p>{servant.origin} · {servant.equipment}</p><div className="servant-bars"><span><small>VITALIDADE</small><i><b style={{ width: `${Math.max(0, servant.hp / servant.maxHp * 100)}%` }} /></i><strong>{servant.hp}/{servant.maxHp}</strong></span><span><small>VOTO · NV {servant.level}</small><i><b style={{ width: `${Math.min(100, servant.xp / Math.max(1, servant.level * 28) * 100)}%` }} /></i><strong>{servant.xp}/{servant.level * 28}</strong></span></div><div className="servant-stat-grid"><span><small>GUARDA</small><b>{servant.stats.guard}</b></span><span><small>DANO</small><b>{servant.stats.damage}</b></span><span><small>SUSTENTO</small><b>{servant.stats.sustain}</b></span><span><small>ARCANO</small><b>{servant.stats.arcana}</b></span></div><div className="servant-traits"><p><b>PASSIVA</b>{servant.passive}</p><p><b>ATIVA · {servant.active.cost} MANA</b>{servant.active.name}: {servant.active.description}</p></div>{servant.revivalDebt > 0 && <div className="soul-scar">CICATRIZ DE ALMA {servant.revivalDebt} · atributos reduzidos após retorno</div>}{next ? <button className="evolve-servant-button" onClick={() => evolveServant(servant)} disabled={servant.level < next.requiredLevel || player.soulFragments < next.fragmentCost}><Sparkles size={14} /> Evoluir para {next.name}<small>NV {next.requiredLevel} · {next.fragmentCost} fragmentos</small></button> : <div className="evolution-sealed">{template?.evolutions.length ? "FORMA FINAL ALCANÇADA" : "LINHAGEM ESTÁVEL"}</div>}</div></article>; })}</div>{player.fallenServants.length > 0 && <section className="fallen-ossuary"><div><span className="eyebrow amber"><Archive size={13} /> OSSUÁRIO DOS CAÍDOS</span><h3>Almas que a batalha tomou</h3><p>A morte é permanente até que você pague o preço da costura. O retorno remove 14% dos atributos e deixa uma cicatriz persistente.</p></div><div className="fallen-list">{player.fallenServants.map((servant: FallenServant) => { const cost = 5 + servant.stars * 3 + servant.evolutionStage * 4; return <article key={servant.uid}><img src={servant.art} alt="" /><span><strong>{servant.name}</strong><small>{servant.cause} · {cost} fragmentos</small></span><button onClick={() => resurrectFallenServant(servant)} disabled={player.soulFragments < cost || player.legion.length >= armyLimit}>Reconstituir</button></article>; })}</div></section>}<BossNecromancy player={player} bossCorpses={bossCorpses} canRaise={canRaise} cast={cast} armyLimit={armyLimit} note={note} tactics={tactics} defeatedBossIds={defeatedBossIds} raisedBossIds={raisedBossIds} /></section>;
}
function BossNecromancy({ player, bossCorpses, canRaise, cast, armyLimit, note, tactics, defeatedBossIds, raisedBossIds }: any) { const bosses = enemyCatalog.filter((enemy) => enemy.boss); return <section className="necromancy-view boss-necromancy"><div className="section-heading"><div><span className="eyebrow violet">COROA E OSSO</span><h2>Apenas chefes atravessam.</h2></div><span className="army-capacity">{player.army.length} / {armyLimit} servos</span></div><div className="boss-ritual-intro"><img src={assets.sigil} alt="" /><div><span className="eyebrow violet">RITUAL DE SUBJUGAÇÃO</span><h3>Ressurreição de chefe</h3><p>Corpos comuns alimentam a estrada. Somente uma alma coroada suporta a marca e concede um comando de batalha.</p></div><button className="primary-button" onClick={() => cast("raise")} disabled={!canRaise}><Crown size={15} /> {canRaise ? "Ressuscitar chefe" : "Nenhum chefe aguardando"}</button></div><div className="boss-codex-grid">{bosses.map((boss) => { const defeatedBoss = defeatedBossIds.includes(boss.id); const raised = raisedBossIds.includes(boss.id); return <article className={`boss-codex-card ${defeatedBoss ? "defeated-boss" : "sealed-boss"} ${raised ? "raised-boss" : ""}`} key={boss.id}><MonsterPortrait enemy={boss} /><div className="boss-codex-overlay"><span>{raised ? "RESSUSCITADO" : defeatedBoss ? "DERROTADO" : "NÃO ENCONTRADO"}</span><h3>{boss.name}</h3><p>{boss.ability?.description}</p><div><strong>{boss.ability?.name}</strong><small>{boss.ability?.cost} mana · {boss.ability?.damage} dano · {boss.ability?.effect}</small></div></div></article>; })}</div><div className="army-tactics-strip"><span className="eyebrow">SIGILO DE FORMAÇÃO</span><strong>+{tactics.damage} dano</strong><strong>{tactics.guard}% guarda</strong><strong>+{tactics.sustain} sustento</strong><small>chefes ressuscitados liberam comandos exclusivos no campo</small></div><div className="necromancy-callout"><Crown size={17} /><p><strong>Chefes derrotados tornam-se servos únicos.</strong> Seus nomes, retratos e habilidades são preservados no grimório e ficam disponíveis na Expedição.</p></div></section>; }
function ItemGallery({ player }: { player: PlayerState }) { const bag = [{ name: "Selo do Guardião", type: "MARCO DE QUEST", art: enemyCatalog.find((enemy) => enemy.id === "warden")?.art ?? assets.boss }, { name: "Lâmina enferrujada", type: "ARMA · MARGA", art: enemyCatalog.find((enemy) => enemy.id === "marauder")?.art ?? assets.mapAshen }, ...regionalRewards.map((reward) => ({ name: reward.name, type: player.relics.includes(reward.itemId) ? reward.category : "RELÍQUIA SELADA", art: reward.art }))]; return <section className="item-gallery"><div className="section-heading"><div><span className="eyebrow">CATÁLOGO DE ITENS</span><h2>Todo peso tem um retrato.</h2></div><span className="map-count">{bag.length} peças identificadas</span></div><div className="item-gallery-grid">{bag.map((item) => <article className="item-gallery-card" key={item.name}><img src={item.art} alt={`Arte de ${item.name}`} /><div><span>{item.type}</span><strong>{item.name}</strong></div></article>)}</div></section>; }

function Expedition({ region, encounter, encounterOptions, target, enemies, log, pulse, setTargetId, strike, cast, setTab, assets, WeatherIcon, selectEncounter, revealedIds, regionalReward, regionRelicOwned, encounterCleared, drawRoadEvent, eventHistory }: { region: Region; encounter: Encounter; encounterOptions: Encounter[]; target: Enemy; enemies: Enemy[]; log: string[]; pulse: number; setTargetId: (id: string) => void; strike: () => void; cast: (spell: "lance" | "drain" | "raise") => void; setTab: (tab: Tab) => void; assets: typeof import("@/lib/gameData").assets; WeatherIcon: React.ComponentType<{ size?: number }>; selectEncounter: (encounter: Encounter) => void; revealedIds: string[]; regionalReward?: RegionalReward; regionRelicOwned: boolean; encounterCleared: boolean; drawRoadEvent: () => void; eventHistory: string[] }) {
  const EncounterIcon = encounterIcons[encounter.kind as keyof typeof encounterIcons];
  const targetDoctrine = enemyDoctrineFor(target);
  return <><section className="hero-panel" style={{ backgroundImage: `linear-gradient(90deg, rgba(9,10,13,.92), rgba(9,10,13,.7) 37%, rgba(9,10,13,.16)), url(${assets.hero})` }}><div className="hero-copy"><span className="eyebrow violet"><Sparkles size={12} /> CLIMA · {region.weather.toUpperCase()}</span><h2>O morto não<br /><em>descansa.</em></h2><p>Veyra atravessa o limiar onde aldeões enterram seus medos. O atlas marcou uma nova presença no caminho.</p><div className="hero-actions"><button className="primary-button" onClick={() => setTargetId(enemies[0]?.id ?? "")}><Swords size={16} /> Marcar confronto</button><button className="ghost-button" onClick={() => setTab("map")}><Compass size={16} /> Ver rota</button></div></div><div className="hero-telemetry"><span>COORDENADAS</span><strong>{region.coordinates}</strong><span>ENCONTRO</span><strong>{encounter.type}</strong><div className="hero-stamp"><span>FOLHA</span><b>{String(regions.findIndex((item: Region) => item.id === region.id) + 1).padStart(2, "0")}</b></div></div></section><div className="section-heading"><div><span className="eyebrow">CAMPO DE BATALHA</span><h2>{region.landmark}</h2></div><div className="weather-chip"><WeatherIcon size={15} /> {region.weather}<span className="chip-dot" /></div></div><section className="encounter-strip"><div className="encounter-heading"><span className="eyebrow">PLACAS DE ENCONTRO · {encounterOptions.length} ROTAS</span><span className="encounter-rule"><EncounterIcon size={13} /> {encounter.danger}</span></div><div className="encounter-options">{encounterOptions.map((item: Encounter) => { const Icon = encounterIcons[item.kind]; return <button key={item.id} className={`encounter-card ${item.id === encounter.id ? "selected" : ""}`} onClick={() => selectEncounter(item)}><span className="encounter-icon"><Icon size={16} /></span><span><strong>{item.name}</strong><small>{item.type} · {item.reward}</small></span><ChevronRight size={14} /></button>; })}</div><p className="encounter-description"><strong>{encounter.rule}</strong> {encounter.description}</p></section>{regionalReward && <section className={`reward-banner tone-${regionalReward.tone} ${regionRelicOwned ? "owned" : ""}`}><div className="reward-banner-mark">{regionRelicOwned ? <Check size={17} /> : <Sparkles size={17} />}</div><div><span className="eyebrow">{encounterCleared ? "MARCO REGISTRADO" : "RECOMPENSA DE REGIÃO"}</span><strong>{regionalReward.name}</strong><p>{encounterCleared ? "Este encontro já deixou sua marca no atlas." : `+${regionalReward.xpBonus} XP após vencer o encontro · ${regionalReward.effect} no primeiro registro`}</p></div><b>{regionRelicOwned ? "REGISTRADA" : `+${regionalReward.xpBonus} XP`}</b></section>}<section className="combat-layout"><div className="combat-card"><div className="combat-card-top"><span className="eyebrow">AMEAÇAS IDENTIFICADAS · {enemies.filter((enemy: Enemy) => enemy.hp > 0).length}</span><span className="threat-level"><span /> {encounter.danger}</span></div><div className="enemy-list">{enemies.map((enemy: Enemy) => { const hidden = enemy.trait.includes("Oculto") && !revealedIds.includes(enemy.id) && enemy.hp > 0; const doctrine = enemyDoctrineFor(enemy); return <button key={enemy.id} className={`enemy-row ${target.id === enemy.id ? "selected" : ""} ${enemy.hp <= 0 ? "defeated" : ""}`} onClick={() => setTargetId(enemy.id)}><div className={`enemy-icon enemy-${enemy.variant}`}>{enemy.boss ? <Crown size={18} /> : enemy.kind.includes("Espectro") || enemy.kind.includes("Sombra") ? <WandSparkles size={18} /> : <Skull size={18} />}</div><div className="enemy-copy"><strong>{enemy.name}</strong><span>{enemy.kind} · Nv. {enemy.level}{enemy.elite ? " · elite" : ""}</span><small className="enemy-trait">{hidden ? "forma eclipsada" : enemy.trait}</small>{!hidden && <small className="enemy-doctrine-tag">{doctrine.marker} · {doctrine.title}</small>}</div><div className="enemy-hp"><span>{hidden ? "?? / ??" : `${enemy.hp} / ${enemy.maxHp}`}</span><div className="mini-bar"><i style={{ width: `${hidden ? 30 : (enemy.hp / enemy.maxHp) * 100}%` }} /></div></div><ChevronRight size={15} /></button>; })}</div><div className="combat-command"><div className="target-label"><Target size={14} /> ALVO <strong>{target.name}</strong></div><div className="combat-doctrine-callout"><b>{targetDoctrine.marker}</b><div><span>DOUTRINA · {targetDoctrine.title}</span><strong>{targetDoctrine.fieldSignal}</strong><p><b>RESPOSTA.</b> {targetDoctrine.counterplay}</p></div></div><div className="command-actions"><button className="primary-button small" onClick={strike} disabled={target.hp <= 0}><Swords size={15} /> Golpear</button><button className="spell-button" onClick={() => cast("lance")} disabled={target.hp <= 0}><span>Q</span><WandSparkles size={15} /> Lança óssea <small>12 mana</small></button><button className="spell-button" onClick={() => cast("drain")} disabled={target.hp <= 0}><span>W</span><Heart size={15} /> Drenar vida <small>16 mana</small></button></div></div></div><aside className="activity-card"><div className="card-heading"><span className="eyebrow">REGISTRO DE CAMPO</span><span className="live-dot">● AO VIVO</span></div><div className="activity-list" key={pulse}>{log.map((entry: string, index: number) => <div key={`${entry}-${index}`} className={`activity-entry ${index === 0 ? "latest" : ""}`}><span className="activity-mark">{index === 0 ? <Sparkles size={12} /> : <CircleDot size={8} />}</span><p>{entry}</p><time>{index === 0 ? "agora" : `${index * 3}m`}</time></div>)}</div></aside></section></>;
}

function WorldMemoryStrip({ memories }: { memories: ReturnType<typeof worldMemoriesForRegion> }) {
  if (!memories.length) return null;
  return <>{memories.map((memory) => <section className="world-memory-strip" key={memory.id}><Archive size={17} /><div><span>O MUNDO LEMBRA · {memory.marker}</span><strong>{memory.title}</strong><p>{memory.expeditionNote} <b>{memory.consequence}</b></p></div></section>)}</>;
}

function CultPresenceStrip({ faction, present }: { faction: CultFactionState; present: boolean }) {
  if (!present || faction.stage === "unseen") return null;
  return <section className="cult-presence-strip"><Moon size={16} /><span><strong>{faction.name}</strong> foi visto nesta região. {faction.status}</span></section>;
}

function BossRumorStrip({ rumors }: { rumors: BossWorldReaction[] }) {
  if (!rumors.length) return null;
  return <>{rumors.map((rumor) => <section className="boss-rumor-strip" key={rumor.bossId}><Crown size={16} /><span><strong>{rumor.bossName} foi avistado com Veyra.</strong>{rumor.expeditionNote}</span></section>)}</>;
}

function MapView({ region, selectedRegion, player, unlocked, visitedRegions, chartedRegionIds = [], clearedEncounters, relicIds, chooseRegion, pendingRouteRegionId, routeHistory, routeRelicIds, commitRoute, worldMemoryIds, cultFaction, bossReactions, setTab }: any) {
  const selectedKnowledge = readRegionKnowledge(region, visitedRegions, clearedEncounters, relicIds);
  const routeRegion = regions.find((item) => item.id === pendingRouteRegionId) ?? region;
  const routeOptions = routesForRegion(routeRegion);
  const selectedMeta = regionKnowledgeMeta[selectedKnowledge];
  const absoluteCount = regions.filter((item) => readRegionKnowledge(item, visitedRegions, clearedEncounters, relicIds) === "absolute").length;
  const stages: RegionKnowledge[] = ["unknown", "mapped", "absolute"];
  const worldMemories = worldMemoryCatalog.filter((memory) => worldMemoryIds.includes(memory.id));
  return <section className="map-view">
    <div className="section-heading"><div><span className="eyebrow">CARTOGRAFIA PROGRESSIVA</span><h2>O atlas não esquece.</h2></div><span className="map-count">{visitedRegions.length} regiões marcadas · {chartedRegionIds.length} delineadas · {absoluteCount} absolutas</span></div>
    <section className="world-memory-ledger" aria-label="Memórias que alteraram o mundo">{worldMemories.length ? worldMemories.map((memory) => <article className="world-memory-card" key={memory.id}><header><span>MEMÓRIA · {memory.kind.toUpperCase()}</span><span>{memory.marker}</span></header><h4>{memory.title}</h4><p>{memory.atlasNote}</p><small>{memory.consequence}</small></article>) : <div className="world-memory-empty"><Archive size={17} /><span>Ainda não há estruturas, silêncios ou juramentos permanentes no mapa. As decisões de Veyra vão deixar tinta nesta folha.</span></div>}</section>
    {cultFaction.stage !== "unseen" && <section className={`cult-faction-ledger ${cultFaction.stage === "betrayed" || cultFaction.stage === "hostile" ? "is-betrayal" : ""}`} aria-label="Presença da facção Culto da Lua Velada"><header><span>FACÇÃO · {cultFaction.marker}</span><span>{cultFaction.name.toUpperCase()}</span></header><article className="cult-faction-card"><div className="cult-faction-mark"><Moon size={19} /></div><div className="cult-faction-copy"><span>{cultFaction.status}</span><h4>{cultFaction.title}</h4><p>{cultFaction.ledgerNote}</p><small>{cultFaction.consequence}</small></div>{cultFaction.presenceRegions.length > 0 && <div className="cult-faction-regions">{cultFaction.presenceRegions.map((regionId: RegionId) => <b key={regionId}>{regions.find((candidate: Region) => candidate.id === regionId)?.name ?? regionId}</b>)}</div>}</article></section>}
    {bossReactions.length > 0 && <section className="boss-rumor-ledger" aria-label="Rumores de chefes ressuscitados"><header><span>RUMORES DE COROAS RESSUSCITADAS</span><span>{bossReactions.length} SOBERANOS</span></header><div className="boss-rumor-grid">{bossReactions.map((reaction: BossWorldReaction) => <article className="boss-rumor-card" key={reaction.bossId}><span>{reaction.marker}</span><h4>{reaction.title}</h4><p>{reaction.atlasNote}</p><small>{reaction.consequence}</small></article>)}</div></section>}
    <div className="map-canvas map-canvas-expanded"><div className="map-contours" /><div className="map-coordinates"><span>{region.coordinates}</span><span>12° 04′ W</span><small>folha 01 · traço de campo</small></div><div className="map-annotation">ROTAS MARCADAS<br /><b>VERGE → {region.name.toUpperCase()}</b></div>
      {regions.map((item: Region, index: number) => {
        const Icon = regionIcons[item.id];
        const open = item.unlockAt <= player.level;
        const visited = visitedRegions.includes(item.id);
        const current = item.id === selectedRegion;
        const charted = chartedRegionIds.includes(item.id);
        const knowledge = readRegionKnowledge(item, visitedRegions, clearedEncounters, relicIds);
        const meta = regionKnowledgeMeta[knowledge];
        const memories = worldMemories.filter((memory) => memory.regionId === item.id);
        return <button key={item.id} className={`region-node node-${index} tone-${item.tone} knowledge-${knowledge} ${current ? "current" : ""} ${visited ? "visited" : ""} ${charted ? "charted" : ""} ${memories.length ? "world-touched" : ""} ${!open ? "locked" : ""}`} onClick={() => chooseRegion(item)}>
          <div className="node-icon">{open ? <Icon size={19} /> : <LockKeyhole size={16} />}</div><div><strong>{item.name}</strong><span>{open ? `${item.level} · ${meta.short.toLowerCase()}` : `selada · nv. ${item.unlockAt}`}</span></div>
          {open && <i className={`knowledge-stamp ${knowledge}`} aria-label={meta.label}>{current ? "AGORA" : meta.short}</i>}
          {memories[0] && <i className="region-world-marker" aria-label={`Marca de mundo: ${memories[0].title}`}>{memories[0].marker}</i>}
          {charted && !visited && <i className="cartographer-mark" aria-label="Fronteira delineada pelo Cartógrafo">TRAÇO</i>}
          {current && <><i className="current-pin" /><img className="node-sigil" src={assets.sigil} alt="" /></>}
        </button>;
      })}
      <div className="map-compass"><Compass size={31} /><span>N</span></div><div className="map-scale">ESCALA 1 : 4.000<br /><span>fronteira conhecida · 11 folhas</span></div>
    </div>
    <div className={`map-detail knowledge-${selectedKnowledge}`}><div className={`map-detail-etching tone-${region.tone}`} aria-label={`Gravura cartográfica de ${region.name}`}><div className="etching-contours" /><span>FOLHA {region.id.slice(0, 3).toUpperCase()} · {region.coordinates}</span><strong>{region.landmark}</strong><i>traço de vigília</i><img src={assets.sigil} alt="" /></div><div><span className="eyebrow">{region.kicker} · {selectedMeta.label}</span><h3>{region.name}</h3><p>{region.description}</p><div className={`knowledge-summary ${selectedKnowledge}`}><img src={assets.sigil} alt="" /><div><span>NOTA DE MARGEM</span><strong>{selectedMeta.label}</strong></div><p>{selectedMeta.note}</p></div><div className="knowledge-stages">{stages.map((stage) => <span className={`${stage === selectedKnowledge ? "active" : ""} ${stage}`} key={stage}>{regionKnowledgeMeta[stage].short}</span>)}</div><div className="landmark"><KeyRound size={14} /><span>MARCO</span><strong>{region.landmark}</strong></div></div><button className="primary-button" onClick={() => chooseRegion(region)}><Compass size={15} /> Escolher estrada</button></div>
    <section className="route-choice-panel" aria-live="polite"><div className="route-choice-heading"><div><span className="eyebrow violet">BIFURCAÇÃO DE EXPEDIÇÃO</span><h3>{routeRegion.name}: como atravessar?</h3><p>O passo decide o inimigo, a recompensa e a memória que o Atlas reterá.</p></div><span>{routeHistory.filter((id: string) => id.startsWith(`${routeRegion.id}-`)).length} / 3 juramentos inscritos</span></div><div className="route-choice-grid">{routeOptions.map((route: ExplorationRoute) => { const claimed = routeHistory.includes(route.id); const relicClaimed = routeRelicIds.includes(route.id); return <article key={route.id} className={`route-choice-card route-${route.kind}`}><span className="route-seal">{route.seal}</span><h4>{route.name}</h4><p>{route.description}</p><dl><div><dt>RISCO</dt><dd>{route.risk}</dd></div><div><dt>ESPÓLIO</dt><dd>{route.reward}</dd></div><div><dt>MARCA</dt><dd>{route.consequence}</dd></div></dl>{route.kind === "unknown" && <small className="route-relic">{relicClaimed ? "RELÍQUIA RARA JÁ RECOLHIDA" : `RELÍQUIA VELADA · ${route.uniqueRelic}`}</small>}<button className="primary-button" onClick={() => commitRoute(route)}><Compass size={15} /> {claimed ? "Percorrer novamente" : "Jurar esta estrada"}</button></article>; })}</div></section>
  </section>;
}

function Necromancy({ player, corpses, canRaise, cast, armyLimit, note, tactics }: any) { return <section className="necromancy-view"><div className="section-heading"><div><span className="eyebrow violet">DISCIPLINA CENTRAL</span><h2>O exército responde.</h2></div><span className="army-capacity">{player.army.length} / {armyLimit} servos</span></div><div className="necromancy-grid"><div className="necromancy-card"><div className="ritual-orb"><img src={assets.sigil} alt="" /><span /></div><span className="eyebrow violet">RITUAL DISPONÍVEL</span><h3>Erguer do silêncio</h3><p>Um corpo derrotado ainda possui uma direção. Transforme-o em presença, não em troféu.</p><button className="primary-button" onClick={() => cast("raise")} disabled={!canRaise}><Skull size={15} /> {canRaise ? "Erguer cadáver" : "Limite atingido"}</button><small className="mana-cost"><Zap size={12} /> 18 mana · {corpses.length} corpos aguardando</small></div><div className="army-roster"><div className="card-heading"><span className="eyebrow">FORMAÇÃO ATUAL</span><span className="roster-order">ordem por vigor</span></div>{player.army.map((unit: string, index: number) => <div className="army-row" key={`${unit}-${index}`}><div className="unit-avatar"><Skull size={17} /></div><div><strong>{unit}</strong><span>{index === 0 ? "batedor · vínculo antigo" : "recém-erguido · sob comando"}</span></div><b>{index === 0 ? 24 : 18} <small>FOR</small></b><button onClick={() => note(`${unit} recebeu a ordem: manter a linha.`)}><Shield size={14} /></button></div>)}{player.army.length < armyLimit && <div className="empty-slot"><CircleDot size={13} /> espaço de comando aberto no nível {player.level + 1}</div>}</div></div><div className="army-tactics-strip"><span className="eyebrow">SIGILO DE FORMAÇÃO</span><strong>+{tactics.damage} dano</strong><strong>{tactics.guard}% guarda</strong><strong>+{tactics.sustain} sustento</strong><small>cada servo torna a linha mais difícil de romper</small></div><div className="necromancy-callout"><Skull size={17} /><p><strong>O cadáver não é um recurso infinito.</strong> Cada servo ocupa um espaço de comando e agora contribui para ataque, guarda e sustentação. A tropa é forte quando a ordem é clara.</p></div></section>; }
function Grimoire({ setTab, note }: any) { const spells = [{ key: "Q", icon: <WandSparkles size={24} />, name: "Lança óssea", type: "PROJÉTIL · RITUAL I", text: "Concentra fragmentos de costela em um dardo que atravessa armadura gasta.", stats: "12 mana · +25 dano" }, { key: "W", icon: <Heart size={24} />, name: "Drenar vida", type: "SUSTENTO · RITUAL I", text: "Rouba calor de um inimigo e o devolve ao corpo da conjuradora.", stats: "16 mana · +22 cura" }]; return <section className="grimoire-view"><div className="section-heading"><div><span className="eyebrow violet">CÍRCULO DE SINTONIA · 2 ESPAÇOS</span><h2>Feitiços que deixam cicatriz.</h2></div><span className="grimoire-note">Q / W no campo</span></div><div className="spell-grid">{spells.map((spell, index) => <div className={`spell-card ${index === 0 ? "featured" : ""}`} key={spell.name}><div className="spell-key">{spell.key}</div><div className={`spell-glyph ${index ? "drain" : ""}`}>{spell.icon}</div><span className="eyebrow violet">{spell.type}</span><h3>{spell.name}</h3><p>{spell.text}</p><div className="spell-stats">{spell.stats}</div><button className="ghost-button" onClick={() => { setTab("expedition"); note(`${spell.name} foi preparado no campo.`); }}>Preparar no campo <ChevronRight size={14} /></button></div>)}<div className="spell-card locked-spell"><div className="spell-key"><LockKeyhole size={15} /></div><div className="spell-glyph locked"><Moon size={24} /></div><span className="eyebrow">RITUAL II</span><h3>Véu de ossos</h3><p>Disponível no nível 3. O exército passa a absorver parte do primeiro golpe.</p><span className="unlock-label"><LockKeyhole size={12} /> desbloqueia no nível 3</span></div></div></section>; }
function Inventory({ player, equipItem }: { player: PlayerState; equipItem: (id: string) => void }) {
  const ownedRewards = regionalRewards.filter((reward) => player.relics.includes(reward.itemId));
  const slots: Array<{ id: EquipmentSlot; label: string }> = [{ id: "weapon", label: "ARMA" }, { id: "armor", label: "ARMADURA" }, { id: "relic", label: "RELÍQUIA" }, { id: "amulet", label: "AMULETO" }, { id: "grimoire", label: "GRIMÓRIO" }, { id: "artifact", label: "ARTEFATO" }];
  const ownedEquipment = equipmentCatalog.filter((item) => player.equipment.includes(item.id));
  return <section className="inventory-view"><div className="section-heading"><div><span className="eyebrow">LOADOUT NECROMÂNTICO</span><h2>Seis peças. Uma vontade.</h2></div><span className="inventory-weight">{ownedEquipment.length} peças identificadas</span></div><div className="equipment-workbench"><section className="loadout-sheet"><div className="loadout-heading"><div><span className="eyebrow amber">EQUIPADO</span><strong>O corpo, o rito e a legião.</strong></div><img src={assets.sigil} alt="Sigilo de Veyra" /></div><div className="loadout-slots">{slots.map((slot) => { const equipped = equipmentCatalog.find((item) => item.id === player.equipped?.[slot.id]); return <article key={slot.id} className={`loadout-slot ${equipped ? `rarity-${equipped.rarity}` : "empty"}`}><span>{slot.label}</span>{equipped ? <><img src={equipped.art} alt="" /><div><strong>{equipped.name}</strong><small>{equipped.effectText}</small></div></> : <div><strong>Vazio</strong><small>A estrada ainda não entregou esta peça.</small></div>}</article>; })}</div></section><section className="equipment-bag"><div className="card-heading"><div><span className="eyebrow violet">SACO DE CAMPANHA</span><p>Escolha uma peça por slot. A troca é imediata e altera o combate.</p></div><span>{ownedEquipment.length} / {equipmentCatalog.length}</span></div><div className="equipment-catalog">{ownedEquipment.map((item) => { const equipped = player.equipped?.[item.slot] === item.id; return <article key={item.id} className={`equipment-item rarity-${item.rarity} ${equipped ? "equipped" : ""}`}><img src={item.art} alt="" /><div><span>{item.slot.toUpperCase()} · {item.rarity.toUpperCase()}</span><strong>{item.name}</strong><p>{item.description}</p><small>{item.effectText}</small></div><button onClick={() => equipItem(item.id)} disabled={equipped}>{equipped ? "EQUIPADO" : "EQUIPAR"}</button></article>; })}</div></section></div><section className="regional-rewards-panel"><div className="card-heading"><div><span className="eyebrow violet">RELÍQUIAS DO ATLAS</span><p>Uma peça única por região nova. O primeiro registro altera o corpo de Veyra.</p></div><span className="reward-count">{ownedRewards.length} / {regionalRewards.length} conquistadas</span></div><div className="regional-reward-grid">{regionalRewards.map((reward) => { const owned = player.relics.includes(reward.itemId); return <article className={`regional-reward-card tone-${reward.tone} ${owned ? "owned" : "sealed"}`} key={reward.itemId}><div className="regional-reward-icon">{owned ? <Check size={18} /> : <LockKeyhole size={16} />}</div><div><span className="eyebrow">{reward.category}</span><h3>{reward.name}</h3><p>{owned ? reward.description : "A relíquia ainda está guardada além da próxima maré."}</p><strong>{owned ? reward.effect : `+${reward.xpBonus} XP por encontro · +${reward.firstClearGold} ouro no primeiro clear`}</strong></div><span className="relic-status">{owned ? "REGISTRADA" : "SELADA"}</span></article>; })}</div></section></section>;
}
function Quests({ questDone, sideQuestDone, setTab, setTargetId, note, sideQuest }: any) { return <section className="quests-view"><div className="section-heading"><div><span className="eyebrow">JORNADA PRINCIPAL</span><h2>O voto encontra um corpo.</h2></div><span className={`quest-status ${questDone ? "done" : ""}`}>{questDone ? "concluída" : "ativa"}</span></div><div className="quest-feature"><div className="quest-art" style={{ backgroundImage: `linear-gradient(90deg, rgba(9,10,13,.9), rgba(9,10,13,.2)), url(${assets.boss})` }}><div className="quest-seal">{questDone ? <Check size={30} /> : <ScrollText size={30} />}<span>{questDone ? "MARCO 01" : "QUEST 01"}</span></div></div><div className="quest-copy"><span className="eyebrow violet">QUEST PRINCIPAL · O VOTO DE SAL</span><h3>Silencie o Guardião do Ossuário</h3><p>O sino do ossuário toca sem vento. O guardião mantém a estrada fechada, mas sua armadura ainda lembra de quem recebeu ordens.</p><div className="objective-list"><div className={questDone ? "completed" : ""}>{questDone ? <Check size={14} /> : <CircleDot size={14} />}<span>Derrotar o Guardião do Ossuário</span><b>{questDone ? "feito" : "0 / 1"}</b></div><div className={questDone ? "completed" : ""}>{questDone ? <Check size={14} /> : <CircleDot size={14} />}<span>Obter o Selo do Guardião</span><b>{questDone ? "feito" : "0 / 1"}</b></div><div><LockKeyhole size={14} /><span>Abrir o caminho do Bosque Velado</span><b>nível 2</b></div></div><div className="quest-reward"><span>RECOMPENSA</span><strong>+110 XP</strong><strong>+75 ouro</strong></div><button className="primary-button" onClick={() => { setTab("expedition"); setTargetId("warden"); note("O objetivo foi marcado. O Guardião aguarda no ossuário."); }}><Target size={15} /> Ir ao objetivo</button></div></div><div className={`side-quest-row ${sideQuestDone ? "completed" : ""}`}><div><span className="eyebrow">SIDE QUEST · ESTRADA</span><strong>Três sinos, nenhum badalo</strong><span>{sideQuestDone ? "Os sinos foram silenciados. A recompensa já foi registrada." : "Silencie os sinos menores que atraem espectros."}</span></div><button className="ghost-button" onClick={sideQuest} disabled={!questDone || sideQuestDone}>{sideQuestDone ? "Side quest concluída" : questDone ? "Concluir side quest · +20 XP" : "Bloqueada pela história"} <ChevronRight size={14} /></button></div></section>; }
