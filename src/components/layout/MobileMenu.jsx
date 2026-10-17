import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `flex min-h-12 items-center rounded-md px-4 font-medium no-underline hover:bg-surface-2 ${
    isActive ? 'text-accent' : 'text-text'
  }`

export default function MobileMenu({ links, onNavigate }) {
  return (
    <nav id="mobile-menu" aria-label="Mobile" className="border-t border-border bg-bg lg:hidden">
      <ul className="container-page flex flex-col py-2">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to} end={l.end} onClick={onNavigate} className={linkClass}>
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}