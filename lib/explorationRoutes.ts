// Estilo do arquivo: Gótico de Pergaminho Vivo — cada escolha de viagem deve ser legível como um juramento de estrada.
import type { EncounterKind, Region, RegionId } from "./gameData";

export type ExplorationRouteKind = "safe" | "cursed" | "unknown";

export type ExplorationRoute = {
  id: string;
  kind: ExplorationRouteKind;
  regionId: RegionId;
  name: string;
  seal: string;
  description: string;
  risk: string;
  reward: string;
  consequence: string;
  preferredKinds: EncounterKind[];
  enemyHpMultiplier: number;
  enemyAttackMultiplier: number;
  xpBonus: number;
  goldBonus: number;
  soulFragmentBonus: number;
  legionStrain: number;
  eventChance: number;
  optionalBossChance: number;
  uniqueRelic: string;
};

type RegionRouteIdentity = {
  safeName: string;
  cursedName: string;
  unknownName: string;
  cursedThreat: string;
  unknownOmen: string;
  relic: string;
};

const identities: Record<RegionId, RegionRouteIdentity> = {
  ashen: { safeName: "Trilha das Fogueiras", cursedName: "Estrada das Cinzas Frias", unknownName: "Viela dos Nomes Apagados", cursedThreat: "saqueadores marcam a retaguarda", unknownOmen: "um marco sem mapa chama pelo seu sigilo", relic: "Brasa do Primeiro Marco" },
  darkwood: { safeName: "Clareira dos Vigias", cursedName: "Raiz dos Enforcados", unknownName: "Senda do Chifre Oco", cursedThreat: "raízes golpeiam a formação", unknownOmen: "uma mata que não consta no atlas se abre", relic: "Dente da Matilha Cega" },
  deadlands: { safeName: "Calçada do Ossuário", cursedName: "Ravina dos Sinos", unknownName: "Galeria Sepultada", cursedThreat: "reliquias funerárias atraem revenantes", unknownOmen: "um sino responde debaixo da terra", relic: "Sinete do Sino Oco" },
  swamp: { safeName: "Passadiço de Junco", cursedName: "Lama da Febre", unknownName: "Poço da Lua Verde", cursedThreat: "a febre alcança os servos expostos", unknownOmen: "uma luz anfíbia revela uma margem inexistente", relic: "Vesícula da Febre" },
  mountain: { safeName: "Escadaria do Penhasco", cursedName: "Fenda do Trovão Morto", unknownName: "Santuário da Pedra Cega", cursedThreat: "pedras soltas quebram a marcha", unknownOmen: "uma porta talhada vibra atrás do nevoeiro", relic: "Prego da Pedra Morta" },
  dragon: { safeName: "Caminho das Carcaças", cursedName: "Trilha do Sopro Negro", unknownName: "Ninho sem Céu", cursedThreat: "o calor atrai caçadores de cinza", unknownOmen: "ossos de dragão desenham uma rota secreta", relic: "Escama do Dragão Mudo" },
  titan: { safeName: "Ponte do Colosso", cursedName: "Ventre do Titã", unknownName: "Órbita do Gigante", cursedThreat: "a carne mineral desperta sob seus pés", unknownOmen: "um olho de pedra acompanha o grupo", relic: "Olho do Titã Afundado" },
  tideCrypt: { safeName: "Passagem das Marés Baixas", cursedName: "Canal Afogado", unknownName: "Poço de Coral", cursedThreat: "a maré prende os servos à corrente", unknownOmen: "uma porta de coral se abre fora do ciclo", relic: "Chave do Coral Mudo" },
  thornGarden: { safeName: "Alameda Podada", cursedName: "Jardim da Seiva Negra", unknownName: "Estufa da Coroa", cursedThreat: "espinhos procuram a legião", unknownOmen: "uma flor sem sombra floresce fora do caminho", relic: "Semente da Rosa Silenciosa" },
  eclipse: { safeName: "Varanda do Meridiano", cursedName: "Escada do Eclipse", unknownName: "Câmara de Perigeu", cursedThreat: "a lua morta enfraquece a cura", unknownOmen: "uma constelação aponta para uma porta invisível", relic: "Astrolábio Rachado" },
  blackSalt: { safeName: "Claustro das Colunas", cursedName: "Estrada do Sal Negro", unknownName: "Cripta do Nono Grito", cursedThreat: "cristais de sal cortam os vínculos", unknownOmen: "um selo proibido escurece o mapa", relic: "Cálice do Nono Sal" },
};

export function routesForRegion(region: Region): ExplorationRoute[] {
  const identity = identities[region.id];
  return [
    {
      id: `${region.id}-safe`, kind: "safe", regionId: region.id, name: identity.safeName, seal: "PASSO PROTEGIDO",
      description: "Siga marcos conhecidos e preserve a formação. A estrada é previsível, mas não generosa.",
      risk: "Poucos inimigos · nenhuma exposição da legião", reward: "+8 XP de rota · +10 ouro · progresso seguro",
      consequence: "A rota reduz o perigo e favorece patrulhas controladas.", preferredKinds: ["patrol", "ritual"],
      enemyHpMultiplier: 0.88, enemyAttackMultiplier: 0.9, xpBonus: 8, goldBonus: 10, soulFragmentBonus: 0, legionStrain: 0, eventChance: 0.12, optionalBossChance: 0, uniqueRelic: identity.relic,
    },
    {
      id: `${region.id}-cursed`, kind: "cursed", regionId: region.id, name: identity.cursedName, seal: "JURAMENTO AMALDIÇOADO",
      description: "Pise onde os vivos evitam. A rota promete riqueza, mas cobra sangue e disciplina do exército.",
      risk: `Inimigos reforçados · ${identity.cursedThreat} · desgaste possível`, reward: "+24 XP de rota · +28 ouro · +1 Fragmento de Alma",
      consequence: "A formação sofre desgaste antes do encontro, mas encontra espólios superiores.", preferredKinds: ["ambush", "elite", "siege"],
      enemyHpMultiplier: 1.22, enemyAttackMultiplier: 1.16, xpBonus: 24, goldBonus: 28, soulFragmentBonus: 1, legionStrain: 9, eventChance: 0.28, optionalBossChance: 0.08, uniqueRelic: identity.relic,
    },
    {
      id: `${region.id}-unknown`, kind: "unknown", regionId: region.id, name: identity.unknownName, seal: "MAPA VELADO",
      description: "Rasgue a margem conhecida do atlas. Algo raro pode surgir, mas a estrada não garante retorno.",
      risk: "Evento raro · elite ou chefe opcional · resultado incerto", reward: `+18 XP de rota · relíquia única: ${identity.relic}`,
      consequence: `${identity.unknownOmen}. Uma decisão de campo pode alterar o encontro seguinte.`, preferredKinds: ["elite", "boss", "ritual"],
      enemyHpMultiplier: 1.08, enemyAttackMultiplier: 1.08, xpBonus: 18, goldBonus: 16, soulFragmentBonus: 1, legionStrain: 0, eventChance: 0.72, optionalBossChance: 0.38, uniqueRelic: identity.relic,
    },
  ];
}

export function routeKindLabel(kind: ExplorationRouteKind) {
  return kind === "safe" ? "Segura" : kind === "cursed" ? "Amaldiçoada" : "Desconhecida";
}
