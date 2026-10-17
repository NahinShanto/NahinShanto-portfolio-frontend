import axios from 'axios'
import { getVisitorId } from '../hooks/useVisitorId'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../utils/tokenStorage'

const baseURL = import.meta.env.VITE_API_URL

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.headers['X-Visitor-Id'] = getVisitorId()
  return config
})

// একসাথে কয়েকটা request 401 পেলে refresh একবারই হবে
let refreshPromise = null

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh/`, { refresh: getRefreshToken() })
      .then(({ data }) => {
        // backend প্রতিবার নতুন refresh token দেয় (rotation), তাই দুটোই সেভ করতে হয়
        setTokens({ access: data.access, refresh: data.refresh ?? getRefreshToken() })
        return data.access
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const isAuthCall =
      original?.url?.includes('/auth/login/') || original?.url?.includes('/auth/refresh/')

    // শুধু লগইন করা owner-এর (refresh token আছে) জন্য, visitor-কে কখনো redirect করা হবে না
    if (status === 401 && !original._retry && !isAuthCall && getRefreshToken()) {
      original._retry = true
      try {
        const access = await refreshAccessToken()
        original.headers.Authorization = `Bearer ${access}`
        return api(original)
      } catch {
        clearTokens()
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api