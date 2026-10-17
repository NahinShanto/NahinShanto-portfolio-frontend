import { getErrorMessage } from '../../utils/errors'
import ErrorState from './ErrorState'

export default function QueryState({ query, skeleton, empty, isEmpty, children }) {
  if (query.isLoading) return skeleton
  if (query.isError) return <ErrorState message={getErrorMessage(query.error)} onRetry={query.refetch} />
  if (isEmpty?.(query.data)) return empty
  return children(query.data)
}