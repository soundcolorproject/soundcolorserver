
import { apiGet } from './fetcher'

export async function isLoggedIn () {
  try {
    const loggedIn = await apiGet<boolean>('/auth/loggedIn')
    return loggedIn
  } catch (e) {
    return false
  }
}
