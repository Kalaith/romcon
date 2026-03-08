import api from './client';

export type WriterProfilePayload = {
  default_profile: string;
  custom_profile: string;
  effective_profile: string;
  is_default: boolean;
};

export const writerProfileApi = {
  async get(): Promise<WriterProfilePayload> {
    const response = await api.get('/writer-profile');
    return response.data.data as WriterProfilePayload;
  },

  async update(profileMarkdown: string): Promise<WriterProfilePayload> {
    const response = await api.put('/writer-profile', {
      profile_markdown: profileMarkdown,
    });
    return response.data.data as WriterProfilePayload;
  },
};
