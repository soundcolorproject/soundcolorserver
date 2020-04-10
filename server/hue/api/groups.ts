
import { GroupLightState } from '../LightState'

type GroupAction = any
type GroupState = any

export interface Group {
  readonly id: number
  name: string
  readonly lights: string[]
  readonly action: GroupAction
  readonly recycle: boolean
  readonly sensors: number[]
  readonly state: GroupState
}

export interface LightGroup extends Group {
  readonly type: 'LightGroup'
}

export interface Room extends Group {
  readonly type: 'Room'
  class: GroupClass
}

export interface Zone extends Group {
  readonly type: 'Zone'
  class: GroupClass
}

export interface EntertainmentStream {
  readonly proxymode: string
  readonly proxynode: string
  readonly active: boolean
  readonly owner: string
}

export interface Entertainment extends Group {
  readonly type: 'Entertainment'
  class: 'TV' | 'Other'
  readonly locations: string[]
  readonly stream: EntertainmentStream
}

export type AnyGroup = LightGroup | Room | Zone | Entertainment
export type GroupType = AnyGroup['type']

export interface GroupsApi {
  // GET
  getAll (): Promise<AnyGroup[]>
  getGroup (id: number): Promise<AnyGroup>
  getGroupByName (name: string): Promise<AnyGroup[]>
  getLightGroups (): Promise<LightGroup[]>
  getRooms (): Promise<Room[]>
  getZones (): Promise<Zone[]>
  getEntertainment (): Promise<Entertainment[]>

  // CREATE
  createGroup (group: LightGroup): Promise<LightGroup>
  createGroup (group: Room): Promise<Room>
  createGroup (group: Zone): Promise<Zone>
  createGroup (group: Entertainment): Promise<Entertainment>

  // UPDATE
  updateGroupAttributes (group: LightGroup): Promise<LightGroup>
  updateGroupAttributes (group: Room): Promise<Room>
  updateGroupAttributes (group: Zone): Promise<Zone>
  updateGroupAttributes (group: Entertainment): Promise<Entertainment>

  // DELETE
  deleteGroup (id: number): Promise<boolean>

  // OPTIONS
  getGroupState (id: number): Promise<GroupLightState>
  setGroupState (id: number, state: GroupLightState): Promise<GroupLightState>
}

export type GroupClass =
  | 'Living room'
  | 'Kitchen'
  | 'Dining'
  | 'Bedroom'
  | 'Kids bedroom'
  | 'Bathroom Nursery'
  | 'Recreation'
  | 'Office'
  | 'Gym'
  | 'Hallway'
  | 'Toilet'
  | 'Front door'
  | 'Garage'
  | 'Terrace'
  | 'Garden'
  | 'Driveway'
  | 'Carport'
  | 'Home'
  | 'Downstairs'
  | 'Upstairs'
  | 'Top floor'
  | 'Attic'
  | 'Guest room'
  | 'Staircase'
  | 'Lounge'
  | 'Man cave'
  | 'Computer'
  | 'Studio'
  | 'Music'
  | 'TV'
  | 'Reading'
  | 'Closet'
  | 'Storage'
  | 'Laundry room'
  | 'Balcony'
  | 'Porch'
  | 'Barbecue'
  | 'Pool'
  | 'Other'
