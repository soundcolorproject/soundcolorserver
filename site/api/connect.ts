
import { ConnectResponse } from '../../shared/apiTypes/hue'
import { apiGet } from './fetcher'

export async function connectToLocalApi (): Promise<ConnectResponse> {
  return apiGet<ConnectResponse>('/auth/connect')
}
