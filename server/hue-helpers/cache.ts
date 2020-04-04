
import * as Cache from 'node-cache'
import { HueApi } from '../hue/api'
import { OAuthTokens } from '../hue/api/remote'

const localCache = new Cache({
  checkperiod: 30,  // check for expired items every 30 seconds
  useClones: false, // don't clone values, just return the exact reference stored
})

function makeAccessors<T> (prefix: string, ttl: number) {
  const prefixer = (key: string) => `${prefix}:${key}`

  const has = (key: string) => {
    return localCache.has(prefixer(key))
  }

  const set = (key: string, value: T) => {
    return localCache.set(prefixer(key), value, ttl)
  }

  const get = (key: string) => {
    const cacheKey = prefixer(key)
    if (!localCache.has(cacheKey)) {
      return undefined
    }

    // Refresh the ttl every time it is accessed
    localCache.ttl(cacheKey, ttl)
    return localCache.get<T>(cacheKey)
  }

  const del = (key: string) => {
    return localCache.del(prefixer(key))
  }

  const take = (key: string) => {
    const cacheKey = prefixer(key)
    if (!localCache.has(cacheKey)) {
      return undefined
    }

    const value = localCache.get<T>(cacheKey)
    localCache.del(cacheKey)
    return value
  }

  function getOrExecute (key: string, cb: () => T): T
  function getOrExecute (key: string, cb: () => Promise<T>): Promise<T>
  function getOrExecute (key: string, cb: () => (T | Promise<T>)): T | Promise<T> {
    let existingValue = get(key)
    if (existingValue !== undefined) return existingValue

    const cbResult = cb()
    if (cbResult instanceof Promise || typeof (cbResult as any).then === 'function') {
      return (cbResult as Promise<T>).then(value => {
        set(key, value)
        return value
      })
    } else {
      set(key, cbResult)
      return cbResult
    }
  }

  return {
    has,
    set,
    get,
    del,
    take,
    getOrExecute,
  }
}

// access tokens expire after 3 days
const CLIENT_TOKEN_TTL = 60 * 60 * 24 * 3
export const oauthTokensCache = makeAccessors<OAuthTokens>('oauthTokens', CLIENT_TOKEN_TTL)

// api objects expire after 15 minutes
const API_TTL = 60 * 15
export const apiCache = makeAccessors<HueApi>('api', API_TTL)

// session state strings expire after 5 minutes
const SESSION_STATE_TTL = 60 * 5
export const sessionStateCache = makeAccessors<string>('sessionState', SESSION_STATE_TTL)
