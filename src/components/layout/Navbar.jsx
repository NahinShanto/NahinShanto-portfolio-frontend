import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useProfile } from '../../hooks/useProfile'
import { NAV_LINKS } from '../../utils/constants'
import Skeleton from '../ui/Skeleton'
import MobileMenu from './MobileMenu'

const linkClass = ({ isActive }) =>
  `inline-flex h-12 items-center rounded-md px-4 text-sm font-medium no-underline transition-colors duration-200 hover:bg-surface-2 ${
    isActive ? 'text-accent' : 'text-text'
  }`

const iconBtn =
  'inline-flex size-12 items-center justify-center rounded-md text-text transition-colors duration-200 hover:bg-surface-2'

export default function Navbar() {
  const { data: profile, isLoading } = useProfile()
  const { isOwner } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const links = isOwner ? [...NAV_LINKS, { to: '/dashboard', label: 'Dashboard' }] : NAV_LINKS

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-heading text-lg font-bold text-text no-underline">
          {isLoading ? <Skeleton className="h-6 w-32" /> : (profile?.full_name ?? 'Portfolio')}
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={iconBtn}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`${iconBtn} lg:hidden`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && <MobileMenu links={links} onNavigate={() => setOpen(false)} />}
    </header>
  )
}