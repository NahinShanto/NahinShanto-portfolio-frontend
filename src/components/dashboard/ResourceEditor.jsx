import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import usePageTitle from '../../hooks/usePageTitle'
import { useCategories, useTags } from '../../hooks/usePosts'
import { useSkills } from '../../hooks/useSkills'
import { getErrorMessage } from '../../utils/errors'
import { toFormValues } from '../../utils/formConfigs'
import { buildPayload } from '../../utils/payload'
import Button from '../ui/Button'
import ErrorState from '../ui/ErrorState'
import Skeleton from '../ui/Skeleton'
import ResourceForm from './ResourceForm'

const toOptions = (list = [], label = 'name') => list.map((i) => ({ value: i.id, label: i[label] }))

export default function ResourceEditor({ noun, api, listPath, fields, defaults }) {
  const { slug } = useParams()
  const editing = Boolean(slug)
  const navigate = useNavigate()
  const qc = useQueryClient()
  usePageTitle(`${editing ? 'Edit' : 'New'} ${noun.toLowerCase()} | Dashboard`)

  const item = useQuery({ queryKey: ['editor', noun, slug], queryFn: () => api.get(slug), enabled: editing, gcTime: 0 })
  const categories = useCategories()
  const tags = useTags()
  const skills = useSkills()
  const optionSets = {
    categories: toOptions(categories.data),
    tags: toOptions(tags.data),
    skills: toOptions(skills.data),
  }

  const onSubmit = async (values) => {
    const payload = buildPayload(values, fields)
    if (editing) await api.update(slug, payload)
    else await api.create(payload)
    toast.success(`${noun} saved`)
    await qc.invalidateQueries()
    navigate(listPath)
  }

  return (
    <div className="max-w-3xl">
      <Button to={listPath} variant="ghost" size="sm" className="-ml-4">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back
      </Button>
      <h1 className="mt-2 text-xl md:text-2xl">{editing ? `Edit ${noun.toLowerCase()}` : `New ${noun.toLowerCase()}`}</h1>
      {item.data?.slug && <p className="mt-2 text-sm text-muted">Slug: {item.data.slug} (generated automatically)</p>}

      <div className="mt-8">
        {editing && item.isLoading && <Skeleton className="h-96" />}
        {editing && item.isError && <ErrorState message={getErrorMessage(item.error)} onRetry={item.refetch} />}
        {(!editing || item.isSuccess) && (
          <ResourceForm
            key={item.data?.slug ?? 'new'}
            fields={fields}
            defaultValues={editing ? toFormValues(item.data, fields, defaults) : defaults}
            existing={item.data ?? null}
            optionSets={optionSets}
            onSubmit={onSubmit}
            onCancel={() => navigate(listPath)}
            submitLabel={editing ? 'Save changes' : `Create ${noun.toLowerCase()}`}
          />
        )}
      </div>
    </div>
  )
}