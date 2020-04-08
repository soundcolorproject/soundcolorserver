
export interface OAuthTokens {
  accessToken: string
  access_expires_at: number
  refreshToken: string
  refresh_expires_at: number
}

export interface Token {
  value: string
  expiresAt: number
}

export interface Tokens {
  access: Token
  refresh: Token
}

export interface RemoteCredentials {
  clientId: string
  clientSecret: string
  username: string
  tokens: Tokens
}

export interface UnauthenticatedRemoteApi {
  getToken (code: string): Promise<OAuthTokens>
}

export interface RemoteApi extends UnauthenticatedRemoteApi {
  refreshTokens (): Promise<OAuthTokens>
  createRemoteUser (bridgeId?: number, deviceType?: string): Promise<string>
  getRemoteAccessCredentials (): RemoteCredentials
}
