import type { DamageType, Enemy, Servant } from "./gameData";

export type LegionCombo = { id: string; name: string; seal: string; cost: number; damage: number; type: DamageType; status?: "burn" | "corruption" | "curse" | "freeze"; turns?: number; posture?: number; detail: string; recipe: string; active: (legion: Servant[], bosses: Enemy[]) => boolean };

const roles = (legion: Servant[], role: Servant["role"]) => legion.some((unit) => unit.role === role);
const hasDamage = (legion: Servant[], type: DamageType) => legion.some((unit) => unit.active.damageType === type);

export const legionComboCatalog: LegionCombo[] = [
  { id: "death-procession", name: "Cortejo da Morte", seal: "FORMAÇÃO", cost: 22, damage: 78, type: "shadow", status: "curse", turns: 2, posture: 18, detail: "A guarda abre a marcha, a arcanista condena e o carrasco encerra.", recipe: "Guarda + Arcanista + Assalto", active: (legion) => roles(legion, "guard") && roles(legion, "arcanist") && roles(legion, "assault") },
  { id: "toxic-fire", name: "Névoa Tóxica Incendiária", seal: "SINERGIA", cost: 20, damage: 68, type: "fire", status: "burn", turns: 3, detail: "Veneno inflamado cobre a frente inimiga e torna cada ferida um braseiro.", recipe: "Servo de fogo + Servo de veneno", active: (legion) => hasDamage(legion, "fire") && hasDamage(legion, "poison") },
  { id: "tide-of-dead", name: "Maré dos Mortos", seal: "COROA", cost: 26, damage: 86, type: "ice", status: "freeze", turns: 1, posture: 24, detail: "A coroa abissal puxa os cadáveres da formação para uma onda de ossos frios.", recipe: "Servo aquático + Arauto da Maré ressuscitado", active: (legion, bosses) => (hasDamage(legion, "ice") || hasDamage(legion, "physical")) && bosses.some((boss) => boss.id.includes("tide") || boss.name.includes("Maré")) },
];

export function availableLegionCombos(legion: Servant[], bosses: Enemy[]) { return legionComboCatalog.filter((combo) => combo.active(legion, bosses)); }
