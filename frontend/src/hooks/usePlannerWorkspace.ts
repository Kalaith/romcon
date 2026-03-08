import { useEffect, useState } from 'react';
import { catalogApi } from '../api/catalog';
import { characterLibraryApi } from '../api/characterLibrary';
import { exportPlan } from '../api/export';
import { flavorSeedApi } from '../api/flavorSeeds';
import { generatorApi } from '../api/generators';
import { writerProfileApi } from '../api/writerProfile';
import type { WriterProfilePayload } from '../api/writerProfile';
import { useAuth } from '../contexts/AuthContext';
import { usePlannerStore } from '../stores/usePlannerStore';
import type { CastMember, CharacterLibraryEntry, FlavorSeed, Plan, Trope } from '../types';

export type WorkspaceView = 'planner' | 'cast' | 'writer_profile' | 'summary';
export type PendingRegeneration = 'characters' | 'pairing' | 'premise' | 'chapters' | 'cast' | null;

const regenerationModalCopy: Record<Exclude<PendingRegeneration, null>, { title: string; body: string; confirmLabel: string }> = {
  characters: {
    title: 'Replace the current lead packs?',
    body: 'Regenerating characters will overwrite the current Lead One and Lead Two packs in this story. Use this only if you are happy to replace the existing versions.',
    confirmLabel: 'Replace Lead Packs',
  },
  pairing: {
    title: 'Replace the current pairing analysis?',
    body: 'Regenerating the pairing will overwrite the current clash, fit, trope, and lesson logic for this story.',
    confirmLabel: 'Replace Pairing',
  },
  premise: {
    title: 'Replace the current premise?',
    body: 'Regenerating the premise will overwrite the current logline, premise engine, supporting roles, and chapter beats.',
    confirmLabel: 'Replace Premise',
  },
  chapters: {
    title: 'Replace the current chapter details?',
    body: 'Generating chapter details will overwrite the current chapter-by-chapter scene map for this story.',
    confirmLabel: 'Replace Chapter Plan',
  },
  cast: {
    title: 'Replace the current supporting cast?',
    body: 'Regenerating story cast will overwrite the current supporting cast for this story. Your shared character library will remain available.',
    confirmLabel: 'Replace Story Cast',
  },
};

