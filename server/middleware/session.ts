
import { RequestHandler } from 'express'
import * as asyncHandler from 'express-async-handler'
import { config } from '../config'
import { logger } from '../../shared/logger'
import { randomString } from '../helpers/random'
import { deleteRemoteCredentials } from '../db/remoteCredentials'
import { apiCache } from '../hue-helpers/cache'

export const sessionMiddleware: RequestHandler = config.remoteApi
? asyncHandler(async (req, res, next) => {
  const allowCookies = config.standaloneApp || req.header('allow-cookie') === 'true'
  let session: string = req.cookies.session

  if (!allowCookies) {
    res.clearCookie('session')
    if (session) {
      apiCache.del(session)
      await deleteRemoteCredentials(session)
    }

    req.getSessionId = () => ''
    res.clearSession = async () => {
      // noop
    }
    return
  }

  logger.debug('session', session)
  if (!session) {
    session = await randomString(16)
    logger.debug('generated session', session)
    res.cookie('session', session)
  }

  req.getSessionId = () => session || 'none'
  res.clearSession = async () => {
    res.clearCookie('session')
    apiCache.del(session)
    await deleteRemoteCredentials(session)
  }

  next()
})
: (req, res, next) => {
  req.getSessionId = () => 'dummy session'
  next()
}
