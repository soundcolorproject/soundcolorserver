
import { config } from '../config'
import { GenerateOauthStateFn, VerifyOauthStateFn } from './types/OAuthState'

export * from './types/OAuthState'

export const generateOauthState: GenerateOauthStateFn = config.remoteApi
  ? require('./mongo/oauthState').generateOauthState
  : require('./memory/oauthState').generateOauthState

export const verifyOauthState: VerifyOauthStateFn = config.remoteApi
  ? require('./mongo/oauthState').generateOauthState
  : require('./memory/oauthState').generateOauthState
