import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { projectsApi } from '../api/projects'

export const useProjects = (params) =>
  useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.list(params),
    placeholderData: keepPreviousData,
  })

export const useProject = (slug) =>
  useQuery({ queryKey: ['project', slug], queryFn: () => projectsApi.get(slug) })

// Home-এ ঠিক ৩টা: featured আগে, কম পড়লে সাম্প্রতিক project দিয়ে পূরণ
export function useFeaturedProjects(count = 3) {
  const featured = useQuery({
    queryKey: ['projects', { is_featured: true }],
    queryFn: () => projectsApi.list({ is_featured: true }),
  })
  const needMore = featured.isSuccess && featured.data.results.length < count
  const fallback = useQuery({
    queryKey: ['projects', { ordering: '-completed_date' }],
    queryFn: () => projectsApi.list({ ordering: '-completed_date' }),
    enabled: needMore,
  })

  const isLoading = featured.isLoading || (needMore && fallback.isLoading)
  const isError = featured.isError || fallback.isError
  let data
  if (featured.isSuccess && (!needMore || fallback.isSuccess)) {
    const picked = [...featured.data.results]
    for (const p of fallback.data?.results ?? []) {
      if (picked.length >= count) break
      if (!picked.some((x) => x.id === p.id)) picked.push(p)
    }
    data = picked.slice(0, count)
  }
  return {
    data,
    isLoading,
    isError,
    error: featured.error || fallback.error,
    refetch: () => {
      featured.refetch()
      if (needMore) fallback.refetch()
    },
  }
}