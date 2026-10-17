import { postsApi } from '../../api/posts'
import ResourceEditor from '../../components/dashboard/ResourceEditor'
import { postDefaults, postFields } from '../../utils/formConfigs'

export default function PostEditor() {
  return <ResourceEditor noun="Post" api={postsApi} listPath="/dashboard/posts" fields={postFields} defaults={postDefaults} />
}