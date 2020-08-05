
import { Router } from 'express'
import { $childRouter } from './$child'

export const $parentRouter = Router()

$parentRouter.use('/$child', $childRouter)
