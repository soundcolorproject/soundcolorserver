
import { ApiGroupInfo, ApiSelectGroup, ApiSetGroupColor } from '../../shared/apiTypes/hue'

import { apiGet, apiPost } from './fetcher'

export async function getGroups (): Promise<ApiGroupInfo[]> {
  return apiGet<ApiGroupInfo[]>('/hue/groups')
}

export async function selectGroup (body: ApiSelectGroup) {
  await apiPost('/hue/groups/select', { body })
}

export async function setColor (body: ApiSetGroupColor) {
  await apiPost('/hue/groups/setColor', { body })
}
