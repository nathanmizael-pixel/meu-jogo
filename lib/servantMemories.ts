import type { RegionId, Servant } from "./gameData";

export type ServantMemoryCondition =
  | { type: "bond" }
  | { type: "region"; regionId: RegionId }
  | { type: "flag"; flag: string };

export type ServantMemory = {
  id: string;
  seal: string;
  title: string;
  text: string;
  condition: ServantMemoryCondition;
  bonus: string;
};

export type ServantMemoryProfile = {
  templateId: string;
  trueName: string;
  epithet: string;
  originLine: string;
  marker: string;
  legacyTitle: string;
  legacyRegionId: RegionId;
  memories: ServantMemory[];
};

export type ServantMemorySnapshot = {
  servantTemplateIds: string[];
  visitedRegions: RegionId[];
  eventFlags: string[];
};

export const servantMemoryProfiles: ServantMemoryProfile[] = [
  {
    templateId: "drowned-knight",
    trueName: "Aldren",
    epithet: "o Último Vigia",
    originLine: "Morto em Dorsal de Sal. Ressuscitado por Veyra com o elmo ainda cheio de maré.",
    marker: "VIGÍLIA · SAL E MARÉ",
    legacyTitle: "A Fortaleza que Aldren Abandonou",
    legacyRegionId: "mountain",
    memories: [
      { id: "aldren-first-watch", seal: "MEMÓRIA I · JURAMENTO", title: "A muralha antes da água", text: "Antes da morte, Aldren guardava a Fortaleza de Vaal. Seu posto ficava no alto do Dorsal de Sal, de onde ele via a maré subir sem tocar a montanha.", condition: { type: "bond" }, bonus: "+2 guarda enquanto Aldren integra a legião." },
      { id: "aldren-salt-ruins", seal: "MEMÓRIA II · RETORNO", title: "O homem que abriu o portão", text: "Ao reconhecer as ruínas do Mosteiro da Última Vigília, Aldren se lembra do rosto que abriu o portão para os afogados. A fortaleza ainda guarda uma resposta.", condition: { type: "region", regionId: "mountain" }, bonus: "Um legado pessoal desperta em Dorsal de Sal." },
      { id: "aldren-legacy-kept", seal: "MEMÓRIA III · LEGADO", title: "A vigília reescrita", text: "Aldren escolheu proteger os nomes que jurou esquecer. As ruínas aceitam Veyra como herdeira de uma muralha que não serve mais aos vivos.", condition: { type: "flag", flag: "aldren-legacy-kept" }, bonus: "+1 Fragmento de Alma e um abrigo de vigília em Dorsal de Sal." },
      { id: "aldren-legacy-broken", seal: "MEMÓRIA III · RUPTURA", title: "A porta sem perdão", text: "Aldren mandou a antiga fortaleza cair sobre os culpados. Ele não recupera a inocência, mas a maré deixa de carregar a dívida em silêncio.", condition: { type: "flag", flag: "aldren-legacy-broken" }, bonus: "+56 XP e uma cicatriz de juramento na vigília." },
    ],
  },
  {
    templateId: "thorn-sister",
    trueName: "Seraphine",
    epithet: "a Irmã sem Jardim",
    originLine: "Morta sob os vitrais quebrados da Rosa Negra. Suas raízes respondem a nomes que ninguém mais pronuncia.",
    marker: "ROSA · CONFISSÃO VERMELHA",
    legacyTitle: "As Rosas de Seraphine",
    legacyRegionId: "thornGarden",
    memories: [
      { id: "seraphine-first-bloom", seal: "MEMÓRIA I · PÓLEN", title: "A semente que recusou o inverno", text: "Seraphine cuidava de uma estufa para órfãos de guerra. As rosas que a mataram nasceram do mesmo canteiro que ela protegia das geadas.", condition: { type: "bond" }, bonus: "+1 arcano enquanto Seraphine integra a legião." },
      { id: "seraphine-glasshouse", seal: "MEMÓRIA II · CASA", title: "O nome sob o vidro", text: "No Jardim de Espinhos, uma raiz soletra o nome de sua aprendiz. Seraphine reconhece o traço de uma menina que a Igreja declarou morta antes da colheita.", condition: { type: "region", regionId: "thornGarden" }, bonus: "Um legado pessoal desperta no Jardim de Espinhos." },
      { id: "seraphine-legacy-garden", seal: "MEMÓRIA III · FLORESCER", title: "A estufa dos nomes", text: "Seraphine devolve os nomes das crianças às flores. A estufa deixa de alimentar a Matriarca e passa a guardar uma rota para os que não têm túmulo.", condition: { type: "flag", flag: "seraphine-legacy-garden" }, bonus: "+2 Fragmentos de Alma e uma rota de cura entre os espinhos." },
      { id: "seraphine-legacy-ash", seal: "MEMÓRIA III · CINZA", title: "A última poda", text: "Seraphine aceita que algumas raízes só crescem sobre a culpa. O Jardim sente seu luto e responde com veneno para quem repetir a violência.", condition: { type: "flag", flag: "seraphine-legacy-ash" }, bonus: "+52 XP e veneno ritual registrado no Diário." },
    ],
  },
  {
    templateId: "marga-respirant",
    trueName: "Eren Vahl",
    epithet: "o Último Fôlego",
    originLine: "Morto na Estrada de Marga. Ressuscitado por Veyra ainda repetindo a última rota que tentou salvar.",
    marker: "FÔLEGO · ESTRADA MORTA",
    legacyTitle: "O Abrigo de Eren",
    legacyRegionId: "ashen",
    memories: [
      { id: "eren-last-breath", seal: "MEMÓRIA I · PULSO", title: "A carroça que não chegou", text: "Eren conduzia sobreviventes por Marga. Quando os saqueadores fecharam a estrada, ele cedeu o próprio fôlego para esconder uma criança na carroça vazia.", condition: { type: "bond" }, bonus: "+2 sustentação enquanto Eren integra a legião." },
      { id: "eren-marga-road", seal: "MEMÓRIA II · RASTRO", title: "O abrigo sem teto", text: "Ao retornar ao Verge de Cinza, Eren reconhece três pedras empilhadas na margem. É o sinal de que alguém ainda espera a criança que ele tentou salvar.", condition: { type: "region", regionId: "ashen" }, bonus: "Um legado pessoal desperta na Vila de Marga." },
      { id: "eren-legacy-shelter", seal: "MEMÓRIA III · ABRIGO", title: "A casa que sobreviveu", text: "A criança de Eren cresceu e ergueu um abrigo sobre a estrada. Os viajantes não sabem que o morto que os vigia foi quem lhes deu a primeira noite segura.", condition: { type: "flag", flag: "eren-legacy-shelter" }, bonus: "+18 vitalidade e um abrigo permanente em Marga." },
      { id: "eren-legacy-silence", seal: "MEMÓRIA III · SILÊNCIO", title: "A estrada sem testemunhas", text: "Eren encontra apenas as cinzas do abrigo. Ele pede que Veyra transforme a dor em aviso, e a estrada passa a calar quem chega para cobrar sangue.", condition: { type: "flag", flag: "eren-legacy-silence" }, bonus: "+48 XP e uma estrada mais silenciosa em Marga." },
    ],
  },
];

export function servantMemoryProfileFor(templateId: string) {
  return servantMemoryProfiles.find((profile) => profile.templateId === templateId);
}

export function deriveServantMemoryIds(snapshot: ServantMemorySnapshot) {
  const ids: string[] = [];
  for (const profile of servantMemoryProfiles) {
    if (!snapshot.servantTemplateIds.includes(profile.templateId)) continue;
    for (const memory of profile.memories) {
      const unlocked = memory.condition.type === "bond"
        || memory.condition.type === "region" && snapshot.visitedRegions.includes(memory.condition.regionId)
        || memory.condition.type === "flag" && snapshot.eventFlags.includes(memory.condition.flag);
      if (unlocked) ids.push(memory.id);
    }
  }
  return ids;
}

export function memoriesForServant(templateId: string, memoryIds: string[]) {
  const profile = servantMemoryProfileFor(templateId);
  if (!profile) return [];
  return profile.memories.filter((memory) => memoryIds.includes(memory.id));
}

export function personalServantsInLegion(servants: Servant[], memoryIds: string[]) {
  return servants.map((servant) => ({ servant, profile: servantMemoryProfileFor(servant.templateId), memories: memoriesForServant(servant.templateId, memoryIds) })).filter((entry) => Boolean(entry.profile));
}
