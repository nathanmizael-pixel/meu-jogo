/* Necromancer Realms — campanha principal em atos. A história é derivada de provas do mundo, mas o desfecho permanece uma decisão de Veyra. */
import type { RegionId } from "./gameData";
import { initialKingdomDoctrineState, readKingdomDoctrineState, type KingdomDoctrineId, type KingdomDoctrineState } from "./kingdomDoctrine";

export type CampaignActId = "insepulta" | "mortos" | "submerso" | "cinco" | "reino";
export type CampaignEndingId = "crown" | "veil" | "release" | "abyss";

export type CampaignStoryState = {
  seenActs: CampaignActId[];
  endingId: CampaignEndingId | null;
  kingdom: KingdomDoctrineState;
};

export type CampaignSnapshot = {
  defeatedBossIds: string[];
  visitedRegions: RegionId[];
  servantMemoryIds: string[];
};

export type CampaignAct = {
  id: CampaignActId;
  numeral: string;
  title: string;
  seal: string;
  chapter: string;
  revelation: string;
  objective: string;
  progress: number;
  total: number;
  completed: boolean;
  unlocked: boolean;
  targetBossId?: string;
};

export type CampaignEnding = {
  id: CampaignEndingId;
  doctrineId: KingdomDoctrineId;
  title: string;
  seal: string;
  summary: string;
  consequence: string;
};

export const initialCampaignStory: CampaignStoryState = { seenActs: [], endingId: null, kingdom: initialKingdomDoctrineState };

export const campaignEndings: CampaignEnding[] = [
  { id: "crown", doctrineId: "death", title: "O Trono Insepulto", seal: "COROA DE OSSO", summary: "Veyra toma o trono vazio e ordena que os mortos sustentem um reino que não sabe mais respirar.", consequence: "Legado de domínio: o Novo Ciclo reconhece Veyra como soberana das cinco coroas." },
  { id: "veil", doctrineId: "order", title: "O Véu Reescrito", seal: "VÉU DE SAL", summary: "Veyra fecha a ferida entre os vivos e os mortos, guardando o poder sem permitir que ele devore o reino.", consequence: "Legado de vigília: o Novo Ciclo começa sob uma fronteira lembrada e vigiada." },
  { id: "release", doctrineId: "soul", title: "O Nome Devolvido", seal: "ÚLTIMA LIBERDADE", summary: "Veyra devolve aos mortos os nomes roubados e aceita que nenhuma coroa vale uma memória aprisionada.", consequence: "Legado de memória: o Novo Ciclo preserva as confissões que a morte tentou calar." },
  { id: "abyss", doctrineId: "corruption", title: "A Coroa Voraz", seal: "FLOR DO ABISMO", summary: "Veyra aceita a maré que corrói os nomes e ergue um reino que se alimenta da própria morte.", consequence: "Legado de corrupção: o Novo Ciclo começa com a Cidadela respirando sob as pedras." },
];

export function readCampaignStory(value: unknown): CampaignStoryState {
  if (!value || typeof value !== "object") return initialCampaignStory;
  const raw = value as Partial<CampaignStoryState>;
  const validActs: CampaignActId[] = ["insepulta", "mortos", "submerso", "cinco", "reino"];
  const validEndings: CampaignEndingId[] = ["crown", "veil", "release", "abyss"];
  return {
    seenActs: Array.isArray(raw.seenActs) ? raw.seenActs.filter((id): id is CampaignActId => typeof id === "string" && validActs.includes(id as CampaignActId)) : [],
    endingId: typeof raw.endingId === "string" && validEndings.includes(raw.endingId as CampaignEndingId) ? raw.endingId as CampaignEndingId : null,
    kingdom: readKingdomDoctrineState(raw.kingdom),
  };
}

function bossesDefeated(snapshot: CampaignSnapshot, ids: string[]) { return ids.filter((id) => snapshot.defeatedBossIds.includes(id)).length; }

export function readCampaignActs(snapshot: CampaignSnapshot, story: CampaignStoryState): CampaignAct[] {
  const warden = bossesDefeated(snapshot, ["warden"]);
  const tide = bossesDefeated(snapshot, ["tide-herald"]);
  const rose = bossesDefeated(snapshot, ["rose-matriarch"]);
  const finalCrowns = bossesDefeated(snapshot, ["starved-astronomer", "black-salt-hierophant"]);
  const memories = Math.min(2, snapshot.servantMemoryIds.length);
  const charted = Math.min(3, snapshot.visitedRegions.length);
  const firstDone = warden >= 1;
  const secondDone = firstDone && tide >= 1 && memories >= 2;
  const thirdDone = secondDone && rose >= 1 && charted >= 3;
  const fourthDone = thirdDone && finalCrowns >= 2;

  return [
    { id: "insepulta", numeral: "ATO I", title: "A Insepulta", seal: "SINO SEM VENTO", chapter: "Veyra cruza o Verge de Cinza e descobre que o Guardião não vigia um túmulo: vigia uma ordem esquecida.", revelation: "A morte do Guardião foi uma execução ritual, não uma guerra.", objective: "Silenciar o Guardião do Ossuário", progress: warden, total: 1, completed: firstDone, unlocked: true, targetBossId: "warden" },
    { id: "mortos", numeral: "ATO II", title: "Os Mortos Lembram", seal: "PÁGINAS RECUPERADAS", chapter: "O Arauto da Maré chama nomes que Veyra nunca aprendeu. A legião responde com lembranças, não com obediência.", revelation: "As memórias dos servos foram quebradas de propósito; alguém teme o que elas podem contar.", objective: "Derrubar o Arauto e recuperar duas memórias", progress: tide + memories, total: 3, completed: secondDone, unlocked: firstDone, targetBossId: "tide-herald" },
    { id: "submerso", numeral: "ATO III", title: "O Reino Submerso", seal: "CORRENTE SOB A TERRA", chapter: "As raízes da Matriarca bebem uma maré que não pertence a rio algum. O reino antigo continua vivo sob as ruínas.", revelation: "Uma força subterrânea manipula as mortes para reunir as cinco coroas em um único rito.", objective: "Vencer a Matriarca e mapear três territórios", progress: rose + charted, total: 4, completed: thirdDone, unlocked: secondDone, targetBossId: "rose-matriarch" },
    { id: "cinco", numeral: "ATO IV", title: "Os Cinco", seal: "COROAS CONVERGENTES", chapter: "O Astrônomo e o Hierofante mantêm a última parte do mecanismo: céu e sal empurram os mortos para a mesma porta.", revelation: "Os cinco soberanos morreram no mesmo ritual; cada coroa é uma chave voltada para Veyra.", objective: "Tomar as coroas do Astrônomo e do Hierofante", progress: finalCrowns, total: 2, completed: fourthDone, unlocked: thirdDone, targetBossId: finalCrowns === 0 ? "starved-astronomer" : "black-salt-hierophant" },
    { id: "reino", numeral: "ATO V", title: "O Reino dos Mortos", seal: "A ÚLTIMA SENTENÇA", chapter: "Todas as coroas respondem ao nome de Veyra. O portal está aberto, mas o que atravessa depende da sentença que ela inscrever.", revelation: "Veyra não foi escolhida para servir ao reino dos mortos. Ela foi escolhida para decidir o que ele será.", objective: story.endingId ? "A sentença foi registrada no Novo Ciclo" : "Escolher o destino das cinco coroas", progress: story.endingId ? 1 : 0, total: 1, completed: Boolean(story.endingId), unlocked: fourthDone },
  ];
}

export function campaignEndingById(id: CampaignEndingId | null) { return campaignEndings.find((ending) => ending.id === id); }
