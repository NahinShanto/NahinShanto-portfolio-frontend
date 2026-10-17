import api from './axios'

export const profileApi = {
  get: () => api.get('/profile/').then((r) => r.data),
  update: (data) => api.patch('/profile/', data).then((r) => r.data), // FormData দিলে ছবি/PDF-ও যাবে
}