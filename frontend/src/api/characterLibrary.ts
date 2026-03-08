import api from './client';
import type { CastMember, CharacterLibraryEntry } from '../types';

export const characterLibraryApi = {
  async list(): Promise<CharacterLibraryEntry[]> {
    const response = await api.get('/character-library');
    return response.data.data as CharacterLibraryEntry[];
  },

  async create(member: CastMember): Promise<CharacterLibraryEntry> {
    const response = await api.post('/character-library', member);
    return response.data.data as CharacterLibraryEntry;
  },

  async update(entry: CharacterLibraryEntry): Promise<CharacterLibraryEntry> {
    const response = await api.put(`/character-library/${entry.id}`, entry);
    return response.data.data as CharacterLibraryEntry;
  },

  async remove(entryId: number): Promise<void> {
    await api.delete(`/character-library/${entryId}`);
  },
};
