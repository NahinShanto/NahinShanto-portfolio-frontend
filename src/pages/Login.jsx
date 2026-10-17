import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'
import { getErrorMessage } from '../utils/errors'

export default function Login() {
  usePageTitle('Login')
  const { login, isOwner, loading } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { username: '', password: '' },
  })

  // session যাচাই চলার সময় কিছু ঝলক দেখানো হয় না
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    )
  }
  if (isOwner) return <Navigate to={from} replace />

  const onSubmit = async ({ username, password }) => {
    setError('')
    try {
      await login(username.trim(), password) // সফল হলে isOwner true হয়ে ওপরের Navigate চলে
    } catch (err) {
      const status = err.response?.status
      if (status === 429) setError('Too many attempts, please try later.')
      else if (status === 401) setError('Invalid username or password.') // কোনটা ভুল তা বলা হয় না
      else if (status === 403) setError('This account is not allowed to sign in here.')
      else setError(getErrorMessage(err))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-md">
        <h1 className="text-xl">Owner login</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <Input
            label="Username"
            autoComplete="username"
            error={errors.username?.message}
            {...register('username', { required: 'Username is required.' })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required.' })}
          />
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full">Sign in</Button>
        </form>
      </div>
    </div>
  )
}