/* Diário de Campo — arquivo bélico gótico; papel carbonizado, selos de osso e métricas de expedição. */
import { useMemo, useState } from "react";
import { Archive, Check, CircleDot, Compass, Crown, LockKeyhole, Moon, ScrollText, Skull, Sparkles, Target } from "lucide-react";
import { assets, equipmentCatalog, secondaryQuests, type SecondaryQuest, type SecondaryQuestCategory } from "@/lib/gameData";
import type { WorldMemory } from "@/lib/worldMemory";
import type { CultFactionState } from "@/lib/cultFaction";
import type { BossWorldReaction } from "@/lib/bossWorldReactions";
import type { personalServantsInLegion } from "@/lib/servantMemories";
import type { personalBondRecords } from "@/lib/legionBonds";
import { CampaignChronicle } from "@/components/CampaignChronicle";
import type { CampaignAct, CampaignEndingId } from "@/lib/mainCampaign";
import { KingdomDoctrineLedger } from "@/components/KingdomDoctrineLedger";
import type { KingdomDoctrineState } from "@/lib/kingdomDoctrine";

type QuestSnapshot = {
  questProgress: Record<string, number>;
  defeatedBossIds: string[];
  relicIds: string[];
  servantTemplateIds: string[];
  eventFlags: string[];
  servantMemoryIds: string[];
};

type FieldJournalProps = {
  questDone: boolean;
  sideQuestDone: boolean;
  setTab: (tab: "expedition") => void;
  setTargetId: (id: string) => void;
  note: (text: string) => void;
  sideQuest: () => void;
  snapshot: QuestSnapshot;
  completedSecondaryQuestIds: string[];
  worldMemories: WorldMemory[];
  cultFaction: CultFactionState;
  bossReactions?: BossWorldReaction[];
  servantMemoryRecords?: ReturnType<typeof personalServantsInLegion>;
  legionBondRecords?: ReturnType<typeof personalBondRecords>;
  campaignActs: CampaignAct[];
  campaignEndingId: CampaignEndingId | null;
  kingdomDoctrineState: KingdomDoctrineState;
  onPursueCampaignAct: (actId: CampaignAct["id"]) => void;
  onChooseCampaignEnding: (endingId: CampaignEndingId) => void;
};

const categoryMeta: Record<SecondaryQuestCategory, { label: string; short: string; description: string }> = {
  contract: { label: "Contratos", short: "CONTRATO", description: "Dívidas de campo pagas em quedas." },
  hunt: { label: "Caçadas", short: "CAÇADA", description: "Presenças raras inscritas no atlas." },
  relic: { label: "Relíquias perdidas", short: "RELÍQUIA", description: "Fragmentos que reescrevem o reino." },
  story: { label: "Histórias de personagens", short: "HISTÓRIA", description: "Confissões que recusam o túmulo." },
  servant_memory: { label: "Memórias dos servos", short: "MEMÓRIA", description: "Vidas que voltam junto aos mortos." },
};

function progressFor(quest: SecondaryQuest, snapshot: QuestSnapshot) {
  const { condition } = quest;
  if (condition.type === "kill") return { current: Math.min(condition.count, snapshot.questProgress[condition.enemyId] ?? 0), total: condition.count };
  if (condition.type === "boss_defeated") return { current: snapshot.defeatedBossIds.includes(condition.bossId) ? 1 : 0, total: 1 };
  if (condition.type === "relic_owned") return { current: snapshot.relicIds.includes(condition.relicId) ? 1 : 0, total: 1 };
  if (condition.type === "relics_owned") return { current: Math.min(condition.count, snapshot.relicIds.length), total: condition.count };
  if (condition.type === "event_flag") return { current: snapshot.eventFlags.includes(condition.flag) ? 1 : 0, total: 1 };
  if (condition.type === "servant_memory") return { current: snapshot.servantMemoryIds.includes(condition.memoryId) ? 1 : 0, total: 1 };
  return { current: snapshot.servantTemplateIds.includes(condition.templateId) ? 1 : 0, total: 1 };
}

function rewardText(quest: SecondaryQuest) {
  const { reward } = quest;
  return [
    reward.xp ? `+${reward.xp} XP` : "",
    reward.gold ? `+${reward.gold} ouro` : "",
    reward.soulFragments ? `+${reward.soulFragments} Fragmentos` : "",
    reward.equipment ? equipmentCatalog.find((item) => item.id === reward.equipment)?.name ?? "Equipamento" : "",
  ].filter(Boolean);
}

