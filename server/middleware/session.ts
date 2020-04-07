
import { RequestHandler } from 'express'
import * as asyncHandler from 'express-async-handler'
import { config } from '../config'
import { logger } from '../../shared/logger'
import { randomString } from '../helpers/random'

export const sessionMiddleware: RequestHandler = config.remoteApi
? asyncHandler(async (req, res, next) => {
  let session: string = req.cookies.session
  logger.debug('session', session)
  if (!req.cookies.session) {
    session = await randomString(16)
    logger.debug('generated session', session)
    res.cookie('session', session)
  }

  req.getSessionId = () => session

  next()
})
: (req, res, next) => {
  req.getSessionId = () => 'dummy session'
  next()
}
