import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { plansApi } from '../api/plans';
import { ChapterDetail, PairingResult, Plan, PremiseResult } from '../types';

type PlannerState = {
  currentPlan: Plan;
  projects: Plan[];
  isSaving: boolean;
  message: string | null;
  setField: <K extends keyof Plan>(field: K, value: Plan[K]) => void;
  replacePlan: (plan: Plan) => void;
  upsertProject: (plan: Plan) => void;
  persistPlan: (plan: Plan) => Promise<Plan>;
  loadProjects: () => Promise<void>;
  savePlan: () => Promise<Plan>;
  deletePlan: (planId: number) => Promise<void>;
  resetPlan: () => void;
};

const createEmptyPlan = (): Plan => new Plan();
const createDefaultPlan = (): Plan => ({
  ...createEmptyPlan(),
  concept_brief: 'A buttoned-up wedding planner and a chaotic rescue-dog photographer are forced to save a society wedding after a viral disaster.',
  setting: 'Contemporary small-city Australia',
});

const normalizePairing = (pairing?: Partial<PairingResult> | null): PairingResult | null => {
  if (!pairing) {
    return null;
  }

  const base = new PairingResult();
  return {
    ...base,
    ...pairing,
    why_they_clash: Array.isArray(pairing.why_they_clash) ? pairing.why_they_clash : base.why_they_clash,
    why_they_fit: Array.isArray(pairing.why_they_fit) ? pairing.why_they_fit : base.why_they_fit,
    scene_engines: Array.isArray(pairing.scene_engines) ? pairing.scene_engines : base.scene_engines,
    trope_table: Array.isArray(pairing.trope_table) ? pairing.trope_table : base.trope_table,
    emotional_lessons: { ...base.emotional_lessons, ...(pairing.emotional_lessons ?? {}) },
    dominant_story_lane: { ...base.dominant_story_lane, ...(pairing.dominant_story_lane ?? {}) },
    relationship_escalation_path: Array.isArray(pairing.relationship_escalation_path)
      ? pairing.relationship_escalation_path
      : base.relationship_escalation_path,
    risk_notes: Array.isArray(pairing.risk_notes) ? pairing.risk_notes : base.risk_notes,
  };
};

const normalizePremise = (premise?: Partial<PremiseResult> | null): PremiseResult | null => {
  if (!premise) {
    return null;
  }

  const base = new PremiseResult();
  return {
    ...base,
    ...premise,
    dominant_story_lane: { ...base.dominant_story_lane, ...(premise.dominant_story_lane ?? {}) },
    chapter_beats: Array.isArray(premise.chapter_beats) ? premise.chapter_beats : base.chapter_beats,
    relationship_escalation_path: Array.isArray(premise.relationship_escalation_path)
      ? premise.relationship_escalation_path
      : base.relationship_escalation_path,
    scene_contract: { ...base.scene_contract, ...(premise.scene_contract ?? {}), required_elements: Array.isArray(premise.scene_contract?.required_elements) ? premise.scene_contract.required_elements : base.scene_contract.required_elements },
    supporting_cast_roles: Array.isArray(premise.supporting_cast_roles) ? premise.supporting_cast_roles : base.supporting_cast_roles,
  };
};

const normalizeChapterDetails = (chapterDetails?: Array<Partial<ChapterDetail>>): ChapterDetail[] =>
  Array.isArray(chapterDetails) ? chapterDetails.map((chapter) => ({ ...new ChapterDetail(), ...chapter })) : [];

const normalizePlan = (plan?: Partial<Plan> | null): Plan => {
  const base = createDefaultPlan();

  return {
    ...base,
    ...plan,
    flavor_seeds: Array.isArray(plan?.flavor_seeds) ? plan.flavor_seeds : base.flavor_seeds,
    cast: Array.isArray(plan?.cast) ? plan.cast : base.cast,
    chapter_details: normalizeChapterDetails(plan?.chapter_details as Array<Partial<ChapterDetail>> | undefined),
    pairing: normalizePairing(plan?.pairing as Partial<PairingResult> | null | undefined),
    premise: normalizePremise(plan?.premise as Partial<PremiseResult> | null | undefined),
    trope_notes: Array.isArray(plan?.trope_notes) ? plan.trope_notes : base.trope_notes,
  };
};

const normalizePlans = (plans: Array<Partial<Plan>>): Plan[] => plans.map((plan) => normalizePlan(plan));

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      currentPlan: createDefaultPlan(),
      projects: [],
      isSaving: false,
      message: null,
      setField: (field, value) =>
        set((state) => ({
          currentPlan: {
            ...state.currentPlan,
            [field]: value,
          },
        })),
      replacePlan: (plan) => set({ currentPlan: normalizePlan(plan), message: null }),
      upsertProject: (plan) =>
        set((state) => {
          const normalizedPlan = normalizePlan(plan);
          const exists = state.projects.some((project) => project.id === normalizedPlan.id);
          return {
            projects: exists
              ? state.projects.map((project) => (project.id === normalizedPlan.id ? normalizedPlan : project))
              : [normalizedPlan, ...state.projects],
          };
        }),
      persistPlan: async (plan) => {
        set({ isSaving: true, message: null, currentPlan: normalizePlan(plan) });
        const saved = plan.id ? await plansApi.update(plan) : await plansApi.create(plan);
        const normalizedSaved = normalizePlan(saved);
        set((state) => ({
          currentPlan: normalizedSaved,
          projects: state.projects.some((project) => project.id === normalizedSaved.id)
            ? state.projects.map((project) => (project.id === normalizedSaved.id ? normalizedSaved : project))
            : [normalizedSaved, ...state.projects],
          isSaving: false,
          message: 'Plan saved',
        }));
        return normalizedSaved;
      },
      loadProjects: async () => {
        const projects = await plansApi.list();
        set({ projects: normalizePlans(projects) });
      },
      savePlan: async () => {
        set({ isSaving: true, message: null });
        const currentPlan = get().currentPlan;
        const saved = currentPlan.id ? await plansApi.update(currentPlan) : await plansApi.create(currentPlan);
        const normalizedSaved = normalizePlan(saved);
        set((state) => ({
          currentPlan: normalizedSaved,
          projects: currentPlan.id
            ? state.projects.map((project) => (project.id === normalizedSaved.id ? normalizedSaved : project))
            : [normalizedSaved, ...state.projects],
          isSaving: false,
          message: 'Plan saved',
        }));
        return normalizedSaved;
      },
      deletePlan: async (planId) => {
        await plansApi.remove(planId);
        set((state) => ({
          currentPlan: state.currentPlan.id === planId ? createDefaultPlan() : state.currentPlan,
          projects: state.projects.filter((project) => project.id !== planId),
          message: 'Plan deleted',
        }));
      },
      resetPlan: () => set({ currentPlan: createDefaultPlan(), message: null }),
    }),
    {
      name: 'romcon-planner-storage',
      merge: (persistedState, currentState) => {
        const typedState = persistedState as Partial<PlannerState> | undefined;

        return {
          ...currentState,
          ...typedState,
          currentPlan: normalizePlan(typedState?.currentPlan),
          projects: normalizePlans((typedState?.projects as Array<Partial<Plan>> | undefined) ?? []),
        };
      },
    }
  )
);
