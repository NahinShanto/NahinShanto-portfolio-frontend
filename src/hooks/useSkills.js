import { useQuery } from '@tanstack/react-query'
import { skillsApi } from '../api/skills'

export const useSkills = (params) =>
  useQuery({ queryKey: ['skills', params], queryFn: () => skillsApi.list(params) })