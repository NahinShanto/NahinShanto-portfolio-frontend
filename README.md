# DevFolio Frontend: Portfolio + Blog (React + Vite)

The public website and owner dashboard for my portfolio and blog. All content (profile, skills, experience, projects, posts) comes from the Django REST API. Nothing is hard-coded in the React source.

- **Backend repo:** https://github.com/NahinShanto/NahinShanto-portfolio-backend
- **Live site:** _add the link here if deployed_

## Screenshots

| Home (light) | Home (dark) |
|---|---|
| ![Home light](docs/screenshots/home-light.png) | ![Home dark](docs/screenshots/home-dark.png) |

| Blog list | Blog detail |
|---|---|
| ![Blog list](docs/screenshots/blog-list.png) | ![Blog detail](docs/screenshots/blog-detail.png) |

| Owner dashboard |
|---|
| ![Dashboard](docs/screenshots/dashboard.png) |

## Tech stack

- React 18+ with Vite
- `react-router-dom` v6 for routing
- `axios` (one configured instance in `src/api/axios.js`)
- TanStack React Query for all server data (queries and mutations)
- Context API for auth state and theme
- Tailwind CSS driven by CSS-variable design tokens
- `lucide-react` and `react-icons` for icons
- `react-hook-form` for forms, `react-hot-toast` for toasts, `react-markdown` for Markdown (HTML is never executed)

## Features

- Public pages: home, about, projects, blog, contact, styled 404
- Blog list with debounced search, category chips, tag filter, sorting and pagination. Every filter lives in the URL (`/blog?search=react&category=web&page=2`), so pages are shareable and survive a refresh
- Blog detail with Markdown content, optimistic like button, share bar, validated comment form ("awaiting approval" feedback), one level of replies and related posts
- Loading skeletons, empty states and error states with a Retry button on every list
- Owner dashboard (hidden from visitors): stats, posts, projects, skills, experience and education, categories and tags, comment moderation, contact inbox, profile and password change
- Server validation errors are shown under the matching field
- Light and dark theme (persisted, follows the system preference on first visit)
- Responsive at 1280, 1024, 768 and 480 widths with a working hamburger menu

## Setup

```bash
git clone https://github.com/NahinShanto/NahinShanto-portfolio-frontend.git
cd NahinShanto-portfolio-frontend
npm install
copy .env.example .env      # macOS/Linux: cp .env.example .env
npm run dev
```

The backend must be running (see the backend README). Open `http://localhost:5173`.

| Variable | Example | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://127.0.0.1:8000/api` | Base URL of the Django API |

## Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/about` | About | Public |
| `/projects` | Projects list | Public |
| `/projects/:slug` | Project detail | Public |
| `/blog` | Blog list | Public |
| `/blog/:slug` | Blog detail | Public |
| `/contact` | Contact form | Public |
| `/login` | Owner login (not linked anywhere) | Public URL |
| `*` | 404 | Public |
| `/dashboard` | Stats overview | Owner |
| `/dashboard/posts`, `/new`, `/:slug/edit` | Posts table and editor | Owner |
| `/dashboard/projects`, `/new`, `/:slug/edit` | Projects table and editor | Owner |
| `/dashboard/skills` | Skills CRUD | Owner |
| `/dashboard/experience` | Experience and education CRUD | Owner |
| `/dashboard/taxonomy` | Categories and tags CRUD | Owner |
| `/dashboard/comments` | Moderation queue | Owner |
| `/dashboard/messages` | Contact inbox | Owner |
| `/dashboard/profile` | Profile and change password | Owner |

Owner routes sit behind `ProtectedRoute`. A visitor is redirected to `/login` and sent back after signing in. Hiding UI is only a convenience: the real authorization is enforced by the API.

## Design direction

**A: Minimal Editorial.** Calm, magazine-like, lots of white space, serif headings, thin 1px borders instead of heavy shadows and a single muted accent. Dark mode uses its own surface colors, it is not an inverted copy of light mode.

All tokens live in `src/styles/tokens.css` and are mapped to Tailwind in `src/styles/index.css`. No raw hex colors are used in components.

### Colors

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#fafaf7` | `#121211` |
| `--surface` | `#ffffff` | `#1a1a18` |
| `--surface-2` | `#f2f2ec` | `#232321` |
| `--border` | `#e2e2da` | `#33332f` |
| `--text` | `#1c1c1a` | `#ecece6` |
| `--text-muted` | `#5c5c57` | `#a8a8a0` |
| `--accent` | `#0f6e66` | `#5ec4b9` |
| `--accent-hover` | `#0b5750` | `#7dd3c9` |
| `--success` | `#17703f` | `#5bc98a` |
| `--warning` | `#8a5a00` | `#e3b341` |
| `--danger` | `#b42318` | `#f97066` |

The accent is used for links, primary buttons and active states.

### Typography

| Use | Font |
|---|---|
| Headings | Fraunces (serif) |
| Body and UI | Inter |

One type scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 px. Body text is 16px with a 1.7 line height.

### Spacing, radius and shadow

| Token | Values |
|---|---|
| Spacing | 8px scale: 8, 16, 24, 32, 48, 64, 96 |
| Container | max 1200px, centered, 16px side padding on mobile |
| Section rhythm | 96px vertical on desktop, 48px on mobile |
| Radius | 4px, 8px, 16px (`--r-sm`, `--r-md`, `--r-lg`) |
| Shadow | `--sh-sm`, `--sh-md` |
| Motion | 200ms transitions, no autoplay |

## Folder structure

```
src/
  api/          axios.js and one module per resource (posts.js, projects.js, ...)
  components/
    layout/     Navbar, Footer, PublicLayout, PageContainer, MobileMenu
    ui/         Button, Card, Badge, Input, Modal, Skeleton, EmptyState, ErrorState, Pagination, ...
    home/       Hero, AboutPreview, SkillGrid, ExperienceTimeline, FeaturedProjects, LatestPosts, ...
    blog/       PostCard, PostFilters, LikeButton, CommentForm, CommentList, ShareBar
    dashboard/  Sidebar, DashboardLayout, StatCard, DataTable, ConfirmModal, ImageUploader, ResourceForm, ...
  context/      AuthContext.jsx, ThemeContext.jsx
  hooks/        useDebounce, useVisitorId, usePosts, useProjects, ...
  pages/        public pages and pages/dashboard/
  routes/       AppRoutes.jsx, ProtectedRoute.jsx
  utils/        formatDate, errors, constants, formConfigs, payload, ...
  styles/       tokens.css, index.css
```

## Notes on API usage

- The axios instance reads `VITE_API_URL`, attaches the `Authorization` header and a persistent `X-Visitor-Id` (a UUID kept in `localStorage`), and on a 401 tries the refresh token once before sending the owner to `/login`.
- The backend rotates refresh tokens, so both tokens are stored after every refresh.
- The API throttles anonymous requests (20 per minute), so React Query keeps data fresh for 5 minutes and does not refetch on window focus.

## What I would improve with more time

- Automated tests (Vitest and React Testing Library for forms, Playwright for the main flows)
- A rich-text or live Markdown preview editor for posts
- Code splitting for the dashboard routes to shrink the public bundle
- Drag-and-drop ordering for skills and projects
- Open Graph meta tags and a sitemap for better sharing and SEO
- Deployment with a CI pipeline
