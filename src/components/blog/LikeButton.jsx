import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { postsApi } from '../../api/posts'
import { getErrorMessage } from '../../utils/errors'

export default function LikeButton({ slug, liked, count }) {
  const qc = useQueryClient()
  const key = ['post', slug]

  const mutation = useMutation({
    mutationFn: () => postsApi.like(slug),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: key })
      const previous = qc.getQueryData(key)
      // সার্ভারের উত্তরের আগেই সংখ্যা আর হার্ট বদলে দেওয়া হয়
      qc.setQueryData(key, (old) =>
        old && { ...old, is_liked: !old.is_liked, likes_count: old.likes_count + (old.is_liked ? -1 : 1) },
      )
      return { previous }
    },
    onError: (error, _vars, ctx) => {
      qc.setQueryData(key, ctx.previous) // rollback
      toast.error(getErrorMessage(error))
    },
    onSuccess: (data) => {
      qc.setQueryData(key, (old) => old && { ...old, is_liked: data.liked, likes_count: data.likes_count })
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike this post' : 'Like this post'}
      className={`inline-flex h-12 items-center gap-2 rounded-md border px-4 font-medium transition-colors duration-200 hover:bg-surface-2 disabled:opacity-80 ${
        liked ? 'border-accent text-accent' : 'border-border text-text'
      }`}
    >
      <Heart className="size-5" fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
      <span>{count}</span>
    </button>
  )
}