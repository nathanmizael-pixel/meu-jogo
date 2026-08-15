/* Gótico de Pergaminho Vivo: grimório de juramentos exclusivos, marcos de cera e maestria contínua até o nível 70. */
import { BookOpen, ChevronRight, Crown, Heart, LockKeyhole, ScrollText, Sparkles, WandSparkles } from "lucide-react";
import { specializationTrees, type NecromancerAttribute, type NecromancerTalent, type PlayerState, type SpecializationTree } from "@/lib/gameData";
import { xpForNextLevel, xpSourceMeta, type XpLedgerEntry } from "@/lib/xpProgression";
import "./progression-grimoire.css";
import "./oath-focus.css";
import "./xp-ledger.css";

const attributeOrder: NecromancerAttribute[] = ["power", "vitality", "intellect", "dominion", "corruption"];
const attributeCopy: Record<NecromancerAttribute, { name: string; seal: string; effect: string }> = {
  power: { name: "Poder", seal: "POD", effect: "+3 dano físico e ritual" },
  vitality: { name: "Vitalidade", seal: "VIT", effect: "+12 vida máxima" },
  intellect: { name: "Intelecto", seal: "INT", effect: "+8 mana máxima · +3 dano ritual" },
  dominion: { name: "Domínio", seal: "DOM", effect: "+1 limite da legião · reforça formação" },
  corruption: { name: "Corrupção", seal: "COR", effect: "+4% dano sombrio · +2 dano de estados" },
};

type Props = {
  player: PlayerState;
  investAttribute: (attribute: NecromancerAttribute) => void;
  chooseOath: (tree: SpecializationTree) => void;
  unlockTalent: (tree: SpecializationTree, talent: NecromancerTalent) => void;
  enterExpedition: () => void;
  xpLedger: XpLedgerEntry[];
};

export function ProgressionGrimoire({ player, investAttribute, chooseOath, unlockTalent, enterExpedition, xpLedger }: Props) {
  const attributes = player.attributes;
  const known = player.talents ?? [];
  const specialization = specializationTrees.find((tree) => tree.id === player.specialization);
  const oathRank = specialization ? Math.min(70, Math.max(1, player.level)) : 0;
  const nextMilestone = specialization?.milestones.find((milestone) => milestone.level > oathRank);
  const visibleTrees = specialization ? [specialization] : specializationTrees;
  return <section className="progression-grimoire">
    <header className="progression-hero">
      <div className="progression-seal"><Crown size={21} /><i /></div>
      <div><span className="eyebrow violet">GRIMÓRIO DE PROGRESSÃO · NÍVEL {player.level}</span><h2>O cadáver obedece à vontade.</h2><p>{specialization ? `O juramento ${specialization.name} cresce automaticamente com Veyra a cada nível, até a maestria no nível 70.` : "Antes de investir a primeira raiz de talento, escolha o juramento que selará toda a campanha."}</p></div>
      <button className="ghost-button progression-return" onClick={enterExpedition}>Voltar ao campo <ChevronRight size={14} /></button>
    </header>

    <div className="progression-points" aria-label="Pontos e juramento disponíveis">
      <article><Sparkles size={16} /><div><span>PONTOS DE ATRIBUTO</span><strong>{player.attributePoints ?? 0}</strong><small>2 por nível</small></div></article>
      <article><BookOpen size={16} /><div><span>PONTOS DE TALENTO</span><strong>{player.talentPoints ?? 0}</strong><small>1 por nível</small></div></article>
      <article><WandSparkles size={16} /><div><span>JURAMENTO</span><strong>{specialization ? `${specialization.name} · ${oathRank}/70` : "Não selado"}</strong><small>{specialization ? nextMilestone ? `Próximo selo: Nv. ${nextMilestone.level}` : "Maestria plena alcançada" : "Escolha uma das quatro raízes"}</small></div></article>
    </div>

    <section className="xp-ledger-sheet" aria-label="Livro de ganhos de experiência">
      <header className="xp-ledger-heading"><div><span className="eyebrow amber">LIVRO DE RECOMPENSAS</span><h3>Avançar pelo que foi descoberto.</h3><p>A primeira vitória, a rota inédita e o domínio tático rendem mais que confrontos repetidos. Inimigos muito abaixo do seu nível concedem experiência reduzida.</p></div><div className="xp-ledger-pace"><small>PRÓXIMO LIMIAR</small><strong>{player.level >= 70 ? "70 / 70" : `${player.xp} / ${xpForNextLevel(player.level)}`}</strong><span>{player.level >= 70 ? "Maestria selada" : "Ritmo de campanha"}</span></div></header>
      <div className="xp-ledger-rules"><span><b>+32%</b> primeira derrota</span><span><b>+10–34%</b> ameaça acima do nível</span><span><b>34%</b> XP após repetição excessiva</span></div>
      <div className="xp-ledger-list">{xpLedger.length ? xpLedger.slice(0, 5).map((entry) => { const meta = xpSourceMeta[entry.source]; return <article key={entry.id}><span className="xp-ledger-seal">{meta.seal}</span><div><small>{meta.label}</small><strong>{entry.label}</strong><p>{entry.detail}</p></div><b>+{entry.amount} XP</b></article>; }) : <div className="xp-ledger-empty"><Sparkles size={17} /><p>O livro aguarda sua primeira vitória, descoberta ou decisão de estrada.</p></div>}</div>
    </section>

    {specialization && <section className="oath-progress-sheet" aria-label={`Progresso do juramento ${specialization.name}`}>
      <div className="oath-progress-heading"><div><span className="eyebrow amber"><ScrollText size={13} /> JURAMENTO CONTÍNUO</span><h3>{specialization.title}</h3><p>Todo nível fortalece esta trilha. Os selos abaixo registram os marcos de maestria até o nível 70.</p></div><div className="oath-rank-seal"><small>NÍVEL ATUAL</small><strong>{oathRank}<i>/70</i></strong></div></div>
      <div className="oath-track">{specialization.milestones.map((milestone) => { const reached = oathRank >= milestone.level; const active = reached && (oathRank < 70 ? !specialization.milestones.some((item) => item.level > milestone.level && item.level <= oathRank) : milestone.level === 70); return <article key={milestone.level} className={`${reached ? "reached" : ""} ${active ? "active" : ""}`}><div><i>{reached ? "✦" : milestone.level}</i><span>Nv. {milestone.level}</span></div><strong>{milestone.title}</strong><small>{milestone.effect}</small></article>; })}</div>
    </section>}

    <section className="attribute-sheet" aria-label="Atributos do Necromante">
      <div className="sheet-heading"><div><span className="eyebrow">ATRIBUTOS DO NECROMANTE</span><h3>O que cresce dentro do manto.</h3></div><small>Todo ponto altera o combate ou a legião.</small></div>
      <div className="attribute-grid">{attributeOrder.map((attribute) => { const item = attributeCopy[attribute]; return <article key={attribute} className={`attribute-card attribute-${attribute}`}><div className="attribute-seal">{item.seal}</div><div><span>{item.name.toUpperCase()}</span><strong>{attributes?.[attribute] ?? 0}</strong><small>{item.effect}</small></div><button onClick={() => investAttribute(attribute)} disabled={(player.attributePoints ?? 0) < 1} aria-label={`Investir em ${item.name}`}>+</button></article>; })}</div>
    </section>

    <section className="specialization-sheet" aria-label="Juramento e árvore de especialização">
      <div className="sheet-heading"><div><span className="eyebrow violet">{specialization ? "JURAMENTO SELADO" : "QUATRO JURAMENTOS"}</span><h3>{specialization ? `${specialization.name}: uma coroa define a campanha.` : "Escolha a raiz antes do primeiro talento."}</h3></div><small>{specialization ? `${specialization.name} está inscrito no osso até a maestria do nível 70.` : "A escolha é exclusiva e não pode ser reescrita nesta campanha."}</small></div>
      {!specialization && <div className="oath-choice-notice"><LockKeyhole size={17} /><p><strong>O primeiro voto decide a campanha.</strong> Escolha um caminho agora; depois, cada nível até 70 ampliará automaticamente seus efeitos centrais.</p></div>}
      <div className={`specialization-grid ${specialization ? "single-tree" : ""}`}>{visibleTrees.map((tree) => <SpecializationCard key={tree.id} tree={tree} player={player} known={known} oathRank={oathRank} lockedByOther={false} chooseOath={chooseOath} onUnlock={unlockTalent} />)}</div>
    </section>
  </section>;
}

