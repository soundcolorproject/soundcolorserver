
import { FetchError } from '../errors/FetchError'
import { ServerErrorResponse } from '../../shared/ServerErrorResponse'
import { apiStatusStore } from '../state/apiStatusStore'
import { ServerErrorCode } from '../../shared/ServerErrorCode'

function prepareRequest (url: string, init: RequestInit) {
  if (init.headers) {
    init.headers = new Headers(init.headers)
  } else {
    init.headers = new Headers()
  }

  if (!init.headers.has('Accept')) {
    init.headers.set('Accept', 'application/json')
  }
  if (!init.headers.has('Content-Type')) {
    init.headers.set('Content-Type', 'application/json')
  }
  if (apiStatusStore.allowCookies) {
    init.headers.set('allow-cookie', 'true')
  }

  if (url.startsWith('/')) {
    url = `/api${url}`
  }

  return { url, init }
}

function extractData (res: Response) {
  if (res.status === 204) {
    return null
  } else if (res.headers.get('Content-Type')?.startsWith('application/json')) {
    return res.json()
  } else {
    return res.text()
  }
}

function makeFetchError (res: Response, data: ServerErrorResponse): Error {
  // if (res.status === 401 || res.status === 403) {

  // }
  return new FetchError(res, data)
}

async function fetcher<T> (origUrl: string, origInit: RequestInit = {}): Promise<T> {
  const { url, init } = prepareRequest(origUrl, origInit)
  let res: any
  try {
    res = await fetch(url, init)
    if (apiStatusStore.offline) {
      apiStatusStore.offline = false
    }
  } catch (e) {
    if (!apiStatusStore.offline) {
      apiStatusStore.offline = true
    }
    throw new FetchError(res, {
      message: 'You are offline.',
      errorCode: ServerErrorCode.OFFLINE,
    })
  }

  const data = await extractData(res)
  if (res.ok) {
    return data
  } else {
    throw makeFetchError(res, data)
  }
}

export async function apiGet<Out> (url: string, init?: RequestInit) {
  return fetcher<Out>(url, {
    ...init,
    method: 'GET',
  })
}

type RequestInitWithBody<T> = Omit<RequestInit, 'body'> & { body: T }
export async function apiPost<In, Out = {}> (url: string, init: RequestInitWithBody<In>) {
  return fetcher<Out>(url, {
    ...init,
    body: JSON.stringify(init.body),
    method: 'POST',
  })
}
