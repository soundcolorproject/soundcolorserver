
export interface GroupRoundRobinState {
  session: string
  groupId: number
  lightIds: number[]
  currentIndex: number
  lastModified: Date
}

export interface SetupRoundRobinFn {
  (session: string, groupId: number, lightIds: number[]): Promise<void>
}

export interface GetNextLightIdFn {
  (session: string, groupId: number): Promise<number>
}
