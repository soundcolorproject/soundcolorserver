
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'
import { getLocalBridges } from '../../../hue-helpers/getLocalBridges'

export const localRouter = Router()

localRouter.use('/bridges', asyncHandler(async (req, res) => {
  const bridges = await getLocalBridges()
  res.send(bridges)
}))