export function usePlannerWorkspace() {
  const { user, logout, getLinkAccountUrl, getAccessToken } = useAuth();
  const currentPlan = usePlannerStore((state) => state.currentPlan);
  const projects = usePlannerStore((state) => state.projects);
  const isSaving = usePlannerStore((state) => state.isSaving);
  const storeMessage = usePlannerStore((state) => state.message);
  const setField = usePlannerStore((state) => state.setField);
  const replacePlan = usePlannerStore((state) => state.replacePlan);
  const upsertProject = usePlannerStore((state) => state.upsertProject);
  const persistPlan = usePlannerStore((state) => state.persistPlan);
  const loadProjects = usePlannerStore((state) => state.loadProjects);
  const savePlan = usePlannerStore((state) => state.savePlan);
  const deletePlan = usePlannerStore((state) => state.deletePlan);
  const resetPlan = usePlannerStore((state) => state.resetPlan);

  const [tropes, setTropes] = useState<Trope[]>([]);
  const [flavorSeeds, setFlavorSeeds] = useState<FlavorSeed[]>([]);
  const [libraryEntries, setLibraryEntries] = useState<CharacterLibraryEntry[]>([]);
  const [writerProfile, setWriterProfile] = useState<WriterProfilePayload | null>(null);
  const [activeView, setActiveView] = useState<WorkspaceView>('planner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plannerMessage, setPlannerMessage] = useState<string | null>(null);
  const [plannerError, setPlannerError] = useState<string | null>(null);
  const [tropeMessage, setTropeMessage] = useState<string | null>(null);
  const [tropeError, setTropeError] = useState<string | null>(null);
  const [castMessage, setCastMessage] = useState<string | null>(null);
  const [castError, setCastError] = useState<string | null>(null);
  const [writerProfileMessage, setWriterProfileMessage] = useState<string | null>(null);
  const [writerProfileError, setWriterProfileError] = useState<string | null>(null);
  const [pendingRegeneration, setPendingRegeneration] = useState<PendingRegeneration>(null);

  const hasLeads = Boolean(currentPlan.lead_one && currentPlan.lead_two);
  const hasPairing = Boolean(currentPlan.pairing);
  const hasPremise = Boolean(currentPlan.premise);
  const hasStoryCast = currentPlan.cast.length > 0;
  const hasChapterDetails = currentPlan.chapter_details.length > 0;
  const hasSavedPlan = Boolean(currentPlan.id);

  useEffect(() => {
    setPlannerMessage(storeMessage);
  }, [storeMessage]);

  useEffect(() => {
    void catalogApi.tropes().then(setTropes);
    void flavorSeedApi.list().then(setFlavorSeeds);
    void characterLibraryApi.list().then(setLibraryEntries);
    void writerProfileApi.get().then(setWriterProfile);
    void loadProjects();
  }, [loadProjects]);

  const reloadLibraryEntries = async () => {
    try {
      const entries = await characterLibraryApi.list();
      setLibraryEntries(entries);
    } catch (taskError) {
      setCastError(taskError instanceof Error ? taskError.message : 'Unable to load character library.');
    }
  };

  const updatePlanField = <K extends keyof Plan>(field: K, value: Plan[K]) => {
    setField(field, value);
  };

  const runTask = async (task: () => Promise<void>, onError: (message: string | null) => void = setPlannerError) => {
    setIsGenerating(true);
    onError(null);
    try {
      await task();
    } catch (taskError) {
      onError(taskError instanceof Error ? taskError.message : 'Something went wrong.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'json' | 'xml') => {
    try {
      setPlannerError(null);
      const token = await getAccessToken();
      await exportPlan(currentPlan, format, token);
      setPlannerMessage(`Exported ${format.toUpperCase()} package.`);
    } catch (taskError) {
      setPlannerError(taskError instanceof Error ? taskError.message : 'Export failed.');
    }
  };

  const handleSaveDraft = async () => {
    try {
      setPlannerError(null);
      const saved = await savePlan();
      replacePlan(saved);
      upsertProject(saved);
      setPlannerMessage('Draft saved.');
    } catch (taskError) {
      setPlannerError(taskError instanceof Error ? taskError.message : 'Unable to save draft.');
    }
  };

  const saveAndReviewStory = async () => {
    try {
      setPlannerError(null);
      const saved = await savePlan();
      replacePlan(saved);
      upsertProject(saved);
      setPlannerMessage('Story board saved. Review the full summary below.');
      setActiveView('summary');
    } catch (taskError) {
      setPlannerError(taskError instanceof Error ? taskError.message : 'Unable to save this story.');
    }
  };

  const saveEditedPlan = async (nextPlan: Plan) => {
    const saved = await persistPlan(nextPlan);
    replacePlan(saved);
  };

  const saveEditedCharacter = async (field: 'lead_one' | 'lead_two', character: NonNullable<Plan['lead_one']>) => {
    await saveEditedPlan({ ...currentPlan, [field]: character });
  };

  const saveEditedPairing = async (pairing: NonNullable<Plan['pairing']>) => {
    await saveEditedPlan({ ...currentPlan, pairing });
  };

  const saveEditedPremise = async (premise: NonNullable<Plan['premise']>) => {
    await saveEditedPlan({ ...currentPlan, premise });
  };

  const saveChapterDetails = async (chapterDetails: Plan['chapter_details']) => {
    await saveEditedPlan({ ...currentPlan, chapter_details: chapterDetails });
  };

  const saveEditedCast = async (cast: CastMember[]) => {
    await saveEditedPlan({ ...currentPlan, cast });
  };

  const createLibraryEntry = async (member: CastMember) => {
    try {
      setCastError(null);
      const saved = await characterLibraryApi.create(member);
      setLibraryEntries((current) => [...current, saved].sort((a, b) => a.name.localeCompare(b.name)));
      setCastMessage(`Saved ${saved.name} to the character library.`);
    } catch (taskError) {
      setCastError(taskError instanceof Error ? taskError.message : 'Unable to save library character.');
    }
  };

  const updateLibraryEntry = async (entry: CharacterLibraryEntry) => {
    if (!entry.id) {
      await createLibraryEntry(entry);
      return;
    }

    try {
      setCastError(null);
      const saved = await characterLibraryApi.update(entry);
      setLibraryEntries((current) => current.map((item) => (item.id === saved.id ? saved : item)).sort((a, b) => a.name.localeCompare(b.name)));
      setCastMessage(`Updated ${saved.name} in the character library.`);
    } catch (taskError) {
      setCastError(taskError instanceof Error ? taskError.message : 'Unable to update library character.');
    }
  };

  const deleteLibraryEntry = async (entryId: number) => {
    try {
      setCastError(null);
      await characterLibraryApi.remove(entryId);
      setLibraryEntries((current) => current.filter((entry) => entry.id !== entryId));
      setCastMessage('Removed character from the library.');
    } catch (taskError) {
      setCastError(taskError instanceof Error ? taskError.message : 'Unable to delete library character.');
    }
  };

  const injectLibraryEntry = async (entry: CharacterLibraryEntry) => {
    const nextCast = [
      ...currentPlan.cast,
      {
        name: entry.name,
        role: entry.role,
        summary: entry.summary,
        connection_to_leads: entry.connection_to_leads,
        story_function: entry.story_function,
        core_desire: entry.core_desire,
        core_fear: entry.core_fear,
        secret_pressure: entry.secret_pressure,
        comedic_angle: entry.comedic_angle,
        include_in_story: true,
        is_main: false,
      },
    ];
    await saveEditedCast(nextCast);
    setCastMessage(`${entry.name} added to this story cast.`);
  };

  const saveWriterProfile = async (profileMarkdown: string) => {
    try {
      setWriterProfileError(null);
      const saved = await writerProfileApi.update(profileMarkdown);
      setWriterProfile(saved);
      setWriterProfileMessage(saved.is_default ? 'Writer profile reset to the default voice.' : 'Writer profile saved.');
    } catch (taskError) {
      setWriterProfileError(taskError instanceof Error ? taskError.message : 'Unable to save writer profile.');
    }
  };

  const generateCharacters = async () => {
    await runTask(async () => {
      const savedPlan = await generatorApi.characterPack({
        plan_id: currentPlan.id,
        title: currentPlan.title,
        brief: currentPlan.concept_brief,
        setting: currentPlan.setting,
        romance_configuration: currentPlan.romance_configuration,
        main_character_focus: currentPlan.main_character_focus,
        romance_structure_notes: currentPlan.romance_structure_notes,
        pov_mode: currentPlan.pov_mode,
        pov_notes: currentPlan.pov_notes,
        dominant_romance_arc: currentPlan.dominant_romance_arc,
        central_external_pressure: currentPlan.central_external_pressure,
        emotional_question: currentPlan.emotional_question,
        heat_level: currentPlan.heat_level,
        target_words: currentPlan.target_words,
        trope_notes: currentPlan.trope_notes,
        notes: currentPlan.notes,
        flavor_seeds: currentPlan.flavor_seeds,
      });
      upsertProject(savedPlan);
      replacePlan(savedPlan);
      await reloadLibraryEntries();
    });
  };

  const generatePairing = async () => {
    const leadOne = currentPlan.lead_one;
    const leadTwo = currentPlan.lead_two;

    if (!leadOne || !leadTwo) {
      setPlannerError('Generate the two lead packs first.');
      return;
    }

    await runTask(async () => {
      const savedPlan = await generatorApi.pairing({
        plan_id: currentPlan.id,
        title: currentPlan.title,
        concept_brief: currentPlan.concept_brief,
        setting: currentPlan.setting,
        romance_configuration: currentPlan.romance_configuration,
        main_character_focus: currentPlan.main_character_focus,
        romance_structure_notes: currentPlan.romance_structure_notes,
        pov_mode: currentPlan.pov_mode,
        pov_notes: currentPlan.pov_notes,
        dominant_romance_arc: currentPlan.dominant_romance_arc,
        central_external_pressure: currentPlan.central_external_pressure,
        emotional_question: currentPlan.emotional_question,
        heat_level: currentPlan.heat_level,
        target_words: currentPlan.target_words,
        trope_notes: currentPlan.trope_notes,
        notes: currentPlan.notes,
        lead_one: leadOne,
        lead_two: leadTwo,
        preferred_trope: currentPlan.trope_notes[0] || '',
        flavor_seeds: currentPlan.flavor_seeds,
      });
      upsertProject(savedPlan);
      replacePlan(savedPlan);
    });
  };

  const generatePremise = async () => {
    const leadOne = currentPlan.lead_one;
    const leadTwo = currentPlan.lead_two;

    if (!leadOne || !leadTwo) {
      setPlannerError('Generate the two lead packs first.');
      return;
    }

    await runTask(async () => {
      const savedPlan = await generatorApi.premise({
        plan_id: currentPlan.id,
        title: currentPlan.title,
        concept_brief: currentPlan.concept_brief,
        setting: currentPlan.setting,
        romance_configuration: currentPlan.romance_configuration,
        main_character_focus: currentPlan.main_character_focus,
        romance_structure_notes: currentPlan.romance_structure_notes,
        pov_mode: currentPlan.pov_mode,
        pov_notes: currentPlan.pov_notes,
        dominant_romance_arc: currentPlan.dominant_romance_arc,
        central_external_pressure: currentPlan.central_external_pressure,
        emotional_question: currentPlan.emotional_question,
        heat_level: currentPlan.heat_level,
        lead_one: leadOne,
        lead_two: leadTwo,
        pairing: currentPlan.pairing,
        target_words: currentPlan.target_words,
        trope_notes: currentPlan.trope_notes,
        notes: currentPlan.notes,
        flavor_seeds: currentPlan.flavor_seeds,
      });
      upsertProject(savedPlan);
      replacePlan(savedPlan);
    });
  };

  const generateCast = async () => {
    const leadOne = currentPlan.lead_one;
    const leadTwo = currentPlan.lead_two;

    if (!leadOne || !leadTwo) {
      setCastError('Generate the two lead packs first.');
      return;
    }

    await runTask(
      async () => {
        const savedPlan = await generatorApi.cast({
          plan_id: currentPlan.id,
          title: currentPlan.title,
          concept_brief: currentPlan.concept_brief,
          setting: currentPlan.setting,
          romance_configuration: currentPlan.romance_configuration,
          main_character_focus: currentPlan.main_character_focus,
          romance_structure_notes: currentPlan.romance_structure_notes,
          pov_mode: currentPlan.pov_mode,
          pov_notes: currentPlan.pov_notes,
          dominant_romance_arc: currentPlan.dominant_romance_arc,
          central_external_pressure: currentPlan.central_external_pressure,
          emotional_question: currentPlan.emotional_question,
          heat_level: currentPlan.heat_level,
          target_words: currentPlan.target_words,
          trope_notes: currentPlan.trope_notes,
          notes: currentPlan.notes,
          flavor_seeds: currentPlan.flavor_seeds,
          lead_one: leadOne,
          lead_two: leadTwo,
          pairing: currentPlan.pairing,
          premise: currentPlan.premise,
          cast: currentPlan.cast,
        });
        upsertProject(savedPlan);
        replacePlan(savedPlan);
        await reloadLibraryEntries();
        setCastMessage('Story cast generated and library refreshed.');
      },
      setCastError
    );
  };

  const generateChapterDetails = async () => {
    const leadOne = currentPlan.lead_one;
    const leadTwo = currentPlan.lead_two;
    const premise = currentPlan.premise;

    if (!leadOne || !leadTwo || !premise) {
      setPlannerError('Generate the premise first.');
      return;
    }

    await runTask(async () => {
      const savedPlan = await generatorApi.chapterDetails({
        plan_id: currentPlan.id,
        title: currentPlan.title,
        concept_brief: currentPlan.concept_brief,
        setting: currentPlan.setting,
        romance_configuration: currentPlan.romance_configuration,
        main_character_focus: currentPlan.main_character_focus,
        romance_structure_notes: currentPlan.romance_structure_notes,
        pov_mode: currentPlan.pov_mode,
        pov_notes: currentPlan.pov_notes,
        dominant_romance_arc: currentPlan.dominant_romance_arc,
        central_external_pressure: currentPlan.central_external_pressure,
        emotional_question: currentPlan.emotional_question,
        heat_level: currentPlan.heat_level,
        target_words: currentPlan.target_words,
        trope_notes: currentPlan.trope_notes,
        notes: currentPlan.notes,
        flavor_seeds: currentPlan.flavor_seeds,
        lead_one: leadOne,
        lead_two: leadTwo,
        pairing: currentPlan.pairing,
        premise,
        cast: currentPlan.cast,
      });
      upsertProject(savedPlan);
      replacePlan(savedPlan);
      setPlannerMessage('Chapter details generated.');
    });
  };

  const generateCastMemberFromPrompt = async (prompt: string): Promise<CastMember> => {
    return generatorApi.castMember({
      prompt,
      setting: currentPlan.setting,
      romance_configuration: currentPlan.romance_configuration,
      main_character_focus: currentPlan.main_character_focus,
      romance_structure_notes: currentPlan.romance_structure_notes,
      pov_mode: currentPlan.pov_mode,
      pov_notes: currentPlan.pov_notes,
      dominant_romance_arc: currentPlan.dominant_romance_arc,
      central_external_pressure: currentPlan.central_external_pressure,
      emotional_question: currentPlan.emotional_question,
      flavor_seeds: currentPlan.flavor_seeds,
      lead_one: currentPlan.lead_one,
      lead_two: currentPlan.lead_two,
      pairing: currentPlan.pairing,
      premise: currentPlan.premise,
    });
  };

  const createFlavorSeed = async (label: string) => {
    try {
      setPlannerError(null);
      const seed = await flavorSeedApi.create(label);
      setFlavorSeeds((current) => (current.some((entry) => entry.id === seed.id) ? current : [...current, seed].sort((a, b) => a.label.localeCompare(b.label))));
      if (!currentPlan.flavor_seeds.includes(seed.label)) {
        updatePlanField('flavor_seeds', [...currentPlan.flavor_seeds, seed.label]);
      }
      setPlannerMessage(`Added flavor source: ${seed.label}.`);
    } catch (taskError) {
      setPlannerError(taskError instanceof Error ? taskError.message : 'Unable to create flavor source.');
    }
  };

  const deleteFlavorSeed = async (seedId: number, label: string) => {
    try {
      setPlannerError(null);
      await flavorSeedApi.remove(seedId);
      setFlavorSeeds((current) => current.filter((seed) => seed.id !== seedId));
      if (currentPlan.flavor_seeds.includes(label)) {
        updatePlanField('flavor_seeds', currentPlan.flavor_seeds.filter((seed) => seed !== label));
      }
      setPlannerMessage(`Removed flavor source: ${label}.`);
    } catch (taskError) {
      setPlannerError(taskError instanceof Error ? taskError.message : 'Unable to delete flavor source.');
    }
  };

  const createTrope = async (payload: { name: string; clash_engine: string; best_for: string; is_global: boolean }) => {
    try {
      setTropeError(null);
      const trope = await catalogApi.createTrope(payload);
      setTropes((current) => [...current, trope].sort((a, b) => a.name.localeCompare(b.name)));
      setTropeMessage(`${trope.name} saved as a ${trope.is_global ? 'global' : 'local'} trope.`);
    } catch (taskError) {
      setTropeError(taskError instanceof Error ? taskError.message : 'Unable to create trope.');
    }
  };

  const deleteTrope = async (tropeId: number) => {
    try {
      setTropeError(null);
      const tropeToDelete = tropes.find((trope) => trope.id === tropeId);
      await catalogApi.deleteTrope(tropeId);
      setTropes((current) => current.filter((trope) => trope.id !== tropeId));
      if (tropeToDelete && currentPlan.trope_notes[0] === tropeToDelete.name) {
        updatePlanField('trope_notes', []);
      }
      setTropeMessage(tropeToDelete ? `${tropeToDelete.name} deleted.` : 'Trope deleted.');
    } catch (taskError) {
      setTropeError(taskError instanceof Error ? taskError.message : 'Unable to delete trope.');
    }
  };

  const requestGeneration = (kind: Exclude<PendingRegeneration, null>) => {
    const needsConfirmation =
      (kind === 'characters' && hasLeads) ||
      (kind === 'pairing' && hasPairing) ||
      (kind === 'premise' && hasPremise) ||
      (kind === 'chapters' && hasChapterDetails) ||
      (kind === 'cast' && hasStoryCast);

    if (!needsConfirmation) {
      if (kind === 'characters') {
        void generateCharacters();
      } else if (kind === 'pairing') {
        void generatePairing();
      } else if (kind === 'premise') {
        void generatePremise();
      } else if (kind === 'chapters') {
        void generateChapterDetails();
      } else {
        void generateCast();
      }
      return;
    }

    setPendingRegeneration(kind);
  };

  const confirmRegeneration = () => {
    const pending = pendingRegeneration;
    setPendingRegeneration(null);

    if (pending === 'characters') {
      void generateCharacters();
    } else if (pending === 'pairing') {
      void generatePairing();
    } else if (pending === 'premise') {
      void generatePremise();
    } else if (pending === 'chapters') {
      void generateChapterDetails();
    } else if (pending === 'cast') {
      void generateCast();
    }
  };

  const cancelRegeneration = () => {
    setPendingRegeneration(null);
  };

  const workspaceDescription =
    activeView === 'planner'
      ? 'Plan the current novella here: concept, leads, pairing, premise, and protected notes.'
      : activeView === 'cast'
        ? 'Manage story-specific cast on the left side of the workspace and reusable cross-story characters on the right.'
        : activeView === 'summary'
          ? 'Review the full saved story board here before exporting it into a drafting package.'
          : 'Adjust the writer voice used during generation and included in export packages.';

  return {
    user,
    logout,
    getLinkAccountUrl,
    currentPlan,
    projects,
    isSaving,
    tropes,
    flavorSeeds,
    libraryEntries,
    writerProfile,
    activeView,
    setActiveView,
    isGenerating,
    plannerMessage,
    plannerError,
    tropeMessage,
    tropeError,
    castMessage,
    castError,
    writerProfileMessage,
    writerProfileError,
    pendingRegeneration,
    hasLeads,
    hasPairing,
    hasPremise,
    hasStoryCast,
    hasChapterDetails,
    hasSavedPlan,
    workspaceDescription,
    updatePlanField,
    handleExport,
    handleSaveDraft,
    saveAndReviewStory,
    saveEditedCharacter,
    saveEditedPairing,
    saveEditedPremise,
    saveChapterDetails,
    saveEditedCast,
    createLibraryEntry,
    updateLibraryEntry,
    deleteLibraryEntry,
    injectLibraryEntry,
    saveWriterProfile,
    createFlavorSeed,
    deleteFlavorSeed,
    createTrope,
    deleteTrope,
    requestGeneration,
    confirmRegeneration,
    cancelRegeneration,
    generateCastMemberFromPrompt,
    deletePlan,
    replacePlan,
    resetPlan,
    regenerationModalCopy,
  };
}
