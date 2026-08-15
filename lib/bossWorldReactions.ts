// Estilo do arquivo: Gótico de Pergaminho Vivo — cada coroa reerguida muda o rumor das estradas e deixa tinta no atlas.
import type { RegionId } from "./gameData";

export type BossWorldReaction = {
  bossId: string;
  bossName: string;
  marker: string;
  title: string;
  rumor: string;
  atlasNote: string;
  expeditionNote: string;
  consequence: string;
  regions: RegionId[];
  eventId: string;
};

export const bossWorldReactionCatalog: BossWorldReaction[] = [
  { bossId: "warden", bossName: "Guardião do Ossuário", marker: "RUMOR · SINO", title: "O sino toca para Veyra", rumor: "Dizem que o Guardião do Ossuário voltou, mas agora o sino atende ao passo de uma necromante.", atlasNote: "Peregrinos deixam pequenas moedas nas valas de Marga e evitam falar alto diante de lápides rachadas.", expeditionNote: "Uma nota funerária atravessa a estrada. A região sabe quem carrega o Guardião.", consequence: "A Vigília do Sino pode aparecer nas rotas da Cinza e dos Mortos.", regions: ["ashen", "deadlands"], eventId: "boss-rumor-warden" },
  { bossId: "tide-herald", bossName: "Arauto da Maré", marker: "RUMOR · MARÉ", title: "A maré tem uma nova voz", rumor: "Dizem que o Arauto da Maré voltou. Nas docas, a água recua quando Veyra pronuncia seu nome.", atlasNote: "Redes surgem secas na manhã seguinte e pescadores enterram conchas diante das criptas submersas.", expeditionNote: "Correntes sobem contra a gravidade. Os afogados esperam uma ordem conhecida.", consequence: "O Pedágio da Maré retorna nas rotas de Turfa e da Cripta.", regions: ["swamp", "tideCrypt"], eventId: "boss-rumor-tide-herald" },
  { bossId: "rose-matriarch", bossName: "Matriarca da Rosa Negra", marker: "RUMOR · ROSA", title: "As raízes conhecem o nome de Veyra", rumor: "Dizem que a Matriarca da Rosa Negra floresceu de novo, agora com uma coroa presa ao exército de Veyra.", atlasNote: "Pétalas escuras aparecem em trilhas vazias; jardineiros abandonam a floresta antes do crepúsculo.", expeditionNote: "Espinhos se recolhem em torno da formação e deixam uma carta de seiva no chão.", consequence: "O Testamento da Raiz pode surgir no Bosque e no Jardim.", regions: ["darkwood", "thornGarden"], eventId: "boss-rumor-rose-matriarch" },
  { bossId: "starved-astronomer", bossName: "Astrônomo Faminto", marker: "RUMOR · ECLIPSE", title: "O céu voltou a ser contado", rumor: "Dizem que o Astrônomo Faminto voltou e que algumas estrelas agora se movem para evitar o olhar de Veyra.", atlasNote: "Mapas velhos ganham constelações novas; observadores riscam os próprios olhos antes de dormir.", expeditionNote: "Uma carta celeste se recompõe na margem do Atlas, apontando um presságio fora da rota.", consequence: "A Carta Faminta pode aparecer nas trilhas do Eclipse e da Montanha.", regions: ["eclipse", "mountain"], eventId: "boss-rumor-starved-astronomer" },
  { bossId: "black-salt-hierophant", bossName: "Hierofante do Sal Negro", marker: "RUMOR · ÉDITO", title: "O édito mudou de dono", rumor: "Dizem que o Hierofante do Sal Negro voltou. A Ordem rival teme que seus próprios selos respondam a Veyra.", atlasNote: "Cavaleiros apagam brasões em portas de sal; cartas de rendição chegam sem remetente.", expeditionNote: "Cristais rangem sob a bota da formação. A ordem inimiga reconhece uma voz acima da muralha.", consequence: "A Rendição dos Nove Selos pode aparecer diante do Colosso e do Sal Negro.", regions: ["titan", "blackSalt"], eventId: "boss-rumor-black-salt-hierophant" },
];

export function bossWorldReactionFor(bossId: string) {
  return bossWorldReactionCatalog.find((reaction) => reaction.bossId === bossId);
}

export function reactionsForRaisedBosses(raisedBossIds: string[]) {
  return bossWorldReactionCatalog.filter((reaction) => raisedBossIds.includes(reaction.bossId));
}

export function bossRumorsForRegion(regionId: RegionId, raisedBossIds: string[]) {
  return reactionsForRaisedBosses(raisedBossIds).filter((reaction) => reaction.regions.includes(regionId));
}
