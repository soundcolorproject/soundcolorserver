
export type OAuthProvider = 'hue'
export interface OAuthState {
  session: string
  provider: OAuthProvider
  state: string
  createdDate: Date
}

export interface GenerateOauthStateFn {
  (session: string, provider: OAuthProvider): Promise<string>
}

export interface VerifyOauthStateFn {
  (session: string, state: string, provider: OAuthProvider): Promise<boolean>
}