function SpecializationCard({ tree, player, known, oathRank, lockedByOther, chooseOath, onUnlock }: { tree: SpecializationTree; player: PlayerState; known: string[]; oathRank: number; lockedByOther: boolean; chooseOath: (tree: SpecializationTree) => void; onUnlock: (tree: SpecializationTree, talent: NecromancerTalent) => void }) {
  const chosen = player.specialization === tree.id;
  return <article className={`specialization-card tree-${tree.id} ${chosen ? "chosen" : ""} ${lockedByOther ? "sealed" : ""}`}>
    <header><span className={`damage-type type-${tree.accent}`}>{tree.name.slice(0, 2).toUpperCase()}</span><div><span>{tree.title}</span><h4>{tree.name}</h4></div>{lockedByOther && <LockKeyhole size={15} />}</header>
    <p>{tree.description}</p>
    {!player.specialization && <button className="oath-choice-button" onClick={() => chooseOath(tree)}><Crown size={14} /> Selar este juramento <ChevronRight size={13} /></button>}
    {chosen && <div className="card-oath-rank"><span>JURAMENTO CONTÍNUO</span><strong>Nv. {oathRank}<i>/70</i></strong><small>{oathRank >= 70 ? "MAESTRIA" : "cresce a cada nível"}</small></div>}
    <div className="talent-list">{tree.talents.map((talent, index) => { const unlocked = known.includes(talent.id); const parent = tree.talents[index - 1]; const parentMet = !parent || known.includes(parent.id); const eligible = !unlocked && chosen && player.level >= talent.requiredLevel && (player.talentPoints ?? 0) > 0 && parentMet; return <button key={talent.id} className={`talent-node ${unlocked ? "unlocked" : ""} ${eligible ? "available" : ""}`} disabled={!eligible} onClick={() => onUnlock(tree, talent)}><i>{unlocked ? "✦" : talent.tier}</i><span><strong>{talent.name}</strong><small>Nv. {talent.requiredLevel} · {talent.effect}</small></span>{unlocked ? <Sparkles size={14} /> : <em>{eligible ? "DESPERTAR" : lockedByOther ? "SELADO" : !chosen ? "EXIGE JURAMENTO" : player.level < talent.requiredLevel ? `NV ${talent.requiredLevel}` : parentMet ? "SEM PONTOS" : "EXIGE RAIZ"}</em>}</button>; })}</div>
  </article>;
}
