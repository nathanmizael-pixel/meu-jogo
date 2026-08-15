/* Gótico de Pergaminho Vivo: o residente é um dossiê vivo dentro da sala, com escolhas que deixam registros no reino. */
import { ArrowUpRight, Check, LockKeyhole, MessageCircle, ScrollText } from "lucide-react";
import type { CitadelNpc, CitadelNpcProgress } from "@/lib/citadelNpcs";

export function CitadelResident({ npc, playerLevel, progress, onService }: { npc: CitadelNpc; playerLevel: number; progress: CitadelNpcProgress; onService: (npc: CitadelNpc) => void }) {
  const met = progress.metIds.includes(npc.id);
  const ready = playerLevel >= npc.unlockAt;
  const claimed = progress.usedServiceIds.includes(npc.id);
  const stage = playerLevel >= 28 ? 2 : playerLevel >= 12 ? 1 : 0;
  return <section className={`citadel-resident-dossier npc-${npc.id} ${met ? "met" : "unmet"}`} aria-label={`Dossiê de ${npc.name}`}>
    <div className="resident-portrait"><img src={npc.art} alt={`Retrato de ${npc.name}`} /><span>{npc.seal}</span></div>
    <div className="resident-copy"><header><span className="eyebrow amber"><MessageCircle size={12} /> HABITANTE RECORRENTE</span><b>{met ? "VÍNCULO REGISTRADO" : "PRESENÇA NOVA"}</b></header><h3>{npc.name}</h3><strong>{npc.title}</strong><p>{met ? npc.campaignLines[stage] : npc.introduction}</p><blockquote>“{npc.campaignLines[stage]}”</blockquote><div className="resident-service"><div><span><ScrollText size={13} /> SERVIÇO</span><strong>{npc.serviceTitle}</strong><p>{npc.serviceDetail}</p></div><small>{npc.serviceCost}</small></div><button onClick={() => onService(npc)} disabled={!ready || claimed}>{!ready ? <><LockKeyhole size={15} /> Retorna no nível {npc.unlockAt}</> : claimed ? <><Check size={15} /> Serviço registrado</> : <><ArrowUpRight size={15} /> {met ? "Pedir serviço" : "Aceitar a audiência"}</>}</button></div>
  </section>;
}
