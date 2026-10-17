const ACCESS = 'access_token'
const REFRESH = 'refresh_token'

export const getAccessToken = () => localStorage.getItem(ACCESS)
export const getRefreshToken = () => localStorage.getItem(REFRESH)

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS, access)
  if (refresh) localStorage.setItem(REFRESH, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
}