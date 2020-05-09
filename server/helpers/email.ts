
import { createTransport, Transporter } from 'nodemailer'
import { EmailCredentialsNotFoundError } from '../errors/EmailCredentialsNotFoundError'
import { logger } from '../../shared/logger'
import { EmailFailedToSendError } from '../errors/EmailFailedToSendError'

let emailTransport: Transporter
function getEmailTransport () {
  if (!emailTransport) {
    if (
      !process.env.EMAIL_SMTP_SERVER ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      logger.error('Failed to find email credentials')
      logger.error('EMAIL_SMTP_SERVER', process.env.EMAIL_SMTP_SERVER)
      logger.error('EMAIL_USER', process.env.EMAIL_USER)
      logger.error('EMAIL_PASS', process.env.EMAIL_PASS)
      throw new EmailCredentialsNotFoundError()
    }

    try {
      emailTransport = createTransport({
        host: process.env.EMAIL_SMTP_SERVER,
        auth: {
          type: 'login',
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        from: {
          name: 'Sound Color Notifier',
          address: process.env.EMAIL_USER,
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
  to: string
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
export async function sendSimpleEmail ({ to, subject, message, throwOnFailure = false }: SimpleEmailOpts): Promise<SimpleEmailResult> {
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
