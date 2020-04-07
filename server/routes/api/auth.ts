
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import { config } from '../../config'
import { createApiFromAccessCode, getLocalApi, getApi } from '../../hue-helpers/getApi'
import { sessionStateCache } from '../../hue-helpers/cache'
import { logger } from '../../../shared/logger'

export const authRouter = Router()

authRouter.get('/status', asyncHandler(async (req, res) => {
  let authenticated: boolean
  try {
    await getApi(req.getSessionId())
    authenticated = true
  } catch (e) {
    authenticated = false
  }

  res.send({
    authenticated,
  })
}))

if (config.remoteApi) {
  authRouter.get('/callback', asyncHandler(async (req, res) => {
    const code: string = req.query.code
    const state: string = req.query.state
    const session = req.getSessionId()
    const expectedState = sessionStateCache.get(session)

    logger.debug(`code: ${code}`)
    logger.debug(`session: ${session}`)
    logger.debug(`state: ${state}`)
    logger.debug(`expectedState: ${expectedState}`)

    if (state === expectedState) {
      const api = await createApiFromAccessCode(session, code)
      if (api) {
        return res.redirect('/')
      }
    }

    res.status(400).send('Something went wrong, please try again.')
  }))
} else {
  authRouter.get('/connect', asyncHandler(async (req, res) => {
    await getLocalApi()
    res.send({
      status: 'connected',
    })
  }))
}
