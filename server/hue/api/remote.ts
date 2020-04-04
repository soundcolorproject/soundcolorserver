
export interface OAuthTokens {
  accessToken: string
  access_expires_at: number
  refreshToken: string
  refresh_expires_at: number
}

export interface RemoteCredentials {
  clientId: string
  clientSecret: string
  username: string
  tokens: {
    access: {
      value: string
      expiresAt: number
    }
    refresh: {
      value: string
      expiresAt: number
    }
  }
}

export interface UnauthenticatedRemoteApi {
  getToken (code: string): Promise<OAuthTokens>
}

export interface RemoteApi extends UnauthenticatedRemoteApi {
  refreshTokens (): Promise<OAuthTokens>
  createRemoteUser (bridgeId?: number, deviceType?: string): Promise<string>
  getRemoteAccessCredentials (): RemoteCredentials
}
