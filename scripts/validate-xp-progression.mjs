import assert from "node:assert/strict";

const xpForNextLevel = (level) => level >= 70 ? 1 : Math.round(100 + (level - 1) * 17 + Math.max(0, level - 6) * 8 + Math.max(0, level - 18) * 6);
const levelGapMultiplier = (gap) => gap >= 5 ? 1.34 : gap >= 3 ? 1.22 : gap >= 1 ? 1.1 : gap >= -2 ? 1 : gap >= -4 ? .7 : .42;
const repeatMultiplier = (repeats, first) => first ? 1.32 : repeats <= 1 ? .88 : repeats === 2 ? .7 : repeats === 3 ? .54 : .34;
const combatXp = ({ base, gap, repeats, first }) => Math.max(5, Math.round(base * levelGapMultiplier(gap) * repeatMultiplier(repeats, first)));

function addXp(state, amount) {
  let { level, xp } = state;
  let remaining = xp + amount;
  while (remaining >= xpForNextLevel(level) && level < 70) {
    remaining -= xpForNextLevel(level);
    level += 1;
  }
  return { level, xp: level >= 70 ? 0 : remaining };
}

// Orçamento de rota principal: uma descoberta, um encontro inaugural e uma relíquia por região;
// chefes têm a recompensa coroada adicional. Os valores representam a tabela de progressão do jogo.
const campaign = [
  { level: 1, enemies: [32, 36], relic: 28 }, { level: 2, enemies: [38, 42], relic: 31 },
  { level: 3, enemies: [44, 48], relic: 34 }, { level: 4, enemies: [51, 56], relic: 37 },
  { level: 5, enemies: [58, 64], relic: 40 }, { level: 6, enemies: [66, 72], relic: 43 },
  { level: 7, enemies: [75, 82], relic: 46 }, { level: 8, enemies: [84, 92], relic: 49 },
  { level: 9, enemies: [96, 105], relic: 52 }, { level: 10, enemies: [110, 120], relic: 55 },
  { level: 11, enemies: [125, 140], relic: 58, boss: true },
];

let state = { level: 1, xp: 0 };
for (const [index, region] of campaign.entries()) {
  const discovery = 24 + Math.min(44, index * 3);
  const encounter = 30 + region.enemies.length * 7;
  state = addXp(state, discovery + encounter + region.relic);
  for (const base of region.enemies) state = addXp(state, combatXp({ base, gap: region.level - state.level, repeats: 0, first: true }));
  if (region.boss) state = addXp(state, 52);
}

const firstKill = combatXp({ base: 100, gap: 0, repeats: 0, first: true });
const fifthRepeat = combatXp({ base: 100, gap: -5, repeats: 5, first: false });
assert.ok(state.level >= 11, `A rota principal terminou apenas no nível ${state.level}.`);
assert.ok(state.level <= 17, `A rota principal ultrapassou o ritmo desejado no nível ${state.level}.`);
assert.ok(fifthRepeat < firstKill * 0.3, "A repetição não foi reduzida o suficiente.");
assert.equal(xpForNextLevel(1), 100, "O limiar inicial precisa preservar o save base.");
assert.ok(xpForNextLevel(25) > xpForNextLevel(10), "A curva precisa crescer ao longo da campanha.");

console.log(JSON.stringify({ campaignEnd: state, firstKill, fifthRepeat, repeatRatio: Number((fifthRepeat / firstKill).toFixed(2)), thresholds: { level1: xpForNextLevel(1), level10: xpForNextLevel(10), level25: xpForNextLevel(25), level70: xpForNextLevel(70) } }, null, 2));
