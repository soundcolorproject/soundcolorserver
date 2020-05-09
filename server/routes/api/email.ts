
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import { sendSimpleEmailWithRetry } from '../../helpers/email'

export const emailRouter = Router()

interface SendEmailRequest {
  message: string
}

emailRouter.post('/sendFeedback', asyncHandler(async (req, res) => {
  const { message }: SendEmailRequest = req.body
  const { success } = await sendSimpleEmailWithRetry({
    to: 'kgroat09@gmail.com',
    subject: 'Sound Color Project Feedback',
    message,
  })

  if (!success) {
    res = res.status(500)
  }

  res.json({
    success,
  })
}))
