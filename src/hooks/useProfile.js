import { useQuery } from '@tanstack/react-query'
import { profileApi } from '../api/profile'

export const useProfile = () => useQuery({ queryKey: ['profile'], queryFn: profileApi.get })