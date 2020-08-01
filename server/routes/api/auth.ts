
import { Request, Router } from 'express'
import * as asyncHandler from 'express-async-handler'

import { ConnectionStatus, ConnectResponse } from '../../../shared/apiTypes/hue'
import { logger } from '../../../shared/logger'
import { config } from '../../config'
import { OAuthProvider, verifyOauthState } from '../../db/oauthState'
import { InvalidOauthCallbackError } from '../../errors/InvalidOauthCallbackError'
import { NoLocalBridgesError } from '../../errors/NoLocalBridgesError'
import { createApiFromAccessCode, getApi, getLocalApi } from '../../hue-helpers/getApi'

export const authRouter = Router()

authRouter.get('/status', asyncHandler(async (req, res) => {
  let authenticated: boolean
  try {
    await getApi(req.getSessionId())
    authenticated = true
  } catch (e) {
    authenticated = false
  }

  res.json({
    authenticated,
  })
}))

// const HUE_REFERER = /^https:\/\/\w+\.meethue\.com/
function getOauthProvider (_req: Request): OAuthProvider {
  return 'hue'
  // if (!req.headers) {
  //   throw new NoHeaderError('referer')
  // }
  // const referer = req.headers.referer
  // if (!referer) {
  //   throw new NoHeaderError('referer')
  // }

  // if (HUE_REFERER.test(referer)) {
  //   return 'hue'
  // }

  // throw new InvalidOauthCallbackError()
}

if (config.remoteApi) {
  authRouter.get('/callback', asyncHandler(async (req, res) => {
    const session = req.getSessionId()
    const state: string = req.query.state
    const provider = getOauthProvider(req)
    const code: string = req.query.code

    logger.debug(`OAuth session: ${session}`)
    logger.debug(`OAuth state: ${state}`)
    logger.debug(`OAuth provider: ${provider}`)
    logger.debug(`OAuth code: ${code}`)

    const valid = await verifyOauthState(session, state, provider)
    if (!valid) {
      throw new InvalidOauthCallbackError()
    }

    const api = await createApiFromAccessCode(session, code)
    if (api) {
      return res.redirect('/return-from-hue')
    }

    res.status(400).send('Something went wrong, please try again.')
  }))
} else {
  authRouter.get('/connect', asyncHandler(async (_req, res) => {
    let status: ConnectionStatus = 'not connected'
    try {
      const api = await getLocalApi()
      if (api) {
        status = 'connected'
      }
    } catch (err) {
      if (err instanceof NoLocalBridgesError) {
        status = 'no bridges'
      }
    }

    const response: ConnectResponse = {
      status,
    }

    res.json(response)
  }))
}

authRouter.get('/loggedIn', asyncHandler(async (req, res) => {
  let loggedIn: boolean
  try {
    const api = await getApi(req.getSessionId())
    loggedIn = !!api
  } catch (e) {
    loggedIn = false
  }

  res.json(loggedIn)
}))
