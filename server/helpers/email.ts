
import { createTransport, Transporter } from 'nodemailer'

import { logger } from '../../shared/logger'
import { config } from '../config'
import { EmailCredentialsNotFoundError } from '../errors/EmailCredentialsNotFoundError'
import { EmailFailedToSendError } from '../errors/EmailFailedToSendError'

let emailTransport: Transporter
function getEmailTransport () {
  if (!emailTransport) {
    if (
      !config.emailServer ||
      !config.emailUser ||
      !config.emailPass ||
      !config.emailRecipient
    ) {
      logger.error('Failed to find email credentials')
      logger.error('config.emailServer', !!config.emailServer)
      logger.error('config.emailUser', !!config.emailUser)
      logger.error('config.emailPass', !!config.emailPass)
      logger.error('config.emailRecipient', !!config.emailRecipient)
      throw new EmailCredentialsNotFoundError()
    }

    try {
      emailTransport = createTransport({
        host: config.emailServer,
        auth: {
          type: 'login',
          user: config.emailUser,
          pass: config.emailPass,
        },
        from: {
          name: 'Sound Color Notifier',
          address: config.emailUser,
        },
      })
    } catch (e) {
      logger.error('Failed to initialize email transport:', e)
      throw e
    }
  }

  return emailTransport
}

export interface SimpleEmailOpts {
  to?: string
  subject: string
  message: string
  throwOnFailure?: boolean
}
export type SimpleEmailResult = {
  success: true
} | {
  success: false,
  error: Error
}
export async function sendSimpleEmail (opts: SimpleEmailOpts): Promise<SimpleEmailResult> {
  const {
    to = config.emailRecipient,
    subject,
    message,
    throwOnFailure = false,
  } = opts

  const transport = getEmailTransport()
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    await transport.sendMail({
      to,
      subject,
      text: message,
    })
    logger.debug('Successfully sent email!')

    return {
      success: true,
    }
  } catch (error) {
    logger.warn('Failed to send email message:', error)
    if (throwOnFailure) {
      throw new EmailFailedToSendError(error)
    }
    return {
      success: false,
      error,
    }
  } finally {
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
  }
}

export interface SimpleEmailWithRetryOpts extends SimpleEmailOpts {
  retryCount?: number
}
export async function sendSimpleEmailWithRetry (opts: SimpleEmailWithRetryOpts): Promise<SimpleEmailResult> {
  const {
    retryCount = 3,
    throwOnFailure = false,
  } = opts

  let failureCount = 0
  let result = await sendSimpleEmail({
    ...opts,
    throwOnFailure: false,
  })

  while (!result.success && failureCount < retryCount) {
    failureCount++
    logger.warn('Retrying...')
    result = await sendSimpleEmail({
      ...opts,
      throwOnFailure: false,
    })
  }

  if (!result.success) {
    logger.warn(`Failed to send email, even with ${retryCount} retries.`)

    if (throwOnFailure) {
      throw new EmailFailedToSendError(result.error)
    }
  }

  return result
}
