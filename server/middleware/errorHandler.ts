
import { ErrorRequestHandler } from 'express'
import { config } from '../config'
import { ApiError } from 'node-hue-api'
import { HueErrorCode } from '../hue/HueErrorCode'
import { logger } from '../../shared/logger'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let status = 500
  let data: { message: any } | null = null
  let message: any = 'Something went wrong, please try again later'

  if (err instanceof ApiError) {
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
      message = err.stack
    } else {
      message = err.toString()
    }
  }

  if (!data) {
    data = { message }
  }
  res.status(status).send(data)
}
