// Estilo do arquivo: Gótico de Pergaminho Vivo — os laços da legião são provas emocionais, nunca barras abstratas isoladas.
import { HeartHandshake, ShieldAlert } from "lucide-react";
import { bondKeys, bondMeta, bondStance, type LegionBondState, personalBondRecords } from "@/lib/legionBonds";
import type { Servant } from "@/lib/gameData";

export function LegionBondLedger({ legion, bonds }: { legion: Servant[]; bonds: LegionBondState }) {
  const records = personalBondRecords(legion, bonds);
  if (!records.length) return <section className="legion-bond-ledger empty"><HeartHandshake size={18} /><div><span>VÍNCULOS DA LEGIÃO</span><strong>Nenhum morto marcado respondeu ainda.</strong><p>Servos com Memórias dos Mortos revelarão medo, confiança e juízos próprios quando entrarem na formação.</p></div></section>;
  return <section className="legion-bond-ledger" aria-label="Vínculos da legião"><header><div><span className="eyebrow violet"><HeartHandshake size={13} /> VÍNCULOS DA LEGIÃO</span><h3>Nem todo morto concorda em silêncio.</h3></div><small>{records.length} laços em observação</small></header><div className="legion-bond-grid">{records.map(({ servant, profile, bonds: values }) => <article className="legion-bond-card" key={servant.uid}><div className="legion-bond-card-head"><div className="bond-monogram">{profile.trueName.slice(0, 1)}</div><div><span>{profile.marker}</span><h4>{profile.trueName}, {profile.epithet}</h4><small>{bondStance(values)}</small></div><ShieldAlert size={17} /></div><p>{profile.originLine}</p><div className="bond-meter-grid">{bondKeys.map((key) => <div className={`bond-meter ${bondMeta[key].tone}`} key={key}><span><small>{bondMeta[key].short}</small><b>{values[key]}%</b></span><i><em style={{ width: `${values[key]}%` }} /></i></div>)}</div></article>)}</div></section>;
}
