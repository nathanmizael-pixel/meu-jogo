/* Gótico de Pergaminho Vivo — livro de afinidades: papel votivo para história, selos materiais para cada destino de Veyra. */
import { Crown, Landmark, Sparkles } from "lucide-react";
import { doctrineById, dominantKingdomDoctrine, kingdomDoctrines, type KingdomDoctrineState } from "@/lib/kingdomDoctrine";

export function KingdomDoctrineLedger({ state }: { state: KingdomDoctrineState }) {
  const dominant = doctrineById(dominantKingdomDoctrine(state));
  const highest = Math.max(1, ...Object.values(state.affinities));
  return <section className={`kingdom-doctrine-ledger doctrine-${dominant?.id ?? "unwritten"}`} aria-label="Doutrinas de reino">
    <header className="doctrine-ledger-heading"><div><span className="eyebrow"><Landmark size={13} /> DOUTRINA DO REINO</span><h2>{dominant ? dominant.title : "A sentença ainda não escolheu uma coroa."}</h2><p>{dominant ? dominant.credo : "Cada decisão de estrada, memória e aliança pesa sobre a forma que o Reino dos Mortos assumirá."}</p></div><div className="doctrine-authority"><Crown size={21} /><span>{dominant?.seal ?? "QUATRO COROAS"}</span></div></header>
    <div className="doctrine-lines">{kingdomDoctrines.map((doctrine) => { const affinity = state.affinities[doctrine.id]; const isDominant = dominant?.id === doctrine.id; return <article key={doctrine.id} className={`doctrine-line ${isDominant ? "is-dominant" : ""}`}><div className="doctrine-line-title"><span>{doctrine.seal}</span><strong>{doctrine.title}</strong><b>{affinity} marca{affinity === 1 ? "" : "s"}</b></div><div className="doctrine-meter"><i style={{ width: `${Math.round((affinity / highest) * 100)}%` }} /></div><small>{isDominant ? `${doctrine.citadelShift} ${doctrine.legionShift}` : doctrine.finalForm}</small></article>; })}</div>
    <footer><Sparkles size={14} /><span>{state.sovereignDoctrineId ? `Doutrina soberana consagrada: ${doctrineById(state.sovereignDoctrineId)?.seal}.` : "A doutrina dominante alterará os termos do rito final."}</span></footer>
  </section>;
}
