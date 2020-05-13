
import * as React from 'react'

import { logger } from '../../../shared/logger'
import { sendFeedback } from '../../api/email'

import { successMessage, errorMessage } from './feedback.pcss'
import { FetchError } from '../../errors/FetchError'

export interface FeedbackProps {

}

export interface FeedbackState {
  feedback: string
  submitting: boolean
  success: boolean
  error: boolean
  errorText?: string
}

export class Feedback extends React.PureComponent<FeedbackProps, FeedbackState> {
  state: FeedbackState = {
    feedback: '',
    submitting: false,
    success: false,
    error: false,
  }

  submitFeedback = () => {
    const { feedback } = this.state
    if (!feedback) {
      return
    }

    logger.info('Sending feedback...')
    this.setState({
      submitting: true,
      error: false,
    })
    sendFeedback({ message: feedback }).then(({ success }) => {
      logger.info('Feedback sent:', success)
      this.setState({
        submitting: false,
        success,
        error: !success,
      })
    }).catch((e) => {
      logger.info('Failed to send feedback!')
      if (e instanceof FetchError) {
        this.setState({
          submitting: false,
          error: true,
          errorText: e.data.message,
        })

        return
      }

      this.setState({
        submitting: false,
        error: true,
      })
    })
  }

  setFeedback = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      feedback: ev.currentTarget.value,
    })
  }

  render () {
    const { feedback, submitting, success, error, errorText } = this.state

    if (success) {
      return (
        <>
          <div className={successMessage}>
            We appreciate your feedback!
          </div>
        </>
      )
    }

    return (
      <>
        <textarea
          placeholder='Tell us about your idea...'
          onChange={this.setFeedback}
          value={feedback}
        />
        <button type='button' role='button' disabled={!feedback || submitting} onClick={this.submitFeedback}>
          {
            submitting
              ? 'Sending...'
              : 'Send Message'
          }
        </button>
        {
          error
            ? <div className={errorMessage}>
                {
                  errorText ||
                  'Something went wrong. Please try again.'
                }
              </div>
            : undefined
        }
      </>
    )
  }
}