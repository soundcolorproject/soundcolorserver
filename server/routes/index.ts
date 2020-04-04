
import { Router } from 'express'
import { apiRouter } from './api'
// import { contextHandler } from './context'

export const router = Router()

router.use('/api', apiRouter)

// router.use('/context.js', contextHandler)
