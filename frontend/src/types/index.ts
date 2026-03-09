export class ApiResponse<T = unknown> {
  success = false;
  message?: string;
  data?: T;
}

export class User {
  id = '';
  email = '';
  username = '';
  display_name = '';
  role = 'guest';
  is_verified = false;
  is_guest = true;
  auth_type = 'guest';
}

export class CharacterPack {
  name = '';
  age = '';
  occupation = '';
  personality_summary = '';
  core_desire = '';
  core_fear = '';
  public_competence = '';
  private_mess = '';
  everyday_strength = '';
  comedic_weakness = '';
  romantic_blind_spot = '';
  secret_pressure = '';
  social_circle_role = '';
  dialogue_rhythm = '';
  sample_dialogue: string[] = [];
  thinks_they_want = '';
  actually_needs = '';
}

export class PairingResult {
  pairing_hook = '';
  why_they_clash: string[] = [];
  why_they_fit: string[] = [];
  scene_engines: string[] = [];
  best_trope = '';
  trope_table: Array<{ trope: string; score: number; reason: string }> = [];
  emotional_lessons = { lead_one: '', lead_two: '' };
  dominant_story_lane = { main_romance_arc: '', central_external_pressure: '', emotional_question: '' };
  pov_rule = '';
  relationship_escalation_path: string[] = [];
  risk_notes: string[] = [];
}

export class PremiseResult {
  logline = '';
  premise = '';
  dominant_story_lane = { main_romance_arc: '', central_external_pressure: '', emotional_question: '' };
  pov_rule = '';
  forced_proximity_device = '';
  primary_obstacle = '';
  midpoint_shift = '';
  finale_payoff = '';
  chapter_beats: string[] = [];
  relationship_escalation_path: string[] = [];
  scene_contract = { required_elements: [] as string[], chapter_change_rule: '' };
  supporting_cast_roles: string[] = [];
  recurring_comedic_motif = '';
}

export class ChapterDetail {
  chapter_number = 1;
  chapter_title = '';
  pov_owner = '';
  beat_anchor = '';
  chapter_goal = '';
  scene_goal = '';
  conflict = '';
  reveal = '';
  secret_revealed = '';
  who_has_power = '';
  what_changes_by_the_end = '';
  emotional_turn = '';
  emotional_note_closes_chapter = '';
  cliffhanger_or_hook = '';
  carry_forward_thread = '';
  approximate_word_target = 3000;
}

export class CastMember {
  name = '';
  role = '';
  summary = '';
  connection_to_leads = '';
  story_function = '';
  core_desire = '';
  core_fear = '';
  secret_pressure = '';
  comedic_angle = '';
  include_in_story = true;
  is_main = false;
}

export class CharacterLibraryEntry extends CastMember {
  id?: number;
  created_by = '';
  created_at = '';
  updated_at = '';
}

export class Plan {
  id?: number;
  title = 'Untitled RomCom';
  concept_brief = '';
  setting = '';
  romance_configuration = 'm/f';
  main_character_focus = '';
  romance_structure_notes = '';
  pov_mode = 'single_close_third';
  pov_notes = '';
  dominant_romance_arc = '';
  central_external_pressure = '';
  emotional_question = '';
  flavor_seeds: string[] = [];
  cast: CastMember[] = [];
  chapter_details: ChapterDetail[] = [];
  heat_level = 'sweet';
  target_words = 45000;
  summary = '';
  lead_one: CharacterPack | null = null;
  lead_two: CharacterPack | null = null;
  pairing: PairingResult | null = null;
  premise: PremiseResult | null = null;
  trope_notes: string[] = [];
  notes = '';
}

export type Trope = {
  id: number;
  name: string;
  clash_engine: string;
  best_for: string;
  is_global: boolean;
  created_by: string;
  can_manage: boolean;
  created_at: string;
  updated_at: string;
};

export type FlavorSeed = {
  id: number;
  created_by: string;
  label: string;
  created_at: string;
  updated_at: string;
};

export type AuthPayload = {
  token: string;
  user: User;
  expires_in?: number;
};
