
import { RequestHandler } from 'express'

const ONE_YEAR = 60 * 60 * 24 * 365
export const hstsMiddleware: RequestHandler = (_req, res, next) => {
  res.setHeader('Strict-Transport-Security', `max-age=${ONE_YEAR}; includeSubDomains`)
  next()
}
