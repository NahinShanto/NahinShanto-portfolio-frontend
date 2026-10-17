import { categoriesApi, tagsApi } from '../../api/taxonomy'
import ResourceManager from '../../components/dashboard/ResourceManager'
import usePageTitle from '../../hooks/usePageTitle'
import { categoryDefaults, categoryFields, tagDefaults, tagFields } from '../../utils/formConfigs'

const cols = [
  { header: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
  { header: 'Slug', render: (r) => r.slug },
  { header: 'Published posts', render: (r) => r.posts_count },
]

export default function DashboardTaxonomy() {
  usePageTitle('Categories and tags | Dashboard')
  return (
    <div className="space-y-12">
      <h1 className="text-xl md:text-2xl">Categories and tags</h1>
      <ResourceManager title="Categories" noun="Category" api={categoriesApi} queryKey="categories-admin" fields={categoryFields} defaults={categoryDefaults} columns={cols} />
      <ResourceManager title="Tags" noun="Tag" api={tagsApi} queryKey="tags-admin" fields={tagFields} defaults={tagDefaults} columns={cols} />
    </div>
  )
}