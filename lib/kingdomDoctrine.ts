/* Necromancer Realms — doutrinas de reino. Escolhas distribuídas acumulam afinidade; a sentença final pode consagrar a doutrina dominante. */
export type KingdomDoctrineId = "death" | "order" | "soul" | "corruption";

export type KingdomDoctrineState = {
  affinities: Record<KingdomDoctrineId, number>;
  markedDecisionIds: string[];
  sovereignDoctrineId: KingdomDoctrineId | null;
};

export type KingdomDoctrine = {
  id: KingdomDoctrineId;
  title: string;
  seal: string;
  credo: string;
  citadelShift: string;
  legionShift: string;
  finalForm: string;
  color: string;
};

export const kingdomDoctrines: KingdomDoctrine[] = [
  { id: "death", title: "Reino da Morte", seal: "COROA FUNERÁRIA", credo: "A ordem nasce quando os mortos sustentam a vontade de uma soberana.", citadelShift: "As muralhas ostentam coroas de osso e estandartes de conquista.", legionShift: "Quedas da legião se tornam juramentos de avanço.", finalForm: "O soberano final se curva diante de um trono que aprendeu a comandar.", color: "bone" },
  { id: "order", title: "Reino da Ordem", seal: "VIGÍLIA DE SAL", credo: "Os mortos devem guardar os vivos sem exigir que estes se curvem.", citadelShift: "Luzes de vigília e placas de rota devolvem abrigo à Cidadela.", legionShift: "A formação protege fronteiras antes de colher coroas.", finalForm: "O soberano final oferece uma última lei para separar túmulo e estrada.", color: "amber" },
  { id: "soul", title: "Reino da Alma", seal: "NOME DEVOLVIDO", credo: "Nenhum morto é ferramenta enquanto sua memória ainda pede um nome.", citadelShift: "Páginas votivas e sinos sem som ocupam os corredores da casa.", legionShift: "Memórias libertadas fortalecem vínculos e ritos de reparação.", finalForm: "O soberano final aparece como a soma das vozes que Veyra recusou calar.", color: "silver" },
  { id: "corruption", title: "Reino da Corrupção", seal: "FLOR DO ABISMO", credo: "A morte não precisa de freio; precisa de uma mão que aceite ser devorada.", citadelShift: "Raízes negras atravessam as pedras e a Cidadela respira com o pântano.", legionShift: "A legião converte ferida, medo e corrupção em impulso ritual.", finalForm: "O soberano final atravessa o véu como uma coroa que tenta possuir Veyra.", color: "violet" },
];

export const initialKingdomDoctrineState: KingdomDoctrineState = {
  affinities: { death: 0, order: 0, soul: 0, corruption: 0 },
  markedDecisionIds: [],
  sovereignDoctrineId: null,
};

export function readKingdomDoctrineState(value: unknown): KingdomDoctrineState {
  if (!value || typeof value !== "object") return initialKingdomDoctrineState;
  const raw = value as Partial<KingdomDoctrineState>;
  const affinities = (raw.affinities ?? {}) as Partial<Record<KingdomDoctrineId, number>>;
  const validSovereign = typeof raw.sovereignDoctrineId === "string" && kingdomDoctrines.some((doctrine) => doctrine.id === raw.sovereignDoctrineId)
    ? raw.sovereignDoctrineId as KingdomDoctrineId : null;
  return {
    affinities: {
      death: Math.max(0, Number(affinities.death) || 0),
      order: Math.max(0, Number(affinities.order) || 0),
      soul: Math.max(0, Number(affinities.soul) || 0),
      corruption: Math.max(0, Number(affinities.corruption) || 0),
    },
    markedDecisionIds: Array.isArray(raw.markedDecisionIds) ? raw.markedDecisionIds.filter((id): id is string => typeof id === "string") : [],
    sovereignDoctrineId: validSovereign,
  };
}

export function dominantKingdomDoctrine(state: KingdomDoctrineState): KingdomDoctrineId | null {
  if (state.sovereignDoctrineId) return state.sovereignDoctrineId;
  const ranking = kingdomDoctrines.map((doctrine) => ({ id: doctrine.id, affinity: state.affinities[doctrine.id] }));
  ranking.sort((a, b) => b.affinity - a.affinity);
  return ranking[0]?.affinity ? ranking[0].id : null;
}

export function doctrineById(id: KingdomDoctrineId | null) { return kingdomDoctrines.find((doctrine) => doctrine.id === id); }

export function doctrineCombatModifiers(id: KingdomDoctrineId | null) {
  if (id === "death") return { armyDamagePct: 12, guard: 0, sustain: 0, magic: 0, resurrectionRecoveryPct: 0 };
  if (id === "order") return { armyDamagePct: 0, guard: 8, sustain: 3, magic: 0, resurrectionRecoveryPct: 0 };
  if (id === "soul") return { armyDamagePct: 0, guard: 2, sustain: 12, magic: 4, resurrectionRecoveryPct: .035 };
  if (id === "corruption") return { armyDamagePct: 5, guard: -2, sustain: 0, magic: 14, resurrectionRecoveryPct: 0 };
  return { armyDamagePct: 0, guard: 0, sustain: 0, magic: 0, resurrectionRecoveryPct: 0 };
}

export function inscribeDoctrineDecision(state: KingdomDoctrineState, decisionId: string, doctrineId: KingdomDoctrineId, amount = 1): KingdomDoctrineState {
  if (state.markedDecisionIds.includes(decisionId)) return state;
  return {
    ...state,
    affinities: { ...state.affinities, [doctrineId]: state.affinities[doctrineId] + amount },
    markedDecisionIds: [...state.markedDecisionIds, decisionId],
  };
}

export function doctrineFromRoadDecision(eventId: string, choiceLabel: string): KingdomDoctrineId {
  const phrase = `${eventId} ${choiceLabel}`.toLowerCase();
  if (/libert|devolv|perdo|nome|sepultar/.test(phrase)) return "soul";
  if (/proteg|abrigo|vig[ií]lia|guardar|salvar|ordem/.test(phrase)) return "order";
  if (/cult|corrup|sacrific|abismo|devor/.test(phrase)) return "corruption";
  return "death";
}
