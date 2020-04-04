
import { Router } from 'express'
import { authRouter } from './auth'
import { localRouter } from './local'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/local', localRouter)
