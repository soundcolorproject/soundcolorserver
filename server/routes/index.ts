
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import { apiRouter } from './api'
import { config } from '../config'
import { getApi } from '../hue-helpers/getApi'
import { deleteRemoteCredentials } from '../db/remoteCredentials'

export const router = Router()

if (config.remoteApi) {
  router.get('/login', asyncHandler(async (req, res) => {
    const api = await getApi(req.getSessionId())
    if (api) {
      res.redirect('/return-from-hue')
    }
  }))

  router.get('/logout', asyncHandler(async (req, res) => {
    await res.clearSession()
    res.redirect('/sovis')
  }))
}

router.use('/api', apiRouter)
