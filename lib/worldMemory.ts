import type { RegionId } from "@/lib/gameData";

export type WorldMemoryId = "marga-refuge" | "marga-silence" | "ember-waystation" | "tide-seal" | "eclipse-oracle";

export type WorldMemoryContext = {
  eventFlags: string[];
  bestiaryDefeats: Record<string, number>;
  routeHistory: string[];
};

export type WorldMemory = {
  id: WorldMemoryId;
  regionId: RegionId;
  kind: "shelter" | "silence" | "contact" | "ward" | "omen";
  marker: string;
  title: string;
  atlasNote: string;
  expeditionNote: string;
  consequence: string;
  encounterOverrideId?: string;
  transit?: { hp?: number; mana?: number; gold?: number; soulFragments?: number };
  eventChanceDelta?: number;
  isUnlocked: (context: WorldMemoryContext) => boolean;
};

export const worldMemoryCatalog: WorldMemory[] = [
  {
    id: "marga-refuge", regionId: "ashen", kind: "shelter", marker: "ABRIGO", title: "Abrigo da Última Carta",
    atlasNote: "O sobrevivente de Marga firmou uma barraca entre carroças queimadas. A chama permanece acesa quando Veyra retorna.",
    expeditionNote: "O abrigo devolve fôlego à expedição antes da próxima travessia.", consequence: "+14 VIT e +10 mana ao entrar na Verge de Cinza.",
    transit: { hp: 14, mana: 10 },
    isUnlocked: ({ eventFlags }) => eventFlags.includes("pilgrim-saved") && eventFlags.includes("pilgrim-returned"),
  },
  {
    id: "marga-silence", regionId: "ashen", kind: "silence", marker: "SILÊNCIO", title: "Estradas Silenciosas de Marga",
    atlasNote: "Depois de tantas lâminas e tantos nomes apagados, os cobradores abandonaram a estrada. Restaram ecos e sinos sem mãos.",
    expeditionNote: "As patrulhas vivas foram substituídas por um vigília espectral; a estrada agora responde a ritos, não a pedágios.", consequence: "A Patrulha da Estrada Morta se torna a Vigília sem Testemunhas.",
    encounterOverrideId: "ashen-silence",
    isUnlocked: ({ bestiaryDefeats }) => (bestiaryDefeats.marauder ?? 0) >= 8,
  },
  {
    id: "ember-waystation", regionId: "dragon", kind: "contact", marker: "POSTO", title: "Posto de Carvão Protegido",
    atlasNote: "A caravana escoltada deixou um balde de brasas para quem atravessa a caldeira sob o selo de Veyra.",
    expeditionNote: "Mercadores sem sombra reconhecem o sigilo e repõem o foco ritual da expedição.", consequence: "+14 mana e menor chance de presságio de estrada na Caldeira.",
    transit: { mana: 14 }, eventChanceDelta: -0.18,
    isUnlocked: ({ eventFlags }) => eventFlags.includes("caravan-protected"),
  },
  {
    id: "tide-seal", regionId: "tideCrypt", kind: "ward", marker: "SELO", title: "Nó de Sal da Cripta",
    atlasNote: "A arca que deveria ter aberto permanece presa sob um nó de sal. A maré evita o corredor marcado por Veyra.",
    expeditionNote: "O selo reduz o ruído do caminho; menos presságios alcançam a Cripta das Marés.", consequence: "A chance de evento de estrada na Cripta é reduzida.",
    eventChanceDelta: -0.22,
    isUnlocked: ({ eventFlags }) => eventFlags.includes("cache-sealed"),
  },
  {
    id: "eclipse-oracle", regionId: "eclipse", kind: "omen", marker: "ÓRBITA", title: "Órbita Vermelha Registrada",
    atlasNote: "O astrônomo gravou a gota oferecida no mapa. O eclipse chega antes aos olhos de quem conhece o traço.",
    expeditionNote: "A previsão faz as estradas desconhecidas chamarem mais presságios no Observatório.", consequence: "Caminhos desconhecidos ficam mais propensos a revelar acontecimentos raros.",
    eventChanceDelta: 0.2,
    isUnlocked: ({ eventFlags }) => eventFlags.includes("observer-blood"),
  },
];

export function deriveWorldMemoryIds(context: WorldMemoryContext): WorldMemoryId[] {
  return worldMemoryCatalog.filter((memory) => memory.isUnlocked(context)).map((memory) => memory.id);
}

export function worldMemoriesForRegion(regionId: RegionId, activeIds: WorldMemoryId[]) {
  return worldMemoryCatalog.filter((memory) => memory.regionId === regionId && activeIds.includes(memory.id));
}

export function encounterOverrideForRegion(regionId: RegionId, activeIds: WorldMemoryId[]) {
  return worldMemoriesForRegion(regionId, activeIds).find((memory) => memory.encounterOverrideId)?.encounterOverrideId;
}
