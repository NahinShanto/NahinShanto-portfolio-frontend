export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const res = error?.response
  if (!res) {
    return error?.code === 'ERR_NETWORK' ? 'Cannot reach the server. Please check your connection.' : fallback
  }
  if (res.status === 429) return 'Too many attempts, please try later.'
  if (typeof res.data?.detail === 'string') return res.data.detail
  return fallback
}

// {"end_date": ["End date must be after start date."]} থেকে { end_date: "End date must..." }
export function getFieldErrors(error) {
  const data = error?.response?.data
  if (!data || typeof data !== 'object') return {}
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, v]) => Array.isArray(v) || typeof v === 'string')
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(' ') : v]),
  )
}

// toast-এর জন্য এক লাইনের সারাংশ: প্রথম field error, না থাকলে সাধারণ বার্তা
export function getErrorSummary(error) {
  const first = Object.values(getFieldErrors(error))[0]
  return first || getErrorMessage(error)
}