// Estilo do arquivo: Gótico de Pergaminho Vivo — a progressão recompensa risco, descoberta e domínio, não repetição vazia.
import type { Enemy, Encounter, Region } from "./gameData";

export type XpSource = "combat" | "first-encounter" | "discovery" | "regional-relic" | "road-event" | "quest" | "verdict" | "mastery";

export type XpLedgerEntry = {
  id: string;
  source: XpSource;
  label: string;
  amount: number;
  detail: string;
  at: number;
};

export type CombatXpInput = {
  enemy: Enemy;
  playerLevel: number;
  repeatCount: number;
  firstDefeat: boolean;
  libraryLevel: number;
  cycleMultiplier: number;
};

export const xpSourceMeta: Record<XpSource, { label: string; seal: string }> = {
  combat: { label: "Vitória de campo", seal: "CAMPO" },
  "first-encounter": { label: "Primeira vitória", seal: "MARCO" },
  discovery: { label: "Descoberta cartográfica", seal: "ATLAS" },
  "regional-relic": { label: "Relíquia regional", seal: "RELÍQUIA" },
  "road-event": { label: "Decisão de estrada", seal: "PRESSÁGIO" },
  quest: { label: "Objetivo cumprido", seal: "DIÁRIO" },
  verdict: { label: "Veredito tático", seal: "VEREDITO" },
  mastery: { label: "Domínio de campo", seal: "MAESTRIA" },
};

/** Curva de 1 a 70: ritmo claro até a campanha base e desaceleração gradual nos ciclos posteriores. */
export function xpForNextLevel(level: number) {
  if (level >= 70) return 1;
  const safeLevel = Math.max(1, Math.floor(level));
  return Math.round(100 + (safeLevel - 1) * 17 + Math.max(0, safeLevel - 6) * 8 + Math.max(0, safeLevel - 18) * 6);
}

export function levelGapMultiplier(enemyLevel: number, playerLevel: number) {
  const gap = enemyLevel - playerLevel;
  if (gap >= 5) return 1.34;
  if (gap >= 3) return 1.22;
  if (gap >= 1) return 1.1;
  if (gap >= -2) return 1;
  if (gap >= -4) return 0.7;
  return 0.42;
}

export function repetitionMultiplier(repeatCount: number, firstDefeat: boolean) {
  if (firstDefeat) return 1.32;
  if (repeatCount <= 1) return 0.88;
  if (repeatCount === 2) return 0.7;
  if (repeatCount === 3) return 0.54;
  return 0.34;
}

export function combatXp(input: CombatXpInput) {
  const base = input.enemy.xp + input.libraryLevel * 3;
  const scaled = base * levelGapMultiplier(input.enemy.level, input.playerLevel) * repetitionMultiplier(input.repeatCount, input.firstDefeat) * input.cycleMultiplier;
  return Math.max(5, Math.round(scaled));
}

export function firstEncounterXp(encounter: Encounter) {
  const weight = encounter.kind === "boss" ? 64 : encounter.kind === "siege" ? 56 : encounter.kind === "elite" ? 42 : 30;
  return weight + encounter.enemyIds.length * 7;
}

export function discoveryXp(region: Region) {
  const index = Math.max(0, region.unlockAt - 1);
  return 24 + Math.min(44, index * 3);
}

export function masteryXp(weaknessesExploited: number, posturesBroken: number, encounter: Encounter) {
  const knowledge = Math.min(26, weaknessesExploited * 4);
  const control = Math.min(22, posturesBroken * 6);
  const danger = encounter.kind === "boss" ? 16 : encounter.kind === "elite" || encounter.kind === "siege" ? 10 : 0;
  return knowledge + control + danger;
}
