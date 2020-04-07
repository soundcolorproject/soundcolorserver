
import { ErrorRequestHandler } from 'express'
import { config } from '../config'
import { ApiError } from 'node-hue-api'
import { HueErrorCode } from '../hue/HueErrorCode'
import { logger } from '../../shared/logger'
import { ServerError, DEFAULT_ERROR_MESSAGE } from '../errors/ServerError'
import { RedirectError } from '../errors/RedirectError'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let status = 500
  let data: { message: any } | null = null
  let message = DEFAULT_ERROR_MESSAGE

  if (err instanceof RedirectError && req.accepts('text/html')) {
    return res.redirect(err.redirectTo)
  } else if (err instanceof ServerError) {
    status = err.statusCode
    data = err.errorData
    message = err.errorMessage
    logger.info(`${status} -- ${message}`)
    if (data) {
      logger.info(JSON.stringify(data, null, 2))
    }
  } else if (err instanceof ApiError) {
    const hueError = err.getHueError()

    logger.warn(err.stack)
    logger.warn(JSON.stringify(hueError.payload, null, 2))

    if (config.dev) {
      data = hueError.payload
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
  } else if (config.dev) {
    if (err instanceof Error) {
      message = err.stack || err.message
    } else {
      message = err.toString()
    }
  }

  if (!data) {
    data = { message }
  } else if (!data.message) {
    data = {
      ...data,
      message,
    }
  }
  res.status(status).send(data)
}
