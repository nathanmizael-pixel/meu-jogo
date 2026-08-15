// Estilo do arquivo: Gótico de Pergaminho Vivo — um decreto de coroa que torna o risco legível antes do juramento.
import { LockKeyhole } from "lucide-react";
import { challengeModes, cycleBossRelicDrops, type ChallengeModeId, type NewCycleState } from "../lib/gameData";
import { campaignEndingById, type CampaignEndingId } from "../lib/mainCampaign";

type NewCycleLedgerProps = {
  newCycle: NewCycleState;
  campaignCompleted: boolean;
  endingId: CampaignEndingId | null;
  defeatedBossIds: string[];
  beginNewCycle: (mode: ChallengeModeId) => void;
  returnToField: () => void;
};

export function NewCycleLedger({ newCycle, campaignCompleted, endingId, defeatedBossIds, beginNewCycle, returnToField }: NewCycleLedgerProps) {
  const crowns = Object.keys(cycleBossRelicDrops);
  const recoveredCrowns = crowns.filter((id) => defeatedBossIds.includes(id)).length;
  const activeMode = challengeModes.find((mode) => mode.id === newCycle.mode) ?? challengeModes[0];
  const ending = campaignEndingById(endingId);

  return <section className="new-cycle-ledger" aria-label="Decreto do Novo Ciclo">
    <header className="cycle-hero">
      <div><span className="eyebrow violet">DECRETO DE COROA · PÓS-CAMPANHA</span><h2>Novo Ciclo</h2><p>{newCycle.cycle > 0 ? `Ciclo ${newCycle.cycle} em curso sob o selo ${activeMode.name}. ${ending?.consequence ?? "O reino lembra as mortes anteriores e responde com novas regras."}` : ending ? `${ending.consequence} O atlas aceita uma segunda escrita.` : "Tome as cinco coroas e escolha a sentença de Veyra no Diário de Campo antes de reescrever o Atlas."}</p></div>
      <div className="cycle-seal">{newCycle.cycle > 0 ? `CICLO\n${newCycle.cycle}` : "COROA\nSELADA"}</div>
    </header>
    <div className="cycle-progress">
      <div className="cycle-stat"><span>COROAS VENCIDAS</span><strong>{recoveredCrowns}/{crowns.length}</strong></div>
      <div className="cycle-stat"><span>CICLOS COMPLETOS</span><strong>{newCycle.completedCycles}</strong></div>
      <div className="cycle-stat"><span>SELO ATIVO</span><strong>{activeMode.name}</strong></div>
      <div className="cycle-stat"><span>LEGADO FINAL</span><strong>{ending?.title ?? "PENDENTE"}</strong></div>
      <button className="ghost-action" onClick={returnToField}>Retornar à Expedição</button>
    </div>
    {!campaignCompleted && <div className="cycle-locked"><LockKeyhole size={16} /> As cinco coroas precisam cair e Veyra precisa inscrever sua sentença final no Diário antes que o manuscrito aceite uma segunda escrita.</div>}
    <div className="cycle-mode-grid">
      {challengeModes.map((mode) => { const Icon = mode.icon; return <button key={mode.id} className="cycle-mode" disabled={!campaignCompleted} onClick={() => beginNewCycle(mode.id)}><Icon size={25} /><div><small>{mode.seal}</small><h3>{mode.name}</h3><p>{mode.description}</p><p className="cycle-risk">RISCO · {mode.risk}</p><p className="cycle-reward">RETORNO · {mode.reward}</p></div></button>; })}
    </div>
  </section>;
}
