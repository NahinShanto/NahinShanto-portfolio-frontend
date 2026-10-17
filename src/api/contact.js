import api from './axios'

export const contactApi = {
  send: (data) => api.post('/contact/', data).then((r) => r.data),
  list: (params) => api.get('/contact/', { params }).then((r) => r.data),
  update: (id, data) => api.patch(`/contact/${id}/`, data).then((r) => r.data),
  remove: (id) => api.delete(`/contact/${id}/`),
}