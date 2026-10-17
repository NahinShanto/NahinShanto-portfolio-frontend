import {
  FileText, FolderKanban, GraduationCap, LayoutDashboard, LogOut,
  Mail, MessageSquare, Sparkles, Tags, User, ExternalLink,
} from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import IconButton from '../ui/IconButton'

const ITEMS = [
  { to: '/dashboard', label: 'Overview', Icon: LayoutDashboard, end: true },
  { to: '/dashboard/posts', label: 'Posts', Icon: FileText },
  { to: '/dashboard/projects', label: 'Projects', Icon: FolderKanban },
  { to: '/dashboard/skills', label: 'Skills', Icon: Sparkles },
  { to: '/dashboard/experience', label: 'Experience', Icon: GraduationCap },
  { to: '/dashboard/taxonomy', label: 'Categories & tags', Icon: Tags },
  { to: '/dashboard/comments', label: 'Comments', Icon: MessageSquare },
  { to: '/dashboard/messages', label: 'Messages', Icon: Mail },
  { to: '/dashboard/profile', label: 'Profile', Icon: User },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const stats = useDashboardStats()
  const badges = {
    '/dashboard/comments': stats.data?.pending_comments,
    '/dashboard/messages': stats.data?.unread_messages,
  }

  const onLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <aside className="border-b border-border bg-surface lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="min-w-0">
          <p className="font-heading text-lg font-bold">Dashboard</p>
          <p className="truncate text-xs text-muted">{user?.username}</p>
        </div>
        <div className="flex">
          <Link
            to="/"
            aria-label="View site"
            title="View site"
            className="inline-flex size-12 items-center justify-center rounded-md text-text hover:bg-surface-2"
          >
            <ExternalLink className="size-5" aria-hidden="true" />
          </Link>
          <IconButton label="Log out" onClick={onLogout}>
            <LogOut className="size-5" aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      <nav aria-label="Dashboard" className="flex gap-2 overflow-x-auto p-2 lg:flex-col lg:p-4">
        {ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-h-12 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-medium no-underline transition-colors duration-200 hover:bg-surface-2 ${
                isActive ? 'bg-surface-2 text-accent' : 'text-text'
              }`
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            <span>{label}</span>
            {badges[to] > 0 && (
              <span className="ml-auto rounded-sm bg-accent px-2 text-xs text-on-accent">{badges[to]}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}