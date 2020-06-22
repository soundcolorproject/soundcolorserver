
import { ErrorRequestHandler } from 'express'
import { config } from '../config'
import { ApiError } from 'node-hue-api'
import { HueErrorCode } from '../hue/HueErrorCode'
import { logger } from '../../shared/logger'
import { ServerError, DEFAULT_ERROR_MESSAGE } from '../errors/ServerError'
import { RedirectError } from '../errors/RedirectError'
import { ServerErrorCode } from '../../shared/ServerErrorCode'
import { ServerErrorResponse } from '../../shared/ServerErrorResponse'
import HueError = require('node-hue-api/lib/HueError')

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let status = 500
  let errorCode = ServerErrorCode.UNKNOWN_ERROR
  let data: ServerErrorResponse | null = null
  let message = DEFAULT_ERROR_MESSAGE

  if (err instanceof RedirectError && req.accepts('text/html')) {
    return res.redirect(err.redirectTo)
  } else if (err instanceof ServerError) {
    status = err.statusCode
    data = err.errorData
    message = err.errorMessage
    errorCode = err.errorCode
    logger.info(`${status} -- ${message}`)
    if (data) {
      logger.info(JSON.stringify(data, null, 2))
    }
  } else if (err instanceof ApiError) {
    logger.warn(err.stack)
    const hueError = err.getHueError() as HueError | undefined
    if (hueError) {
      errorCode = 10000 + hueError.type
      logger.warn(JSON.stringify(hueError.payload, null, 2))
      if (hueError.type === HueErrorCode.INVALID_ACCESS_TOKEN) {
        res.clearSession().catch(e => {
          logger.warn('Failed to clear session data for session.', e)
        })
        if (req.accepts('text/html')) {
          return res.redirect('/login')
        }
      }

      if (config.dev) {
        data = hueError.payload
        if (data) {
          delete data.type
        }
      } else {
        message = hueError.message
      }

      // link button not pressed
      switch (hueError.type) {
        case HueErrorCode.UNAUTHORIZED_USER:
        case HueErrorCode.LINK_BUTTON_NOT_PRESSED:
          status = 403
          break
      }
      if (hueError.type === 101) {
        status = 403
      }
    }

  } else if (config.dev) {
    if (err instanceof Error) {
      message = err.stack || err.message
    } else {
      message = err.toString()
    }
  }

  data = {
    message,
    errorCode,
    ...data,
  }

  res.status(status).send(data)
}
