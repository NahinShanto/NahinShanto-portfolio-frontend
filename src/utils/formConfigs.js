import { EMPLOYMENT_TYPES, PROJECT_CATEGORIES, SKILL_CATEGORIES } from './constants'

const opts = (obj) => Object.entries(obj).map(([value, label]) => ({ value, label }))

// API-র item থেকে form-এর শুরুর মান
export function toFormValues(item, fields, defaults) {
  return Object.fromEntries(
    fields.map((f) => {
      if (f.type === 'image' || f.type === 'file') return [f.name, null]
      if (f.fromItem) return [f.name, f.fromItem(item)]
      return [f.name, item[f.name] ?? defaults[f.name] ?? '']
    }),
  )
}

/* Skills */
export const skillFields = [
  { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 60 },
  { name: 'category', label: 'Category', type: 'select', required: true, options: opts(SKILL_CATEGORIES) },
  { name: 'proficiency', label: 'Proficiency (1-100)', type: 'number', required: true, min: 1, max: 100 },
  { name: 'display_order', label: 'Display order', type: 'number', required: true },
  { name: 'is_featured', label: 'Featured skill', type: 'checkbox' },
]
export const skillDefaults = { name: '', category: '', proficiency: 50, display_order: 0, is_featured: false }

/* Experience */
export const experienceFields = [
  { name: 'company', label: 'Company', type: 'text', required: true, maxLength: 120 },
  { name: 'role', label: 'Role', type: 'text', required: true, maxLength: 120 },
  { name: 'employment_type', label: 'Type', type: 'select', required: true, options: opts(EMPLOYMENT_TYPES) },
  { name: 'location', label: 'Location', type: 'text', maxLength: 100 },
  { name: 'start_date', label: 'Start date', type: 'date', required: true },
  { name: 'is_current', label: 'I currently work here', type: 'checkbox' },
  { name: 'end_date', label: 'End date', type: 'date', showIf: (v) => !v.is_current },
  { name: 'company_url', label: 'Company website', type: 'url' },
  { name: 'description', label: 'Highlights (one bullet per line)', type: 'textarea', rows: 4, full: true },
  { name: 'display_order', label: 'Display order', type: 'number', required: true },
]
export const experienceDefaults = {
  company: '', role: '', employment_type: '', location: '', start_date: '', end_date: '',
  is_current: false, company_url: '', description: '', display_order: 0,
}

/* Education */
export const educationFields = [
  { name: 'institution', label: 'Institution', type: 'text', required: true, maxLength: 150 },
  { name: 'degree', label: 'Degree', type: 'text', required: true, maxLength: 120 },
  { name: 'field_of_study', label: 'Field of study', type: 'text', required: true, maxLength: 120 },
  { name: 'grade', label: 'Grade', type: 'text', maxLength: 50 },
  { name: 'start_year', label: 'Start year', type: 'number', required: true, min: 1950, max: 2100 },
  { name: 'end_year', label: 'End year (empty if ongoing)', type: 'number', min: 1950, max: 2100 },
  { name: 'description', label: 'Notes', type: 'textarea', rows: 3, full: true },
]
export const educationDefaults = {
  institution: '', degree: '', field_of_study: '', grade: '', start_year: '', end_year: '', description: '',
}

/* Category / Tag */
export const categoryFields = [
  { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 80 },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
]
export const categoryDefaults = { name: '', description: '' }
export const tagFields = [{ name: 'name', label: 'Name', type: 'text', required: true, maxLength: 50, full: true }]
export const tagDefaults = { name: '' }

