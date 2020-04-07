
import { Router } from 'express'
import { authRouter } from './auth'
import { hueRouter } from './hue'
import { localRouter } from './local'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/hue', hueRouter)
apiRouter.use('/local', localRouter)
