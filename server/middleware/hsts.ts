
import { RequestHandler } from 'express'
import { config } from '../config'

const TWO_YEARS = 60 * 60 * 24 * 365 * 2
export const hstsMiddleware: RequestHandler = (req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && !config.dev && !config.standaloneApp) {
    res.setHeader('Strict-Transport-Security', `max-age=${TWO_YEARS}; includeSubDomains`)
    return res.redirect('https://' + req.hostname + req.url)
  }

  next()
}
