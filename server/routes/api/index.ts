
import { Router } from 'express'

import { authRouter } from './auth'
import { emailRouter } from './email'
import { hueRouter } from './hue'
import { localRouter } from './local'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/email', emailRouter)
apiRouter.use('/hue', hueRouter)
apiRouter.use('/local', localRouter)
