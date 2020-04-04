
import { FetchError } from '../errors/FetchError'

function prepareRequest (request: Request | RequestInit) {
  let req: Request | (RequestInit & { headers: Headers })
  if (!(request instanceof Request)) {
    request.headers = new Headers(request.headers)
    req = request as RequestInit & { headers: Headers }
  } else {
    req = request
  }

  if (!req.headers.has('Accept')) {
    req.headers.set('Accept', 'application/json')
  }
}

function extractData (res: Response) {
  if (res.headers.get('Content-Type') === 'application/json') {
    return res.json()
  } else {
    return res.text()
  }
}

export async function fetcher (input: RequestInfo, init: RequestInit = {}) {
  prepareRequest(typeof input === 'object' ? input : init)
  const res = await fetch(input, init)
  const data = await extractData(res)
  if (res.ok) {
    return data
  } else {
    throw new FetchError(res, data)
  }
}
