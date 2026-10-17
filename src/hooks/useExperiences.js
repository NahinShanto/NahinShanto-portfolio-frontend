import { useQuery } from '@tanstack/react-query'
import { educationApi, experiencesApi } from '../api/experiences'

export const useExperiences = () =>
  useQuery({ queryKey: ['experiences'], queryFn: () => experiencesApi.list() })

export const useEducation = () =>
  useQuery({ queryKey: ['education'], queryFn: () => educationApi.list() })