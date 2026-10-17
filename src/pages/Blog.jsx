import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/blog/PostCard'
import PostFilters from '../components/blog/PostFilters'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import QueryState from '../components/ui/QueryState'
import { CardSkeleton } from '../components/ui/Skeleton'
import useDebounce from '../hooks/useDebounce'
import usePageTitle from '../hooks/usePageTitle'
import { useCategories, usePosts, useTags } from '../hooks/usePosts'

const PAGE_SIZE = 6
const DEFAULT_ORDERING = '-published_at'

export default function Blog() {
  usePageTitle('Blog')
  const [params, setParams] = useSearchParams()

  // সব filter URL থেকে পড়া হয়, তাই লিংক শেয়ার করা যায় আর refresh-এ হারায় না
  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''
  const tag = params.get('tag') ?? ''
  const ordering = params.get('ordering') ?? DEFAULT_ORDERING
  const page = Number(params.get('page')) || 1

  const [input, setInput] = useState(search)
  const debounced = useDebounce(input, 400)

  const update = (changes, replace = false) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
    if (!('page' in changes)) next.delete('page') // filter বদলালে প্রথম পেজে ফেরা
    setParams(next, { replace })
  }

  // ৪০০ms থেমে টাইপ করলে তবেই URL (আর তাই API call) বদলায়
  useEffect(() => {
    if (debounced.trim() !== search) update({ search: debounced.trim() }, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const queryParams = {
    page,
    ordering,
    ...(search && { search }),
    ...(category && { category }),
    ...(tag && { tag }),
  }
  const query = usePosts(queryParams)
  const categories = useCategories()
  const tags = useTags()

  const hasFilters = Boolean(search || category || tag)
  const clearFilters = () => {
    setInput('')
    setParams({})
  }

  return (
    <PageContainer>
      <header className="max-w-2xl">
        <h1 className="text-2xl md:text-3xl">Blog</h1>
        <p className="mt-4 text-lg text-muted">Notes on what I am learning and building.</p>
      </header>

      <div className="mt-8 md:mt-12">
        <PostFilters
          input={input}
          onInput={setInput}
          categories={categories.data ?? []}
          category={category}
          onCategory={(v) => update({ category: v })}
          tags={tags.data ?? []}
          tag={tag}
          onTag={(v) => update({ tag: v })}
          ordering={ordering}
          onOrdering={(v) => update({ ordering: v === DEFAULT_ORDERING ? '' : v })}
        />
      </div>

      <div className="mt-8 md:mt-12">
        <QueryState
          query={query}
          skeleton={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
          isEmpty={(d) => d.results.length === 0}
          empty={
            <EmptyState
              title={search ? `No posts found for '${search}'` : 'No posts found'}
              description={hasFilters ? 'Try a different search or clear the filters.' : 'Check back soon.'}
              action={hasFilters && <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
            />
          }
        >
          {(data) => (
            <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : ''}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.results.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              <Pagination
                page={page}
                count={data.count}
                pageSize={PAGE_SIZE}
                onChange={(p) => {
                  update({ page: p > 1 ? String(p) : '' })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          )}
        </QueryState>
      </div>
    </PageContainer>
  )
}