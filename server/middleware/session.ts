
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
  if (!session && allowCookies) {
    session = await randomString(16)
    logger.debug('generated session', session)
    res.cookie('session', session)
  }

  req.getSessionId = () => session || ''
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
