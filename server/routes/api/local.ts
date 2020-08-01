
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'

import { getLocalBridges } from '../../hue-helpers/getLocalBridges'

export const localRouter = Router()

localRouter.get('/bridges', asyncHandler(async (_req, res) => {
  const bridges = await getLocalBridges()
  res.json(bridges)
}))
