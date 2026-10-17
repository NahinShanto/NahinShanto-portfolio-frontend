import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { Globe } from 'lucide-react'

const ITEMS = [
  { key: 'github_url', label: 'GitHub', Icon: FaGithub },
  { key: 'linkedin_url', label: 'LinkedIn', Icon: FaLinkedinIn },
  { key: 'x_url', label: 'X', Icon: FaXTwitter },
  { key: 'website_url', label: 'Website', Icon: Globe },
]

export default function SocialLinks({ profile, className = '' }) {
  const items = ITEMS.filter((i) => profile?.[i.key])
  if (!items.length) return null
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={profile[key]}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="inline-flex size-12 items-center justify-center rounded-md border border-border text-text transition-colors duration-200 hover:bg-surface-2 hover:text-accent"
          >
            <Icon className="size-5" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  )
}