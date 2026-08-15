import type { Servant } from "@/lib/gameData";
import { servantMemoryProfileFor } from "@/lib/servantMemories";

export const bondKeys = ["loyalty", "fear", "rancor", "devotion", "corruption", "trust"] as const;
export type LegionBondKey = (typeof bondKeys)[number];
export type LegionBondValues = Record<LegionBondKey, number>;
export type LegionBondState = Record<string, LegionBondValues>;
export type LegionBondDelta = Partial<Record<LegionBondKey, number>>;

export const bondMeta: Record<LegionBondKey, { label: string; short: string; tone: string }> = {
  loyalty: { label: "Lealdade", short: "LEALDADE", tone: "loyalty" },
  fear: { label: "Medo", short: "MEDO", tone: "fear" },
  rancor: { label: "Rancor", short: "RANCOR", tone: "rancor" },
  devotion: { label: "Devoção", short: "DEVOÇÃO", tone: "devotion" },
  corruption: { label: "Corrupção", short: "CORRUPÇÃO", tone: "corruption" },
  trust: { label: "Confiança", short: "CONFIANÇA", tone: "trust" },
};

const authoredBonds: Record<string, LegionBondValues> = {
  "drowned-knight": { loyalty: 72, fear: 15, rancor: 47, devotion: 64, corruption: 23, trust: 58 },
  "thorn-specter": { loyalty: 58, fear: 28, rancor: 32, devotion: 71, corruption: 44, trust: 54 },
  "marga-survivor": { loyalty: 61, fear: 49, rancor: 39, devotion: 42, corruption: 18, trust: 67 },
};

const fallbackBond: LegionBondValues = { loyalty: 45, fear: 30, rancor: 25, devotion: 35, corruption: 20, trust: 48 };
const clamp = (value: unknown, fallback: number) => Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(Number(value)))) : fallback;

export function initialBondsFor(templateId: string): LegionBondValues {
  return { ...(authoredBonds[templateId] ?? fallbackBond) };
}

export function readLegionBonds(value: unknown): LegionBondState {
  if (!value || typeof value !== "object") return {};
  return Object.entries(value as Record<string, unknown>).reduce<LegionBondState>((state, [templateId, raw]) => {
    if (!raw || typeof raw !== "object") return state;
    const fallback = initialBondsFor(templateId);
    state[templateId] = bondKeys.reduce<LegionBondValues>((next, key) => ({ ...next, [key]: clamp((raw as Record<string, unknown>)[key], fallback[key]) }), {} as LegionBondValues);
    return state;
  }, {});
}

export function bondForServant(state: LegionBondState, templateId: string): LegionBondValues {
  const known = state[templateId];
  return known ? { ...known } : initialBondsFor(templateId);
}

export function applyBondDeltas(state: LegionBondState, deltas?: Record<string, LegionBondDelta>): LegionBondState {
  if (!deltas) return state;
  const next = { ...state };
  for (const [templateId, change] of Object.entries(deltas)) {
    const current = bondForServant(next, templateId);
    next[templateId] = bondKeys.reduce<LegionBondValues>((values, key) => ({ ...values, [key]: clamp(current[key] + (change[key] ?? 0), current[key]) }), {} as LegionBondValues);
  }
  return next;
}

export function personalBondRecords(legion: Servant[], bonds: LegionBondState) {
  return legion.flatMap((servant) => {
    const profile = servantMemoryProfileFor(servant.templateId);
    return profile ? [{ servant, profile, bonds: bondForServant(bonds, servant.templateId) }] : [];
  });
}

export function bondStance(values: LegionBondValues) {
  if (values.rancor >= 70) return "Juramento sob ameaça";
  if (values.corruption >= 70) return "Vínculo corrompido";
  if (values.loyalty >= 75 && values.trust >= 65) return "Juramento firme";
  if (values.fear >= 65) return "Obediência inquieta";
  if (values.devotion >= 70) return "Devoção inabalável";
  return "Laço em formação";
}

export function legionBondBonuses(legion: Servant[], bonds: LegionBondState) {
  const personal = personalBondRecords(legion, bonds);
  return personal.reduce((bonus, record) => ({
    damage: bonus.damage + (record.bonds.devotion >= 65 ? 2 : 0) + (record.bonds.rancor >= 65 ? 1 : 0),
    guard: bonus.guard + (record.bonds.trust >= 65 ? 2 : 0),
    sustain: bonus.sustain + (record.bonds.loyalty >= 70 ? 2 : 0),
    magic: bonus.magic + (record.bonds.corruption >= 60 ? 1 : 0),
  }), { damage: 0, guard: 0, sustain: 0, magic: 0 });
}
