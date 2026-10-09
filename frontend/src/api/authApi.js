import client from './client';

export const authApi = {
  register: (payload) => client.post('/auth/register', payload),
  login: (payload) => client.post('/auth/login', payload),
  getMe: () => client.get('/auth/me'),
  updateProfile: (payload) => client.put('/auth/profile', payload),
};

