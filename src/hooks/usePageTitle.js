import { useEffect } from 'react'

export default function usePageTitle(title, description) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])

  useEffect(() => {
    if (!description) return undefined
    const meta = document.querySelector('meta[name="description"]')
    if (!meta) return undefined
    const previous = meta.getAttribute('content')
    meta.setAttribute('content', description)
    return () => meta.setAttribute('content', previous)
  }, [description])
}