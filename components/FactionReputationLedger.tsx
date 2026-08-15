// Gótico de Pergaminho Vivo: cada linha é uma página de reputação carimbada por uma facção, não um painel genérico.
import { factionCatalog, factionById, reputationTier, type FactionReputationEntry, type FactionReputationState } from "@/lib/factionReputation";

export function FactionReputationLedger({ reputation, history }: { reputation: FactionReputationState; history: FactionReputationEntry[] }) {
  return <section className="reputation-ledger" aria-label="Livro de Reputação">
    <header className="reputation-ledger__heading">
      <div><span className="reputation-ledger__eyebrow">Livro de reputação</span><h3>O nome de Veyra</h3><p>Cada casa, altar e túmulo registra uma versão diferente da necromante.</p></div>
      <span className="reputation-ledger__seal" aria-hidden="true">✦</span>
    </header>
    <div className="reputation-ledger__factions">
      {factionCatalog.map((faction) => {
        const value = reputation[faction.id]; const tier = reputationTier(value);
        return <article key={faction.id} className={`reputation-faction reputation-faction--${faction.id} reputation-faction--${tier.tone}`}>
          <div className="reputation-faction__seal">{faction.seal}</div>
          <div className="reputation-faction__readout"><strong>{faction.name}</strong><span>{tier.short} · {value > 0 ? "+" : ""}{value}</span></div>
          <div className="reputation-faction__meter" aria-label={`${faction.name}: ${value}`}><i style={{ "--reputation-value": `${Math.abs(value)}%` } as React.CSSProperties} /></div>
          <p>{tier.label}. {value >= 30 ? faction.allied : value <= -30 ? faction.hostile : faction.principle}</p>
        </article>;
      })}
    </div>
    <div className="reputation-ledger__history" aria-label="Últimos atos inscritos">
      <span>Últimos atos inscritos</span>
      {history.length ? history.slice(0, 4).map((entry) => <p key={entry.id}><b>{factionById(entry.factionId).name}</b> <em className={entry.delta >= 0 ? "gain" : "loss"}>{entry.delta >= 0 ? "+" : ""}{entry.delta}</em> · {entry.reason}</p>) : <p>Nenhuma facção ainda selou um juízo sobre Veyra.</p>}
    </div>
  </section>;
}
