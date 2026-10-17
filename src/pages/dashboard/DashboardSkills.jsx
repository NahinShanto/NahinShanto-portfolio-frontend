import { skillsApi } from '../../api/skills'
import ResourceManager from '../../components/dashboard/ResourceManager'
import Badge from '../../components/ui/Badge'
import usePageTitle from '../../hooks/usePageTitle'
import { SKILL_CATEGORIES } from '../../utils/constants'
import { skillDefaults, skillFields } from '../../utils/formConfigs'

export default function DashboardSkills() {
  usePageTitle('Skills | Dashboard')
  return (
    <div>
      <h1 className="mb-8 text-xl md:text-2xl">Skills</h1>
      <ResourceManager
        title="Skills" noun="Skill" api={skillsApi} queryKey="skills-admin"
        fields={skillFields} defaults={skillDefaults}
        columns={[
          { header: 'Name', render: (s) => <span className="font-medium">{s.name}</span> },
          { header: 'Category', render: (s) => SKILL_CATEGORIES[s.category] },
          { header: 'Proficiency', render: (s) => `${s.proficiency}%` },
          { header: 'Featured', render: (s) => (s.is_featured ? <Badge variant="accent">Featured</Badge> : '—') },
          { header: 'Order', render: (s) => s.display_order },
        ]}
      />
    </div>
  )
}