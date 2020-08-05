
import { SendEmailRequest, SendEmailResponse } from '../../shared/apiTypes/email'

import { apiPost } from './fetcher'

export async function sendFeedback (body: SendEmailRequest): Promise<SendEmailResponse> {
  return apiPost<SendEmailRequest, SendEmailResponse>('/email/sendFeedback', { body })
}
