/* Gótico de Pergaminho Vivo: os moradores da Cidadela são testemunhas persistentes, não atalhos de menu. */
import type { CitadelBuildingId, RegionId } from "@/lib/gameData";

export type CitadelNpcId = "cartographer" | "ash-merchant" | "mortuary-smith" | "exiled-priestess" | "ancient-servant";
export type CitadelNpcProgress = { metIds: CitadelNpcId[]; usedServiceIds: string[]; chartedRegionIds: RegionId[] };

export type CitadelNpc = {
  id: CitadelNpcId;
  name: string;
  title: string;
  roomId: CitadelBuildingId;
  art: string;
  seal: string;
  introduction: string;
  serviceTitle: string;
  serviceDetail: string;
  serviceCost: string;
  unlockAt: number;
  campaignLines: [string, string, string];
};

export const initialCitadelNpcProgress: CitadelNpcProgress = { metIds: [], usedServiceIds: [], chartedRegionIds: [] };

export const citadelNpcs: CitadelNpc[] = [
  {
    id: "cartographer", name: "O Cartógrafo", title: "O homem que mede o que a névoa esqueceu", roomId: "library", art: "/manus-storage/citadel-npc-cartographer_62dded99.png", seal: "FOLHA 01 · MARGENS QUE SE MOVEM",
    introduction: "Uma lente de astrolábio substitui o olho perdido. Ele desenha caminhos que ainda não mereceram ser atravessados.", serviceTitle: "Delinear a próxima fronteira", serviceDetail: "Marca uma região acessível, mas ainda não visitada, sem falsificar uma passagem de Veyra.", serviceCost: "1 consulta por região", unlockAt: 1,
    campaignLines: ["A névoa não esconde terras; ela esconde decisões.", "Seu nome já aparece nas margens de três mapas que eu não desenhei.", "Agora o atlas tenta prever Veyra. É uma ambição perigosa para papel."],
  },
  {
    id: "ash-merchant", name: "A Mercadora de Cinzas", title: "A mulher que pesa relíquias pelo silêncio", roomId: "garden", art: "/manus-storage/citadel-npc-merchant_d25a6df5.png", seal: "BALANÇA 02 · ESCAMBO DE BRASA",
    introduction: "Ela guarda peças raras em frascos de fuligem e só aceita ouro quando o metal ainda traz medo.", serviceTitle: "Comprar a Margem de Espinho Vivo", serviceDetail: "Uma página-raro de campo: +14% dano ritual e +14% cura recebida.", serviceCost: "78 ouro · estoque único", unlockAt: 5,
    campaignLines: ["O ouro é uma moeda honesta. Por isso quase ninguém o usa direito.", "As estradas sabem quando você compra poder, Veyra. Cobram juros em sangue.", "Meu estoque acaba quando o reino aprende a fabricar a própria escassez."],
  },
  {
    id: "mortuary-smith", name: "O Ferreiro Mortuário", title: "O martelo que recorda cada cadáver", roomId: "forge", art: "/manus-storage/citadel-npc-forger_c6d1ee1f.png", seal: "BIGORNA 03 · FERRO QUE OBEDECE",
    introduction: "Seu peito contém uma única brasa azul. Quando ela vibra, a forja responde antes mesmo que ele mova a mão.", serviceTitle: "Forjar o Fio de Vigília", serviceDetail: "Cria uma lâmina rara para quebrar postura e sustentar a formação no primeiro choque.", serviceCost: "64 ouro · 2 Fragmentos", unlockAt: 4,
    campaignLines: ["Metal morto dobra melhor quando lembra de ter sido arma.", "A lâmina não serve à mão. Serve ao voto que segura a mão.", "Hoje a forja pediu uma coroa. Eu disse que coroas sempre racham."],
  },
  {
    id: "exiled-priestess", name: "A Sacerdotisa Exilada", title: "A última voz de um sol enterrado", roomId: "tower", art: "/manus-storage/citadel-npc-priestess_3e097f26.png", seal: "CÍRCULO 04 · GRAÇA SEM TEMPLO",
    introduction: "Ela mantém o símbolo sagrado virado para baixo. A luz que ela ainda carrega não perdoa; apenas mostra a ferida.", serviceTitle: "Receber a vigília sagrada", serviceDetail: "Converte um Fragmento de Alma em recuperação de vida e mana antes da próxima expedição.", serviceCost: "1 Fragmento de Alma", unlockAt: 3,
    campaignLines: ["Sagrado não é puro. É apenas aquilo que sobreviveu a ser nomeado.", "Sua necromancia não destruiu o altar, Veyra. Ela revelou quem vivia abaixo dele.", "Há uma oração que nem eu consigo pronunciar. Talvez ela seja sua."],
  },
  {
    id: "ancient-servant", name: "O Servo Antigo", title: "O morto que se lembra antes de Veyra", roomId: "crypt", art: "/manus-storage/citadel-npc-ancient-servant_d0e391e0.png", seal: "NICHO 05 · A CHAVE E A CARTA",
    introduction: "Ele trata Veyra como quem a conheceu antes da queda, mas recusa dizer de que lado da porta estava quando tudo terminou.", serviceTitle: "Abrir uma memória selada", serviceDetail: "Registra uma lembrança do passado de Veyra e entrega experiência de pesquisa, uma única vez.", serviceCost: "Sem custo · verdade única", unlockAt: 2,
    campaignLines: ["Eu guardei a carta porque a senhora pediu. Não porque eu entendi.", "Seu pai não temia a morte. Temia que ela aprendesse a responder.", "Há uma chave que abre a casa antiga. Ela abre também a razão pela qual a senhora partiu."],
  },
];

export function citadelNpcForRoom(roomId: CitadelBuildingId) { return citadelNpcs.find((npc) => npc.roomId === roomId); }
export function citadelNpcStage(npc: CitadelNpc, level: number) { return level >= 28 ? 2 : level >= 12 ? 1 : 0; }
