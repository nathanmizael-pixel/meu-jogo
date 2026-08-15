/* Gótico de Pergaminho Vivo: cada sala é um artefato jogável da casa de Veyra, não um menu isolado. */
import { BookOpen, ChevronLeft, Compass, Flame, Hammer, Skull, Sparkles, TreePine, WandSparkles } from "lucide-react";
import { CitadelResident } from "@/components/CitadelResident";
import type { CitadelNpc, CitadelNpcProgress } from "@/lib/citadelNpcs";
import type { CitadelBuilding, CitadelBuildingId, PlayerState, Tab } from "@/lib/gameData";
import type { KingdomDoctrine } from "@/lib/kingdomDoctrine";

type RoomSpec = {
  seal: string;
  title: string;
  intro: string;
  resident: string;
  residentDetail: string;
  action: string;
  actionDetail: string;
  destination: Tab;
  art: string;
  proof: string;
  objects: [string, string, string];
};

const rooms: Record<CitadelBuildingId, RoomSpec> = {
  tower: {
    seal: "CÍRCULO 01 · VIGÍLIA DO CÉU", title: "Torre Arcana", intro: "O teto rachado aceita a lua, enquanto o astrolábio prende o próximo rito antes que ele aprenda a fugir.", resident: "A Arquivista sem Olhos", residentDetail: "Ela mede o custo de toda palavra proibida antes que Veyra a pronuncie.", action: "Abrir o Grimório", actionDetail: "Preparar juramento, ritos e espaços arcanos.", destination: "grimoire", art: "/manus-storage/citadel-art-direction_d65a4ca9.png", proof: "COORD. CÉU-01 · ASTROLÁBIO SELADO", objects: ["Astrolábio de osso", "Círculo de sal", "Velas de vigília"],
  },
  crypt: {
    seal: "CRIPTA 02 · ORDEM SOB A PEDRA", title: "Cripta da Legião", intro: "Sarcófagos aguardam uma ordem; os mortos despertos escutam cada passo de Veyra como se ainda tivessem coração.", resident: "O Guardião dos Nichos", residentDetail: "Ele grava cada queda para que nenhum nome seja confundido com recurso.", action: "Reunir a Legião", actionDetail: "Revisar servos, vínculos, memórias e evoluções.", destination: "necromancy", art: "/manus-storage/citadel-art-direction_d65a4ca9.png", proof: "COORD. OSS-02 · NICHOS EM VIGÍLIA", objects: ["Bier de vidro negro", "Nichos de vigília", "Correntes de juramento"],
  },
  forge: {
    seal: "FORJA 03 · FERRO OBEDIENTE", title: "Forja Mortuária", intro: "A brasa não aquece carne; ela ensina lâminas, placas e focos a reconhecer a vontade que as carrega.", resident: "Mestre Ferrugem", residentDetail: "O ferreiro morto não fala. O martelo responde por ele, uma vez para cada falha.", action: "Abrir o Arsenal", actionDetail: "Equipar relíquias e consolidar a próxima build.", destination: "inventory", art: "/manus-storage/citadel-art-direction_d65a4ca9.png", proof: "COORD. FER-03 · BRASA DE SAL NEGRO", objects: ["Bigorna de sal negro", "Fornalha selada", "Lâminas suspensas"],
  },
  altar: {
    seal: "ALTAR 04 · PREÇO DO RETORNO", title: "Altar das Almas", intro: "Fragmentos flutuam sobre a pedra. Aqui toda perda pode ser discutida, jamais apagada.", resident: "As Sete Portadoras", residentDetail: "Suas lanternas contam quanto de um morto ainda aceita voltar inteiro.", action: "Abrir o Ossuário", actionDetail: "Reconstituir caídos e examinar o custo das almas.", destination: "necromancy", art: "/manus-storage/citadel-art-direction_d65a4ca9.png", proof: "COORD. ALM-04 · VASO DE RETORNO", objects: ["Vaso de alma partida", "Espelho ritual", "Sete lanternas"],
  },
  library: {
    seal: "ARQUIVO 05 · CONHECIMENTO NÃO APODRECE", title: "Biblioteca dos Mortos", intro: "Mapas de pele e relatórios queimados organizam o medo. A Biblioteca só chama uma ameaça de desconhecida uma vez.", resident: "Bibliotecário de Cinza", residentDetail: "Ele empresta fatos, nunca certezas; toda página retorna mais pesada.", action: "Consultar o Bestiário", actionDetail: "Ler doutrinas, fraquezas e padrões inimigos.", destination: "bestiary", art: "/manus-storage/citadel-art-direction_d65a4ca9.png", proof: "COORD. ARQ-05 · TOMBO NÃO CATALOGADO", objects: ["Órrery de cobre", "Mapas costurados", "Estantes proibidas"],
  },
  garden: {
    seal: "JARDIM 06 · A TERRA DEVOLVE", title: "Jardim Profano", intro: "Flores pálidas bebem o que a estrada deixa para trás. Sob as raízes, ouro e veneno amadurecem juntos.", resident: "A Jardineira Espinhosa", residentDetail: "Ela poda apenas o que já aprendeu a sangrar sem cair.", action: "Preparar Expedição", actionDetail: "Retornar à fronteira com a colheita em ordem.", destination: "expedition", art: "/manus-storage/citadel-art-direction_d65a4ca9.png", proof: "COORD. RAIZ-06 · COLHEITA IMPURA", objects: ["Canteiros funerários", "Canal de água negra", "Mesa de colheita"],
  },
};

