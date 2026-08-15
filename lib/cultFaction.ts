// Estilo do arquivo: Gótico de Pergaminho Vivo — uma facção deixa rastros curtos, legíveis e persistentes no atlas.
import type { RegionId } from "./gameData";

export type CultStage = "unseen" | "watching" | "favor-due" | "trusted" | "betrayal-imminent" | "betrayed" | "hostile";

export type CultFactionState = {
  id: "veiled-moon";
  name: string;
  stage: CultStage;
  title: string;
  marker: string;
  status: string;
  ledgerNote: string;
  consequence: string;
  presenceRegions: RegionId[];
};

const stageCopy: Record<Exclude<CultStage, "unseen">, Omit<CultFactionState, "id" | "name" | "stage">> = {
  watching: {
    title: "Olhos sob a Lua Velada", marker: "VIGÍLIA 01", status: "O culto recorda que Veyra acendeu as velas de seus mortos.",
    ledgerNote: "Acólitos encapuzados foram vistos entre as ruínas da Floresta de Ossos.", consequence: "Uma segunda audiência pode surgir em uma região distante.", presenceRegions: ["deadlands", "darkwood"],
  },
  "favor-due": {
    title: "Dívida de Sangue Branco", marker: "FAVOR 02", status: "O culto pede uma oferta antes de abrir a própria cripta.",
    ledgerNote: "Uma procissão sem velas segue Veyra em direção às marés e aos espinhos.", consequence: "Aceitar ou abandonar o favor definirá a aliança.", presenceRegions: ["tideCrypt", "thornGarden"],
  },
  trusted: {
    title: "Chave do Santuário Lunar", marker: "ALIANÇA 03", status: "A dívida foi paga; iniciados apontam uma relíquia escondida sob o eclipse.",
    ledgerNote: "O culto reaparece nas rotas altas com mapas lacrados e promessas medidas.", consequence: "A relíquia pode ser reclamada quando o culto retornar.", presenceRegions: ["eclipse", "titan", "mountain"],
  },
  "betrayal-imminent": {
    title: "A Relíquia Tem um Dono", marker: "PRESSÁGIO 04", status: "A Lua Velada ofereceu sua relíquia, mas deixou uma segunda assinatura no osso.",
    ledgerNote: "Sussurros do culto chegam às últimas rotas antes mesmo das tendas aparecerem.", consequence: "Uma traição ritual pode responder em terras de sal.", presenceRegions: ["blackSalt", "eclipse"],
  },
  betrayed: {
    title: "Lua Partida", marker: "RUPTURA 05", status: "O culto tentou converter a aliança em coleira. Veyra sobreviveu ao rito.",
    ledgerNote: "As capas prateadas desapareceram; o Atlas reteve o corte que deixaram.", consequence: "A relíquia permanece, mas a facção não oferece mais abrigo.", presenceRegions: ["blackSalt", "deadlands"],
  },
  hostile: {
    title: "Juramento Recusado", marker: "RUPTURA 01", status: "Veyra recusou ou explorou o culto antes que o véu pudesse se abrir.",
    ledgerNote: "O símbolo lunar aparece riscado nas margens das estradas visitadas.", consequence: "Os acólitos não voltarão como aliados.", presenceRegions: ["deadlands", "darkwood"],
  },
};

export function readCultFaction(eventFlags: string[]): CultFactionState {
  let stage: CultStage = "unseen";
  if (eventFlags.includes("cult-exploited") || eventFlags.includes("cult-oath-broken")) stage = "hostile";
  else if (eventFlags.includes("cult-betrayal-resolved")) stage = "betrayed";
  else if (eventFlags.includes("cult-relic-granted")) stage = "betrayal-imminent";
  else if (eventFlags.includes("cult-favor-resolved")) stage = "trusted";
  else if (eventFlags.includes("cult-aided")) stage = "favor-due";
  if (stage === "unseen") return { id: "veiled-moon", name: "Culto da Lua Velada", stage, title: "Nome ainda selado", marker: "SEM VÍNCULO", status: "Nenhum acólito conhece o passo de Veyra.", ledgerNote: "A Lua Velada ainda não deixou marca no Atlas.", consequence: "Uma escolha futura pode aproximar ou romper esta facção.", presenceRegions: [] };
  return { id: "veiled-moon", name: "Culto da Lua Velada", stage, ...stageCopy[stage] };
}

export function cultIsPresentInRegion(cult: CultFactionState, regionId: RegionId) {
  return cult.presenceRegions.includes(regionId);
}
