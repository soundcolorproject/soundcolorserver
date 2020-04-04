
export interface User {
  username: string
  name: string
  'create date': string
  'last use date': string
}

export interface NewUser {
  username: string
  clientkey: string
}

export interface UnauthenticatedUsersApi {
  createUser (appName: string, deviceName: string): Promise<NewUser>
}

export interface UsersApi extends UnauthenticatedUsersApi {
  getAll (): Promise<User[]>
}
