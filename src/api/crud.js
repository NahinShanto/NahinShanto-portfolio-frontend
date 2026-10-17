import api from './axios'

// একই ধরনের CRUD endpoint-গুলোর জন্য একটা helper
export const makeCrud = (base) => ({
  list: (params) => api.get(`/${base}/`, { params }).then((r) => r.data),
  get: (idOrSlug) => api.get(`/${base}/${idOrSlug}/`).then((r) => r.data),
  create: (data) => api.post(`/${base}/`, data).then((r) => r.data),
  update: (idOrSlug, data) => api.patch(`/${base}/${idOrSlug}/`, data).then((r) => r.data),
  remove: (idOrSlug) => api.delete(`/${base}/${idOrSlug}/`),
})