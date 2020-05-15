
import { RequestHandler } from 'express'
import { config } from '../config'

const TWO_YEARS = 60 * 60 * 24 * 365 * 2
export const hstsMiddleware: RequestHandler = (req, res, next) => {
  res.setHeader('Strict-Transport-Security', `max-age=${TWO_YEARS}; includeSubDomains`)

  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && !config.dev) {
    return res.redirect('https://' + req.hostname + req.url)
  }

  next()
}
