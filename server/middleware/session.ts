
import { RequestHandler } from 'express'
import * as asyncHandler from 'express-async-handler'
import { randomBytes } from 'crypto'
import { promisify } from 'util'
import { config } from '../config'
import { logger } from '../../shared/logger'

const randomBytesAsync = promisify(randomBytes)
async function randomString (length: number) {
  length = Math.max(1, length)
  const byteLength = Math.ceil(length * 6 / 8)
  const byteBuffer = await randomBytesAsync(byteLength)
  return byteBuffer.toString('base64').substring(0, length)
}

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
