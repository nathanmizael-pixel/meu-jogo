/* Estilo do arquivo: Gótico de Pergaminho Vivo — o arco da campanha aparece como um caderno de evidências selado, não como uma lista de tarefas genérica. */
import { Check, CircleDot, Crown, LockKeyhole, ScrollText, Target } from "lucide-react";
import { assets } from "@/lib/gameData";
import { campaignEndings, type CampaignAct, type CampaignEndingId } from "@/lib/mainCampaign";

type CampaignChronicleProps = {
  acts: CampaignAct[];
  endingId: CampaignEndingId | null;
  onPursueAct: (actId: CampaignAct["id"]) => void;
  onChooseEnding: (endingId: CampaignEndingId) => void;
};

export function CampaignChronicle({ acts, endingId, onPursueAct, onChooseEnding }: CampaignChronicleProps) {
  const activeAct = acts.find((act) => act.unlocked && !act.completed) ?? acts[acts.length - 1];
  const endingReady = acts[acts.length - 1]?.unlocked;

  return <section className="campaign-chronicle" aria-label="Campanha principal em cinco atos">
    <header className="campaign-chronicle-head">
      <div><span className="eyebrow violet"><ScrollText size={12} /> CAMPANHA PRINCIPAL · CINCO ATOS</span><h3>{activeAct.title}</h3><p>{activeAct.chapter}</p></div>
      <div className="campaign-chronicle-seal"><img src={assets.sigil} alt="" /><span>{activeAct.numeral}</span></div>
    </header>

    <div className="campaign-revelation"><Crown size={15} /><div><span>REVELAÇÃO INSCRITA</span><p>{activeAct.revelation}</p></div></div>

    <div className="campaign-act-grid">
      {acts.map((act) => {
        const ratio = Math.min(100, Math.round((act.progress / act.total) * 100));
        return <article className={`campaign-act-card ${act.unlocked ? "unlocked" : "sealed"} ${act.completed ? "completed" : ""} ${act.id === activeAct.id ? "active" : ""}`} key={act.id}>
          <header><span>{act.numeral}</span>{act.completed ? <Check size={15} /> : act.unlocked ? <CircleDot size={15} /> : <LockKeyhole size={14} />}</header>
          <small>{act.seal}</small><h4>{act.title}</h4><p>{act.objective}</p>
          <div className="campaign-act-progress"><b>{act.completed ? "SELADO" : `${act.progress} / ${act.total}`}</b><i><span style={{ width: `${ratio}%` }} /></i></div>
          {act.unlocked && !act.completed && act.id !== "reino" && <button onClick={() => onPursueAct(act.id)}><Target size={13} /> Marcar no campo</button>}
        </article>;
      })}
    </div>

    {endingReady && <section className="campaign-ending-rite">
      <header><span className="eyebrow violet">RITO DE ENCERRAMENTO · ATO V</span><h4>{endingId ? "A sentença permanece no atlas" : "Que reino Veyra deixará aos mortos?"}</h4><p>{endingId ? campaignEndings.find((ending) => ending.id === endingId)?.consequence : "As cinco coroas esperam uma escolha. Cada sentença será preservada quando o manuscrito se reescrever."}</p></header>
      {!endingId && <div className="campaign-ending-grid">{campaignEndings.map((ending) => <button key={ending.id} onClick={() => onChooseEnding(ending.id)}><span>{ending.seal}</span><strong>{ending.title}</strong><p>{ending.summary}</p></button>)}</div>}
    </section>}
  </section>;
}
