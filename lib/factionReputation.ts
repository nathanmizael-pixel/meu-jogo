// Gótico de Pergaminho Vivo: reputação é um registro de atos, nunca uma barra abstrata sem consequência.
export type FactionId = "villages" | "merchants" | "cultists" | "church" | "dead";
export type FactionReputationState = Record<FactionId, number>;
export type FactionReputationEntry = { id: string; factionId: FactionId; delta: number; reason: string; at: number };

export type FactionDefinition = {
  id: FactionId;
  name: string;
  seal: string;
  chamber: string;
  principle: string;
  allied: string;
  hostile: string;
};

export const factionCatalog: FactionDefinition[] = [
  { id: "villages", name: "Vilas", seal: "CASAS DE CINZA", chamber: "As portas que ainda se abrem para os vivos.", principle: "Proteção, abrigo e promessa cumprida.", allied: "Abrigos revelam rotas, rumores e favores de viagem.", hostile: "Sobreviventes se calam; estradas recebem vigílias hostis." },
  { id: "merchants", name: "Mercadores", seal: "BALANÇAS VELADAS", chamber: "A moeda ainda circula onde a morte aceita um preço.", principle: "Troca justa, relíquias preservadas e risco calculado.", allied: "A Mercadora reduz preços e revela peças de estoque ocultas.", hostile: "Taxas sobem e mercadores recusam carregar mercadorias para Veyra." },
  { id: "cultists", name: "Cultistas", seal: "LUA VELADA", chamber: "Devotos que confundem devoção com o direito de possuir um cadáver.", principle: "Pactos, oferendas e sinais da Lua Velada.", allied: "Ritos de estrada tornam-se mais lucrativos, mas cobram marcas.", hostile: "Acólitos organizam emboscadas e tentam romper pactos de Veyra." },
  { id: "church", name: "Igreja", seal: "CERA BRANCA", chamber: "A chama que chama a necromancia de heresia, mas teme os seus mortos.", principle: "Contenção, reparação e proteção dos inocentes.", allied: "Relíquias sagradas e missões de purgação podem ser negociadas.", hostile: "Caçadores de relíquias e sentinelas sagradas passam a perseguir a expedição." },
  { id: "dead", name: "Mortos", seal: "COROAS SEM TÚMULO", chamber: "A memória coletiva daqueles que não aceitaram o silêncio.", principle: "Memória, dignidade e retorno consciente.", allied: "Servos recebem confiança e ritos de retorno custam menos.", hostile: "Ecos recusam ordens e cadáveres despertam sem juramento." },
];

export const initialFactionReputation: FactionReputationState = { villages: 0, merchants: 0, cultists: 0, church: 0, dead: 0 };

export function normalizeFactionReputation(value?: Partial<FactionReputationState>): FactionReputationState {
  return factionCatalog.reduce<FactionReputationState>((next, faction) => ({ ...next, [faction.id]: Math.max(-100, Math.min(100, Math.round(value?.[faction.id] ?? initialFactionReputation[faction.id]))) }), initialFactionReputation);
}

export function factionById(id: FactionId) { return factionCatalog.find((faction) => faction.id === id) ?? factionCatalog[0]; }
export function reputationTier(value: number) {
  if (value >= 70) return { label: "Juramento reconhecido", short: "ALIADA", tone: "allied" as const };
  if (value >= 30) return { label: "Nome respeitado", short: "FAVOR", tone: "favorable" as const };
  if (value <= -70) return { label: "Sentença de caça", short: "CAÇA", tone: "hostile" as const };
  if (value <= -30) return { label: "Relação rompida", short: "RUPTURA", tone: "strained" as const };
  return { label: "Observando Veyra", short: "VIGIA", tone: "neutral" as const };
}

export function reputationPriceMultiplier(merchantReputation: number) { return Math.max(0.7, Math.min(1.35, 1 - merchantReputation / 250)); }
export function reputationRewardMultiplier(villageReputation: number) { return Math.max(0.85, Math.min(1.25, 1 + villageReputation / 400)); }
export function deadRiteDiscount(deadReputation: number) { return Math.max(0, Math.min(4, Math.floor(Math.max(0, deadReputation) / 25))); }

type ChoiceRecord = { id?: string; label?: string; consequence?: string; flag?: string };
export function reputationDeltasForChoice(choice: ChoiceRecord): Partial<FactionReputationState> {
  const wording = [choice.id, choice.label, choice.consequence, choice.flag].filter(Boolean).join(" ").toLowerCase();
  const deltas: Partial<FactionReputationState> = {};
  const add = (id: FactionId, amount: number) => { deltas[id] = (deltas[id] ?? 0) + amount; };
  if (/(salv|abrigo|proteg|sobreviv|socorr)/.test(wording)) { add("villages", 6); add("church", 2); }
  if (/(saque|pilh|roub|moeda|comérc|vender)/.test(wording)) { add("merchants", 4); add("villages", -3); }
  if (/(cult|lua|oferenda|relicário)/.test(wording)) add("cultists", 7);
  if (/(romp|denunci|recus|purga)/.test(wording)) { add("cultists", -6); add("church", 4); }
  if (/(ressusc|ergue|morto|cadáver|alma)/.test(wording)) { add("dead", 6); add("church", -4); }
  if (!Object.keys(deltas).length) add("villages", 1);
  return deltas;
}
