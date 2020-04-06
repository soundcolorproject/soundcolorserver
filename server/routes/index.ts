
import { Router } from 'express'
import { apiRouter } from './api'

export const router = Router()

router.use('/api', apiRouter)
