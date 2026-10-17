import { educationApi, experiencesApi } from '../../api/experiences'
import ResourceManager from '../../components/dashboard/ResourceManager'
import Badge from '../../components/ui/Badge'
import usePageTitle from '../../hooks/usePageTitle'
import { EMPLOYMENT_TYPES } from '../../utils/constants'
import { formatMonthYear } from '../../utils/formatDate'
import { educationDefaults, educationFields, experienceDefaults, experienceFields } from '../../utils/formConfigs'

export default function DashboardExperience() {
  usePageTitle('Experience | Dashboard')
  return (
    <div className="space-y-12">
      <h1 className="text-xl md:text-2xl">Experience and education</h1>
      <ResourceManager
        title="Experience" noun="Experience" api={experiencesApi} queryKey="experiences-admin"
        fields={experienceFields} defaults={experienceDefaults}
        columns={[
          { header: 'Role', render: (e) => <span className="font-medium">{e.role}</span> },
          { header: 'Company', render: (e) => e.company },
          { header: 'Type', render: (e) => EMPLOYMENT_TYPES[e.employment_type] },
          { header: 'Period', render: (e) => `${formatMonthYear(e.start_date)} – ${e.is_current ? 'Present' : formatMonthYear(e.end_date)}` },
          { header: 'Current', render: (e) => (e.is_current ? <Badge variant="success">Current</Badge> : '—') },
        ]}
      />
      <ResourceManager
        title="Education" noun="Education" api={educationApi} queryKey="education-admin"
        fields={educationFields} defaults={educationDefaults}
        columns={[
          { header: 'Degree', render: (e) => <span className="font-medium">{e.degree}</span> },
          { header: 'Institution', render: (e) => e.institution },
          { header: 'Years', render: (e) => `${e.start_year} – ${e.end_year ?? 'Present'}` },
        ]}
      />
    </div>
  )
}