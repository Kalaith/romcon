import api from './client';
import type { CastMember, CharacterPack, PairingResult, Plan, PremiseResult } from '../types';

export const generatorApi = {
  async concept(payload: {
    plan_id?: number;
    title: string;
    concept_brief: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    heat_level: string;
    target_words: number;
    trope_notes: string[];
    notes: string;
    flavor_seeds: string[];
  }): Promise<Plan> {
    const response = await api.post('/generate/concept', payload);
    return response.data.data as Plan;
  },

  async conceptPolish(payload: {
    plan_id?: number;
    title: string;
    concept_brief: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    heat_level: string;
    target_words: number;
    trope_notes: string[];
    notes: string;
    flavor_seeds: string[];
  }): Promise<Plan> {
    const response = await api.post('/generate/concept-polish', payload);
    return response.data.data as Plan;
  },

  async conceptExpand(payload: {
    plan_id?: number;
    title: string;
    concept_brief: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    heat_level: string;
    target_words: number;
    trope_notes: string[];
    notes: string;
    flavor_seeds: string[];
  }): Promise<Plan> {
    const response = await api.post('/generate/concept-expand', payload);
    return response.data.data as Plan;
  },

  async characterPack(payload: {
    plan_id?: number;
    title: string;
    brief: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    heat_level: string;
    target_words: number;
    trope_notes: string[];
    notes: string;
    flavor_seeds: string[];
  }): Promise<Plan> {
    const response = await api.post('/generate/character-pack', payload);
    return response.data.data as Plan;
  },

  async pairing(payload: {
    plan_id?: number;
    title: string;
    concept_brief: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    heat_level: string;
    target_words: number;
    trope_notes: string[];
    notes: string;
    lead_one: CharacterPack;
    lead_two: CharacterPack;
    preferred_trope: string;
    flavor_seeds: string[];
  }): Promise<Plan> {
    const response = await api.post('/generate/pairing', payload);
    return response.data.data as Plan;
  },

  async cast(payload: {
    plan_id?: number;
    title: string;
    concept_brief: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    heat_level: string;
    target_words: number;
    trope_notes: string[];
    notes: string;
    flavor_seeds: string[];
    lead_one: CharacterPack;
    lead_two: CharacterPack;
    pairing: PairingResult | null;
    premise: PremiseResult | null;
    cast: CastMember[];
  }): Promise<Plan> {
    const response = await api.post('/generate/cast', payload);
    return response.data.data as Plan;
  },

  async chapterDetails(payload: {
    plan_id?: number;
    title: string;
    concept_brief: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    heat_level: string;
    target_words: number;
    trope_notes: string[];
    notes: string;
    flavor_seeds: string[];
    lead_one: CharacterPack;
    lead_two: CharacterPack;
    pairing: PairingResult | null;
    premise: PremiseResult;
    cast: CastMember[];
  }): Promise<Plan> {
    const response = await api.post('/generate/chapter-details', payload);
    return response.data.data as Plan;
  },

  async castMember(payload: {
    prompt: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    flavor_seeds: string[];
    lead_one: CharacterPack | null;
    lead_two: CharacterPack | null;
    pairing: PairingResult | null;
    premise: PremiseResult | null;
  }): Promise<CastMember> {
    const response = await api.post('/generate/cast-member', payload);
    return response.data.data as CastMember;
  },

  async premise(payload: {
    plan_id?: number;
    title: string;
    concept_brief: string;
    setting: string;
    romance_configuration: string;
    main_character_focus: string;
    romance_structure_notes: string;
    pov_mode: string;
    pov_notes: string;
    dominant_romance_arc: string;
    central_external_pressure: string;
    emotional_question: string;
    heat_level: string;
    target_words: number;
    trope_notes: string[];
    notes: string;
    lead_one: CharacterPack;
    lead_two: CharacterPack;
    pairing: PairingResult | null;
    flavor_seeds: string[];
  }): Promise<Plan> {
    const response = await api.post('/generate/premise', payload);
    return response.data.data as Plan;
  },
};
