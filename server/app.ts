
import * as path from 'path'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import { router } from './routes'
import { errorHandler } from './middleware/errorHandler'
import { sessionMiddleware } from './middleware/session'
import { webpackMiddleware, webpackHotMiddleware } from './middleware/webpack'

export const app = express()

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(sessionMiddleware)

// application
app.use(webpackMiddleware())
app.use(webpackHotMiddleware())
app.use(express.static(path.join(__dirname, '../public'), {
  etag: true,
  lastModified: true,
}))
app.use(router)

// error handler
app.use(errorHandler)
