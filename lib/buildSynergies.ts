// Estilo do arquivo: Gótico de Pergaminho Vivo — builds são pactos legíveis entre juramento, artefatos e mortos.
import type { Servant, SpecializationId } from "@/lib/gameData";

export type BuildSynergyEffect = {
  armyLimit?: number;
  servantDamagePct?: number;
  servantGuard?: number;
  physicalDamagePct?: number;
  ritualDamagePct?: number;
  manaCostReduction?: number;
  manaOnServantFallPct?: number;
  manaOnCorruptionHit?: number;
  manaOnExecution?: number;
  postureDamage?: number;
  servantAbilityHealPct?: number;
  resurrectionCostReduction?: number;
  resurrectionRecoveryPct?: number;
  fallenArmyDamagePct?: number;
};

export type BuildSynergy = {
  id: string;
  seal: string;
  name: string;
  oathId: SpecializationId;
  recipe: string;
  requirement: string;
  effectText: string;
  risk: string;
  effect: BuildSynergyEffect;
  active: (equippedItemIds: string[], legion: Servant[]) => boolean;
};

const hasItems = (equippedItemIds: string[], ...ids: string[]) => ids.every((id) => equippedItemIds.includes(id));
const hasRoles = (legion: Servant[], ...roles: Servant["role"][]) => roles.every((role) => legion.some((servant) => servant.role === role));
const hasAffinity = (legion: Servant[], ...affinities: Servant["affinity"][]) => affinities.some((affinity) => legion.some((servant) => servant.affinity === affinity));

export const buildSynergyCatalog: BuildSynergy[] = [
  {
    id: "ossuary-throng",
    seal: "TRONO DE OSSOS",
    name: "Coroa da Multidão Morta",
    oathId: "bone-lord",
    recipe: "Senhor dos Ossos · Coroa do Rei Morto · Agulha do Ossuário · Guarda + Assalto",
    requirement: "Controle uma Guarda e uma unidade de Assalto sob a Coroa e a Agulha equipadas.",
    effectText: "+1 espaço de legião · +12% dano dos servos · cada queda concede +10% dano de formação até o fim do encontro.",
    risk: "A força vem da perda: a formação ainda pode se desintegrar se os nomes certos tombarem.",
    effect: { armyLimit: 1, servantDamagePct: 12, fallenArmyDamagePct: 10 },
    active: (items, legion) => hasItems(items, "dead-king-crown", "bone-needle") && hasRoles(legion, "guard", "assault"),
  },
  {
    id: "blighted-phylactery",
    seal: "FILACTÉRIO CONTAMINADO",
    name: "Círculo da Última Peste",
    oathId: "lich",
    recipe: "Lich · Grimório da Última Alma · Estilhaço do Eclipse Duplo · Arcanista + afinidade sombria ou veneno",
    requirement: "Mantenha uma Arcanista e uma afinidade Sombria ou Veneno com as duas peças inscritas.",
    effectText: "+14% dano ritual · ritos custam 2 mana a menos · recuperar 4 mana quando um rito explora Corrupção.",
    risk: "A economia só existe quando a praga já está em campo; ritos limpos não alimentam o filactério.",
    effect: { ritualDamagePct: 14, manaCostReduction: 2, manaOnCorruptionHit: 4 },
    active: (items, legion) => hasItems(items, "last-soul-grimoire", "eclipse-splinter") && hasRoles(legion, "arcanist") && hasAffinity(legion, "shadow", "poison"),
  },
  {
    id: "gallows-vanguard",
    seal: "VANGUARDA DA FORCA",
    name: "Sentença de Ferro e Osso",
    oathId: "reaper",
    recipe: "Ceifador · Foice do Carrasco · Selo do Guardião · Assalto + Guarda",
    requirement: "Proteja uma unidade de Assalto com uma Guarda enquanto a Foice e o Selo permanecem equipados.",
    effectText: "+12% dano físico · +8 ruptura de postura · execução restauradora devolve 10 mana.",
    risk: "A recompensa só ocorre em sentenças: perseguir execuções cedo demais deixa Veyra exposta.",
    effect: { physicalDamagePct: 12, postureDamage: 8, manaOnExecution: 10 },
    active: (items, legion) => hasItems(items, "reaper-scythe", "guardian-seal") && hasRoles(legion, "assault", "guard"),
  },
  {
    id: "pilgrim-covenant",
    seal: "CONVÊNIO DO PEREGRINO",
    name: "Vigília das Almas Costuradas",
    oathId: "soul-master",
    recipe: "Mestre das Almas · Anel do Peregrino · Cota do Afogado · Suporte + Guarda",
    requirement: "Una uma unidade de Suporte a uma Guarda e mantenha o Anel e a Cota equipados.",
    effectText: "+20% cura de habilidades de servo · ressurreições custam 2 Fragmentos a menos e recuperam +4% de atributos.",
    risk: "A formação sobrevive mais, mas depende de gastar turnos em proteção e recomposição.",
    effect: { servantAbilityHealPct: 20, resurrectionCostReduction: 2, resurrectionRecoveryPct: .04, servantGuard: 6 },
    active: (items, legion) => hasItems(items, "pilgrim-ring", "drowned-plate") && hasRoles(legion, "support", "guard"),
  },
];

