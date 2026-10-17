import { Link } from 'react-router-dom'
import { useProfile } from '../../hooks/useProfile'
import { NAV_LINKS } from '../../utils/constants'
import SocialLinks from '../ui/SocialLinks'

export default function Footer() {
  const { data: profile } = useProfile()
  const name = profile?.full_name ?? ''

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-bold">{name}</p>
          {profile?.headline && <p className="mt-2 text-sm text-muted">{profile.headline}</p>}
        </div>
        <nav aria-label="Footer">
          <h2 className="font-body text-sm font-medium uppercase tracking-widest text-muted">Quick links</h2>
          <ul className="mt-4 flex flex-col">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="inline-flex min-h-12 items-center text-text no-underline hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-body text-sm font-medium uppercase tracking-widest text-muted">Connect</h2>
          <SocialLinks profile={profile} className="mt-4" />
        </div>
      </div>
      <div className="border-t border-border">
        <p className="container-page py-6 text-sm text-muted">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}