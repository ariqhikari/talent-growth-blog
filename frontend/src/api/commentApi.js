import client from './client';

export const commentApi = {
  getComments: (postId) => client.get(`/posts/${postId}/comments`),
  addComment: (postId, payload) => client.post(`/posts/${postId}/comments`, payload),
  updateComment: (commentId, payload) => client.put(`/comments/${commentId}`, payload),
  deleteComment: (commentId) => client.delete(`/comments/${commentId}`),
};