export function availableBuildSynergies({ specialization, equippedItemIds, legion }: { specialization: SpecializationId | null; equippedItemIds: string[]; legion: Servant[] }) {
  return buildSynergyCatalog.filter((synergy) => synergy.oathId === specialization && synergy.active(equippedItemIds, legion));
}

export function totalBuildSynergyEffects(synergies: BuildSynergy[]) {
  return synergies.reduce<Required<BuildSynergyEffect>>((total, synergy) => ({
    armyLimit: total.armyLimit + (synergy.effect.armyLimit ?? 0),
    servantDamagePct: total.servantDamagePct + (synergy.effect.servantDamagePct ?? 0),
    servantGuard: total.servantGuard + (synergy.effect.servantGuard ?? 0),
    physicalDamagePct: total.physicalDamagePct + (synergy.effect.physicalDamagePct ?? 0),
    ritualDamagePct: total.ritualDamagePct + (synergy.effect.ritualDamagePct ?? 0),
    manaCostReduction: total.manaCostReduction + (synergy.effect.manaCostReduction ?? 0),
    manaOnServantFallPct: total.manaOnServantFallPct + (synergy.effect.manaOnServantFallPct ?? 0),
    manaOnCorruptionHit: total.manaOnCorruptionHit + (synergy.effect.manaOnCorruptionHit ?? 0),
    manaOnExecution: total.manaOnExecution + (synergy.effect.manaOnExecution ?? 0),
    postureDamage: total.postureDamage + (synergy.effect.postureDamage ?? 0),
    servantAbilityHealPct: total.servantAbilityHealPct + (synergy.effect.servantAbilityHealPct ?? 0),
    resurrectionCostReduction: total.resurrectionCostReduction + (synergy.effect.resurrectionCostReduction ?? 0),
    resurrectionRecoveryPct: total.resurrectionRecoveryPct + (synergy.effect.resurrectionRecoveryPct ?? 0),
    fallenArmyDamagePct: total.fallenArmyDamagePct + (synergy.effect.fallenArmyDamagePct ?? 0),
  }), { armyLimit: 0, servantDamagePct: 0, servantGuard: 0, physicalDamagePct: 0, ritualDamagePct: 0, manaCostReduction: 0, manaOnServantFallPct: 0, manaOnCorruptionHit: 0, manaOnExecution: 0, postureDamage: 0, servantAbilityHealPct: 0, resurrectionCostReduction: 0, resurrectionRecoveryPct: 0, fallenArmyDamagePct: 0 });
}
