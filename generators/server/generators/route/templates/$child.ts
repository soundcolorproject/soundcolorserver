
import { Router } from 'express'
import * as asyncHandler from 'express-async-handler'

export const $childRouter = Router()

$childRouter.get('/', asyncHandler(async (req, res) => {
  res.send('Hello $child router!')
}))
