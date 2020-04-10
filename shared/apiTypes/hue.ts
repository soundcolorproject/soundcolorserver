
export type ApiGroupType = 'Room' | 'Zone'

export interface ApiGroupInfo {
  id: number
  name: string
  type: ApiGroupType
  lightCount: number
}

export interface ApiSelectGroup {
  groupId: number
}

export interface LightColor {
  h: number
  s: number
  v: number
}

export type GroupColorMode = 'group' | 'round-robin'

export interface ApiSetGroupColor {
  groupId: number
  color: LightColor
  mode?: GroupColorMode
}
