import api from './axios'
import { makeCrud } from './crud'

export const postsApi = {
  ...makeCrud('posts'),
  like: (slug) => api.post(`/posts/${slug}/like/`).then((r) => r.data),
  comments: (slug, params) => api.get(`/posts/${slug}/comments/`, { params }).then((r) => r.data),
  addComment: (slug, data) => api.post(`/posts/${slug}/comments/`, data).then((r) => r.data),
}

export const commentsApi = {
  list: (params) => api.get('/comments/', { params }).then((r) => r.data),
  update: (id, data) => api.patch(`/comments/${id}/`, data).then((r) => r.data),
  remove: (id) => api.delete(`/comments/${id}/`),
}