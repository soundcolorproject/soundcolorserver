
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import { apiRouter } from './api'
import { config } from '../config'
import { getApi } from '../hue-helpers/getApi'

export const router = Router()

router.use('/api', apiRouter)

if (config.remoteApi) {
  router.use('/login', asyncHandler(async (req, res) => {
    const api = await getApi(req.getSessionId())
    if (api) {
      res.redirect('/')
    }
  }))
}

router.get('/foo', (req, res) => {
  res.send('foo')
})
