import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../../api/auth'
import { profileApi } from '../../api/profile'
import ResourceForm from '../../components/dashboard/ResourceForm'
import Card from '../../components/ui/Card'
import ErrorState from '../../components/ui/ErrorState'
import Skeleton from '../../components/ui/Skeleton'
import usePageTitle from '../../hooks/usePageTitle'
import { useProfile } from '../../hooks/useProfile'
import { getErrorMessage } from '../../utils/errors'
import { passwordDefaults, passwordFields, profileDefaults, profileFields, toFormValues } from '../../utils/formConfigs'
import { buildPayload } from '../../utils/payload'

export default function DashboardProfile() {
  usePageTitle('Profile | Dashboard')
  const qc = useQueryClient()
  const query = useProfile()
  const [pwKey, setPwKey] = useState(0)

  const notFound = query.error?.response?.status === 404 // Profile এখনো বানানো হয়নি, তখন form দিয়ে তৈরি হবে

  const saveProfile = async (values) => {
    await profileApi.update(buildPayload(values, profileFields))
    toast.success('Profile saved')
    await qc.invalidateQueries()
  }

  const changePassword = async (values) => {
    await authApi.changePassword(values)
    toast.success('Password changed')
    setPwKey((k) => k + 1) // form খালি করে
  }

  return (
    <div className="max-w-3xl space-y-12">
      <section>
        <h1 className="text-xl md:text-2xl">Profile</h1>
        <div className="mt-8">
          {query.isLoading && <Skeleton className="h-96" />}
          {query.isError && !notFound && <ErrorState message={getErrorMessage(query.error)} onRetry={query.refetch} />}
          {(query.isSuccess || notFound) && (
            <ResourceForm
              key={query.data?.updated_at ?? 'new'}
              fields={profileFields}
              defaultValues={query.data ? toFormValues(query.data, profileFields, profileDefaults) : profileDefaults}
              existing={query.data ?? null}
              onSubmit={saveProfile}
              submitLabel="Save profile"
            />
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl">Change password</h2>
        <Card className="mt-6 p-6">
          <ResourceForm
            key={pwKey}
            fields={passwordFields}
            defaultValues={passwordDefaults}
            onSubmit={changePassword}
            submitLabel="Change password"
          />
        </Card>
      </section>
    </div>
  )
}