import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../utils/tokenStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // token থাকলেই শুধু loading শুরু হয়, তাই visitor কোনো ঝলক দেখে না
  const [loading, setLoading] = useState(Boolean(getAccessToken() || getRefreshToken()))

  // অ্যাপ চালুর সময় session ফিরিয়ে আনা (/auth/me/)
  useEffect(() => {
    if (!getAccessToken() && !getRefreshToken()) return
    authApi
      .me()
      .then(setUser)
      .catch(() => clearTokens())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await authApi.login(username, password)
    setTokens({ access: data.access, refresh: data.refresh })
    try {
      // /me/ শুধু superuser-কে দেয়, তাই সাধারণ user এখানে আটকে যাবে
      const me = await authApi.me()
      setUser(me)
      return me
    } catch (err) {
      clearTokens()
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout(getRefreshToken())
    } catch {
      // token আগেই অচল হলেও logout চলবে
    }
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isOwner: Boolean(user), login, logout, loading }),
    [user, login, logout, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}