const roomIcon = (id: CitadelBuildingId) => ({ tower: WandSparkles, crypt: Skull, forge: Hammer, altar: Sparkles, library: BookOpen, garden: TreePine }[id]);

export function CitadelInterior({ building, level, player, bestiaryKnownCount, doctrine, npc, npcProgress, onNpcService, onClose, onUpgrade, onNavigate }: { building: CitadelBuilding; level: number; player: PlayerState; bestiaryKnownCount: number; doctrine?: KingdomDoctrine; npc?: CitadelNpc; npcProgress: CitadelNpcProgress; onNpcService: (npc: CitadelNpc) => void; onClose: () => void; onUpgrade: () => void; onNavigate: (tab: Tab) => void }) {
  const room = rooms[building.id];
  const Icon = roomIcon(building.id);
  const maxed = level >= building.maxLevel;
  const nextLevel = level + 1;
  const goldCost = building.baseGold * nextLevel;
  const soulCost = (building.baseSouls ?? 0) * Math.ceil(nextLevel / 2);
  const canUpgrade = !maxed && player.gold >= goldCost && player.soulFragments >= soulCost;
  const roomMetric = building.id === "crypt" ? `${player.legion.length} servos em vigília` : building.id === "altar" ? `${player.fallenServants.length} nomes no ossuário` : building.id === "forge" ? `${player.equipment.length} peças recuperadas` : building.id === "library" ? `${bestiaryKnownCount} ameaças registradas` : building.id === "garden" ? `${player.gold} ouro preservado` : `${player.mana}/${player.maxMana} mana ritual`;

  return <section className={`citadel-interior interior-${building.id} ${doctrine ? `doctrine-${doctrine.id}` : "doctrine-unbound"}`} aria-label={`Interior da ${building.name}`}>
    <header className="citadel-interior-topbar"><button className="interior-back" onClick={onClose}><ChevronLeft size={16} /> Voltar ao Pátio</button><span>{room.seal}</span><b>EDIFÍCIO · NV. {level}/{building.maxLevel}</b></header>
    <div className="citadel-interior-scene"><img src={room.art} alt={`Interior da ${building.name}`} /><div className="interior-veil" /><div className="interior-compass"><Compass size={15} /><span>BASE DE VEYRA</span><strong>{level === 0 ? "RUÍNA HABITADA" : "SALA DESPERTA"}</strong></div><div className="interior-room-mark"><Icon size={22} /><span>{building.title}</span></div><div className="interior-room-proof"><i>{String(level + 1).padStart(2, "0")}</i><span>PROVA DE CÂMARA</span><strong>{room.proof}</strong></div></div>
    <div className="citadel-interior-ledger"><div className="interior-lead"><span className="eyebrow amber">{room.seal}</span><h2>{room.title}</h2><p>{room.intro}</p></div><aside className="interior-resident"><span>RESIDENTE</span><strong>{npc?.name ?? room.resident}</strong><p>{npc?.title ?? room.residentDetail}</p></aside><div className="interior-objects">{room.objects.map((object, index) => <span key={object}><i>{String(index + 1).padStart(2, "0")}</i>{object}</span>)}</div><div className="interior-readout"><span>MARCA ATUAL</span><strong>{roomMetric}</strong><small>{building.benefit}</small></div>{doctrine && <aside className="interior-doctrine"><span>{doctrine.seal}</span><strong>{doctrine.title}</strong><p>{doctrine.citadelShift}</p></aside>}{npc && <CitadelResident npc={npc} playerLevel={player.level} progress={npcProgress} onService={onNpcService} />}<footer className="interior-actions"><button className="interior-primary" onClick={() => onNavigate(room.destination)}><Icon size={16} /><span><small>{room.actionDetail}</small>{room.action}</span></button><button className="interior-upgrade" onClick={onUpgrade} disabled={!canUpgrade}>{maxed ? "MAESTRIA DA SALA" : canUpgrade ? `Erguer para Nv. ${nextLevel}` : `${goldCost} ouro${soulCost ? ` · ${soulCost} alma${soulCost > 1 ? "s" : ""}` : ""}`}</button></footer></div>
  </section>;
}
