
import { Request, Response, Router } from 'express'
import * as asyncHandler from 'express-async-handler'

import { SendEmailRequest, SendEmailResponse } from '../../../shared/apiTypes/email'
import { logger } from '../../../shared/logger'
import { sendSimpleEmailWithRetry } from '../../helpers/email'

export const emailRouter = Router()

type ErrorResponder = (req: Request, res: Response) => any
function makeRateLimiter<T> (limitMs: number, errorRespone: T | ErrorResponder) {
  const lastRequestTimes = new Map<string, number>()

  return async function limitByIp (req: Request, res: Response): Promise<boolean> {
    const lastTime = lastRequestTimes.get(req.ip) || 0
    if (Date.now() - lastTime > limitMs) {
      lastRequestTimes.set(req.ip, Date.now())
      return true
    }

    logger.warn(`Limited a request to ${req.url} from ${req.ip}`)

    if (typeof errorRespone === 'function') {
      await (errorRespone as ErrorResponder)(req, res)
    } else {
      res.status(400).json(errorRespone)
    }

    return false
  }
}

const FIVE_MINUTES = 5 * 60 * 1000
const emailLimiter = makeRateLimiter(FIVE_MINUTES, {
  success: false,
  message: 'You have to wait a bit before sending another email.',
})

emailRouter.post('/sendFeedback', asyncHandler(async (req, res) => {
  if (!await emailLimiter(req, res)) {
    return
  }

  const { message }: SendEmailRequest = req.body
  const { success } = await sendSimpleEmailWithRetry({
    subject: 'Sound Color Project Feedback',
    message,
  })

  const response: SendEmailResponse = {
    success,
  }

  if (!success) {
    res = res.status(500)
  }

  res.json(response)
}))
