import { projectsApi } from '../../api/projects'
import ResourceEditor from '../../components/dashboard/ResourceEditor'
import { projectDefaults, projectFields } from '../../utils/formConfigs'

export default function ProjectEditor() {
  return <ResourceEditor noun="Project" api={projectsApi} listPath="/dashboard/projects" fields={projectFields} defaults={projectDefaults} />
}