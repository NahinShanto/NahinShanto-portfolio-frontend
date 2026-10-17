import { Link2 } from 'lucide-react'
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import toast from 'react-hot-toast'

const btn =
  'inline-flex size-12 items-center justify-center rounded-md border border-border text-text transition-colors duration-200 hover:bg-surface-2 hover:text-accent'

export default function ShareBar({ title }) {
  const url = window.location.href
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy the link')
    }
  }

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Share this post">
      <button type="button" onClick={copy} className={btn} aria-label="Copy link">
        <Link2 className="size-5" aria-hidden="true" />
      </button>
      <a className={btn} aria-label="Share on X" target="_blank" rel="noreferrer"
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}>
        <FaXTwitter className="size-5" aria-hidden="true" />
      </a>
      <a className={btn} aria-label="Share on LinkedIn" target="_blank" rel="noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}>
        <FaLinkedinIn className="size-5" aria-hidden="true" />
      </a>
      <a className={btn} aria-label="Share on Facebook" target="_blank" rel="noreferrer"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}>
        <FaFacebookF className="size-5" aria-hidden="true" />
      </a>
    </div>
  )
}