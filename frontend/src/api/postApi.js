import client from './client';

export const postApi = {
  getPosts: (params = {}) => client.get('/posts', { params }),
  getPostById: (id) => client.get(`/posts/${id}`),
  createPost: (payload) => client.post('/posts', payload),
  updatePost: (id, payload) => client.put(`/posts/${id}`, payload),
  deletePost: (id) => client.delete(`/posts/${id}`),
};

