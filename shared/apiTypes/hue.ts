
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

export interface ApiSetGroupColor {
  groupId: number
  color: {
    h: number
    s: number
    v: number
  }
}