/* Post */
export const postFields = [
  { name: 'title', label: 'Title', type: 'text', required: true, minLength: 5, maxLength: 200, full: true },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 3, required: true, maxLength: 300, hint: 'Max 300 characters.', full: true },
  { name: 'category_id', label: 'Category', type: 'select', optionsFrom: 'categories', nullable: true, hint: 'Required to publish.', fromItem: (p) => p.category?.id ?? '' },
  { name: 'status', label: 'Status', type: 'select', required: true, noBlank: true, options: [{ value: 'DRAFT', label: 'Draft' }, { value: 'PUBLISHED', label: 'Published' }] },
  { name: 'tag_ids', label: 'Tags', type: 'multi', optionsFrom: 'tags', fromItem: (p) => p.tags.map((t) => t.id), full: true },
  { name: 'cover_image', label: 'Cover image (max 2 MB, jpg/png/webp)', type: 'image', full: true },
  { name: 'content', label: 'Content (Markdown, at least 100 characters to publish)', type: 'markdown', rows: 16, required: true, full: true },
  { name: 'is_featured', label: 'Featured post', type: 'checkbox' },
]
export const postDefaults = {
  title: '', excerpt: '', category_id: '', status: 'DRAFT', tag_ids: [], cover_image: null,
  content: '', is_featured: false,
}

/* Project */
export const projectFields = [
  { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 150, full: true },
  { name: 'summary', label: 'Summary', type: 'textarea', rows: 2, required: true, maxLength: 200, hint: 'Max 200 characters.', full: true },
  { name: 'cover_image', label: 'Cover screenshot (max 2 MB)', type: 'image', required: true, full: true },
  { name: 'description', label: 'Description (Markdown)', type: 'markdown', rows: 10, required: true, full: true },
  { name: 'category', label: 'Category', type: 'select', required: true, noBlank: true, options: opts(PROJECT_CATEGORIES) },
  { name: 'completed_date', label: 'Completed on', type: 'date' },
  { name: 'tech_stack_ids', label: 'Tech stack', type: 'multi', optionsFrom: 'skills', fromItem: (p) => p.tech_stack.map((t) => t.id), full: true },
  { name: 'live_url', label: 'Live URL', type: 'url', hint: 'Live URL or GitHub URL is required.' },
  { name: 'github_url', label: 'GitHub URL', type: 'url' },
  { name: 'display_order', label: 'Display order', type: 'number', required: true },
  { name: 'is_featured', label: 'Featured project', type: 'checkbox' },
]
export const projectDefaults = {
  title: '', summary: '', cover_image: null, description: '', category: 'WEB', completed_date: '',
  tech_stack_ids: [], live_url: '', github_url: '', display_order: 0, is_featured: false,
}

/* Profile */
export const profileFields = [
  { name: 'full_name', label: 'Full name', type: 'text', required: true, maxLength: 100 },
  { name: 'headline', label: 'Headline', type: 'text', required: true, maxLength: 150 },
  { name: 'bio', label: 'Bio', type: 'textarea', rows: 6, required: true, full: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'text', maxLength: 30 },
  { name: 'location', label: 'Location', type: 'text', maxLength: 100 },
  { name: 'years_of_experience', label: 'Years of experience', type: 'number', required: true, min: 0 },
  { name: 'github_url', label: 'GitHub URL', type: 'url' },
  { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
  { name: 'x_url', label: 'X URL', type: 'url' },
  { name: 'website_url', label: 'Website URL', type: 'url' },
  { name: 'avatar', label: 'Photo (max 2 MB)', type: 'image', full: true },
  { name: 'resume', label: 'Resume (PDF, max 5 MB)', type: 'file', accept: '.pdf', full: true },
  { name: 'is_available_for_hire', label: 'Available for hire', type: 'checkbox' },
]
export const profileDefaults = {
  full_name: '', headline: '', bio: '', email: '', phone: '', location: '', years_of_experience: 0,
  github_url: '', linkedin_url: '', x_url: '', website_url: '', avatar: null, resume: null,
  is_available_for_hire: true,
}

/* Change password */
export const passwordFields = [
  { name: 'old_password', label: 'Current password', type: 'password', required: true, full: true },
  { name: 'new_password', label: 'New password', type: 'password', required: true, minLength: 8, hint: 'At least 8 characters. Avoid common passwords.', full: true },
]
export const passwordDefaults = { old_password: '', new_password: '' }