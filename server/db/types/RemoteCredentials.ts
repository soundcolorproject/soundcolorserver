
import { RemoteCredentials, Tokens } from '../../hue/api/remote'

export interface CredentialData {
  _id: string
  username: string
  tokens: Tokens
  expirationDate: Date
}

export interface SaveRemoteCredentialsFn {
  (session: string, { username, tokens }: RemoteCredentials): Promise<void>
}

export interface GetRemoteCredentialsFn {
  (session: string): Promise<CredentialData | null>
}

export interface DeleteRemoteCredentialsFn {
  (session: string): Promise<boolean>
}
