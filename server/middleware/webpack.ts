
import * as path from 'path'
import * as express from 'express'
import * as wp from 'webpack'
import * as wdm from 'webpack-dev-middleware'
import * as whm from 'webpack-hot-middleware'

let compiler: wp.Compiler
function getCompiler () {
  if (!compiler) {
    const webpack = require('webpack') as typeof wp
    compiler = webpack(require('../../config/webpack').default())
    // tslint:disable-next-line: no-console
    console.info('Using webpack middleware')
  }

  return compiler
}

export function webpackMiddleware (): express.RequestHandler {
  try {
    const webpackDevMiddleware = require('webpack-dev-middleware') as typeof wdm

    return webpackDevMiddleware(getCompiler())
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.info('Using precompiled assets')

    // fall back to build assets
    return express.static(path.join(__dirname, '../../public'), {
      etag: true,
      lastModified: true,
    })
  }
}

export function webpackHotMiddleware (): express.RequestHandler {
  try {
    const webpackHotMiddleware = require('webpack-hot-middleware') as typeof whm

    return webpackHotMiddleware(getCompiler(), {
      heartbeat: 2000,
    })
  } catch (e) {
    return (req, res, next) => next()
  }
}
