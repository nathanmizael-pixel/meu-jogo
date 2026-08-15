// Estilo do arquivo: Gótico de Pergaminho Vivo — receitas de build são provas de pacto, não cartões de estatística.
import { LockKeyhole, Sparkles } from "lucide-react";
import { buildSynergyCatalog, type BuildSynergy } from "@/lib/buildSynergies";
import type { SpecializationId } from "@/lib/gameData";

export function BuildSynergyLedger({ activeSynergies, specialization, placement }: { activeSynergies: BuildSynergy[]; specialization: SpecializationId | null; placement: "grimoire" | "necromancy" }) {
  const activeIds = new Set(activeSynergies.map((synergy) => synergy.id));
  return <section className={`build-synergy-ledger build-synergy-${placement}`} aria-label="Sinergias de build">
    <header><div><span className="eyebrow violet"><Sparkles size={13} /> CONVERGÊNCIA DE BUILD</span><h2>O juramento escolhe o que a legião se torna.</h2><p>Uma receita só desperta quando juramento, itens equipados e papéis da formação concordam. Troque uma peça ou um morto e o pacto se desfaz.</p></div><aside><strong>{activeSynergies.length}</strong><small>{activeSynergies.length === 1 ? "PACTO ATIVO" : "PACTOS ATIVOS"}</small></aside></header>
    <div className="build-synergy-grid">{buildSynergyCatalog.map((synergy) => {
      const active = activeIds.has(synergy.id);
      const oathMismatch = specialization && specialization !== synergy.oathId;
      return <article key={synergy.id} className={`${active ? "build-synergy-active" : "build-synergy-locked"} ${oathMismatch ? "build-synergy-other-oath" : ""}`}>
        <div className="build-synergy-mark"><span>{synergy.seal}</span><i>{active ? "ATIVO" : oathMismatch ? "OUTRO VOTO" : "SELADO"}</i></div><div><h3>{synergy.name}</h3><p>{synergy.recipe}</p><strong>{active ? synergy.effectText : synergy.requirement}</strong><small>{synergy.risk}</small></div>{!active && <LockKeyhole size={14} />}</article>;
    })}</div>
    <footer><span>Os bônus entram automaticamente no combate e respeitam as trocas de equipamento, queda de servos e ressurreição.</span><small>{placement === "grimoire" ? "Consulte o Inventário e a Necromancia para completar uma receita." : "Leve uma receita ativa para a Estação de Combate."}</small></footer>
  </section>;
}