export function FieldJournal({ questDone, sideQuestDone, setTab, setTargetId, note, sideQuest, snapshot, completedSecondaryQuestIds, worldMemories, cultFaction, bossReactions = [], servantMemoryRecords = [], legionBondRecords = [], campaignActs, campaignEndingId, kingdomDoctrineState, onPursueCampaignAct, onChooseCampaignEnding }: FieldJournalProps) {
  const [filter, setFilter] = useState<"all" | SecondaryQuestCategory>("all");
  const completedCount = completedSecondaryQuestIds.length;
  const visibleQuests = useMemo(() => filter === "all" ? secondaryQuests : secondaryQuests.filter((quest) => quest.category === filter), [filter]);
  const categoryCounts = useMemo(() => secondaryQuests.reduce<Record<SecondaryQuestCategory, number>>((count, quest) => ({ ...count, [quest.category]: count[quest.category] + 1 }), { contract: 0, hunt: 0, relic: 0, story: 0, servant_memory: 0 }), []);

  return <section className="quests-view diary-field-journal">
    <div className="section-heading diary-heading">
      <div><span className="eyebrow violet"><ScrollText size={12} /> DIÁRIO DE CAMPO · FOLHA 01</span><h2>A morte deixa registros.</h2></div>
      <span className="journal-total"><Check size={14} /> {completedCount} / {secondaryQuests.length} selos fechados</span>
    </div>

    <section className="diary-masthead">
      <div className="diary-seal"><img src={assets.sigil} alt="" /><span>ARQUIVO<br />DE VEYRA</span></div>
      <div><span className="eyebrow">OBJETIVOS SECUNDÁRIOS</span><h3>Todo cadáver carrega uma rota.</h3><p>Contratos, caçadas, relíquias e memórias avançam enquanto a expedição se move. As recompensas são inscritas automaticamente quando o objetivo fecha.</p></div>
      <div className="diary-progress-total"><strong>{Math.round((completedCount / secondaryQuests.length) * 100)}%</strong><span>arquivo concluído</span><i><b style={{ width: `${(completedCount / secondaryQuests.length) * 100}%` }} /></i></div>
    </section>

    <CampaignChronicle acts={campaignActs} endingId={campaignEndingId} onPursueAct={onPursueCampaignAct} onChooseEnding={onChooseCampaignEnding} />
    <KingdomDoctrineLedger state={kingdomDoctrineState} />

    <section className="world-memory-ledger diary-memory-ledger" aria-label="Consequências permanentes registradas no mundo">
      <div className="diary-secondary-heading"><div><span className="eyebrow">MEMÓRIA DO REINO</span><h3>O mundo respondeu a Veyra.</h3></div><span>{worldMemories.length} / 5 marcos inscritos</span></div>
      {worldMemories.length ? worldMemories.map((memory) => <article className="world-memory-card" key={memory.id}><header><span>REGISTRO · {memory.kind.toUpperCase()}</span><span>{memory.marker}</span></header><h4>{memory.title}</h4><p>{memory.atlasNote}</p><small>{memory.consequence}</small></article>) : <div className="world-memory-empty"><Archive size={17} /><span>As escolhas de Veyra ainda não transformaram uma estrada, um abrigo ou um presságio em marca permanente.</span></div>}
    </section>

    {cultFaction.stage !== "unseen" && <section className={`cult-faction-ledger diary-cult-ledger ${cultFaction.stage === "betrayed" || cultFaction.stage === "hostile" ? "is-betrayal" : ""}`} aria-label="Registro da facção Culto da Lua Velada"><header><span>FACÇÃO PERSISTENTE · {cultFaction.marker}</span><span>{cultFaction.name.toUpperCase()}</span></header><article className="cult-faction-card"><div className="cult-faction-mark"><Moon size={19} /></div><div className="cult-faction-copy"><span>{cultFaction.status}</span><h4>{cultFaction.title}</h4><p>{cultFaction.ledgerNote}</p><small>{cultFaction.consequence}</small></div>{cultFaction.presenceRegions.length > 0 && <div className="cult-faction-regions">{cultFaction.presenceRegions.map((regionId) => <b key={regionId}>{regionId}</b>)}</div>}</article></section>}

    {bossReactions.length > 0 && <section className="boss-rumor-ledger" aria-label="Rumores de chefes ressuscitados"><header><span>SOBERANOS RESSUSCITADOS · RUMORES</span><span>{bossReactions.length} / 5 COROAS</span></header><div className="boss-rumor-grid">{bossReactions.map((reaction) => <article className="boss-rumor-card" key={reaction.bossId}><span>{reaction.marker}</span><h4>{reaction.title}</h4><p>{reaction.atlasNote}</p><small>{reaction.consequence}</small></article>)}</div></section>}

    {servantMemoryRecords.length > 0 && <section className="servant-memory-ledger diary-servant-memory-ledger" aria-label="Dossiês de Memórias dos Mortos"><header><div><span className="eyebrow violet">MEMÓRIAS DOS MORTOS</span><h3>A legião começou a lembrar.</h3></div><span>{servantMemoryRecords.reduce((total, record) => total + record.memories.length, 0)} páginas abertas</span></header><div className="servant-memory-grid">{servantMemoryRecords.map(({ servant, profile, memories }) => profile && <article className="servant-memory-card" key={servant.uid}><header><div className="servant-memory-monogram">{profile.trueName.slice(0, 1)}</div><div><span>{profile.marker}</span><h4>{profile.trueName}, {profile.epithet}</h4><small>{profile.legacyTitle}</small></div></header><p className="servant-memory-origin">{profile.originLine}</p><div className="servant-memory-pages">{memories.map((memory) => <div className="servant-memory-page" key={memory.id}><span>{memory.seal}</span><strong>{memory.title}</strong><p>{memory.text}</p><em>{memory.bonus}</em></div>)}</div></article>)}</div></section>}
    {legionBondRecords.length > 0 && <section className="diary-bond-notes" aria-label="Notas de vínculos da legião"><header><span>VÍNCULOS EM OBSERVAÇÃO</span><span>{legionBondRecords.length} servos marcados</span></header>{legionBondRecords.map(({ servant, profile, bonds }) => <p key={servant.uid}><strong>{profile.trueName}:</strong> lealdade {bonds.loyalty}%, confiança {bonds.trust}%, rancor {bonds.rancor}% e corrupção {bonds.corruption}%.</p>)}</section>}

    <section className="diary-secondary-heading"><div><span className="eyebrow">ARQUIVO ABERTO</span><h3>Ordens além do juramento.</h3></div><span>Recompensa na conclusão · sem cliques repetidos</span></section>
    <nav className="diary-filters" aria-label="Filtros de missões secundárias">
      <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}><Archive size={14} /> Todas <b>{secondaryQuests.length}</b></button>
      {(Object.keys(categoryMeta) as SecondaryQuestCategory[]).map((category) => <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}><span>{categoryMeta[category].short}</span> {categoryMeta[category].label} <b>{categoryCounts[category]}</b></button>)}
    </nav>

    <div className="diary-quest-grid">
      {visibleQuests.map((quest) => {
        const progress = progressFor(quest, snapshot);
        const completed = completedSecondaryQuestIds.includes(quest.id);
        const ratio = Math.min(100, Math.round((progress.current / progress.total) * 100));
        const rewards = rewardText(quest);
        return <article key={quest.id} className={`field-quest-card category-${quest.category} ${completed ? "completed" : ""}`}>
          <div className="field-quest-image" style={{ backgroundImage: `linear-gradient(180deg, rgba(7,8,10,.05), rgba(7,8,10,.82)), url(${quest.art})` }}><span>{categoryMeta[quest.category].short}</span>{completed ? <i><Check size={17} /> SELADA</i> : <i><CircleDot size={15} /> ATIVA</i>}</div>
          <div className="field-quest-copy"><div className="field-quest-kicker"><span>{quest.seal}</span><b>{categoryMeta[quest.category].label}</b></div><h3>{quest.title}</h3><p>{quest.description}</p><div className="field-objective"><div><span>{completed ? <Check size={14} /> : <Target size={14} />}</span><strong>{quest.objective}</strong><b>{completed ? "CONCLUÍDA" : `${progress.current} / ${progress.total}`}</b></div><i><b style={{ width: `${ratio}%` }} /></i></div><div className="field-rewards"><span>RECOMPENSAS</span><div>{rewards.map((reward) => <b key={reward}>{reward}</b>)}</div></div></div>
        </article>;
      })}
    </div>

    <div className={`side-quest-row diary-side-quest ${sideQuestDone ? "completed" : ""}`}><div><span className="eyebrow">SIDE QUEST · ESTRADA</span><strong>Três sinos, nenhum badalo</strong><span>{sideQuestDone ? "Os sinos foram silenciados. A recompensa já foi registrada." : "Silencie os sinos menores que atraem espectros."}</span></div><button className="ghost-button" onClick={sideQuest} disabled={!questDone || sideQuestDone}>{sideQuestDone ? "Side quest concluída" : questDone ? "Concluir side quest · +20 XP" : "Bloqueada pela história"} <Compass size={14} /></button></div>
  </section>;
}
