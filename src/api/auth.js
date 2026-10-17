import api from './axios'

export const authApi = {
  login: (username, password) =>
    api.post('/auth/login/', { username, password }).then((r) => r.data),
  me: () => api.get('/auth/me/').then((r) => r.data),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  changePassword: (data) => api.post('/auth/change-password/', data).then((r) => r.data),
}