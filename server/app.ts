
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as path from 'path'

import { errorHandler } from './middleware/errorHandler'
import { hstsMiddleware } from './middleware/hsts'
import { sessionMiddleware } from './middleware/session'
import { storybookMiddleware } from './middleware/storybook'
import { html5Fallback, webpackHotMiddleware, webpackMiddleware } from './middleware/webpack'
import { router } from './routes'

export function buildApp () {
  const app = express()

  // express configuration
  app.enable('trust proxy')
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

  // middlewares
  app.use(hstsMiddleware)
  app.use(compression())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser())
  app.use(sessionMiddleware)

  // application router (api)
  app.use(router)

  // webpack
  app.use(webpackMiddleware())
  app.use(webpackHotMiddleware())

  // storybook
  app.use(storybookMiddleware())

  // static assets
  app.use(express.static(path.join(__dirname, '../static'), {
    etag: true,
    lastModified: true,
  }))

  // html5 fallback routing
  app.use(html5Fallback())

  // error handler
  app.use(errorHandler)

  return app
}
