import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { postsApi } from '../api/posts'
import { categoriesApi, tagsApi } from '../api/taxonomy'

export const usePosts = (params) =>
  useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.list(params),
    placeholderData: keepPreviousData,
  })

export const usePost = (slug) =>
  useQuery({ queryKey: ['post', slug], queryFn: () => postsApi.get(slug) })

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: () => categoriesApi.list() })

export const useTags = () => useQuery({ queryKey: ['tags'], queryFn: () => tagsApi.list() })