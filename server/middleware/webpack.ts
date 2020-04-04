
import { RequestHandler } from 'express'
import * as wp from 'webpack'
import * as wdm from 'webpack-dev-middleware'
import * as whm from 'webpack-hot-middleware'

let compiler: wp.Compiler
function getCompiler () {
  if (!compiler) {
    const webpack = require('webpack') as typeof wp
    compiler = webpack(require('../../config/webpack').default())
  }

  return compiler
}

export function webpackMiddleware (): RequestHandler {
  try {
    const webpackDevMiddleware = require('webpack-dev-middleware') as typeof wdm

    return webpackDevMiddleware(getCompiler())
  } catch (e) {
    return (req, res, next) => next()
  }
}

export function webpackHotMiddleware (): RequestHandler {
  try {
    const webpackHotMiddleware = require('webpack-hot-middleware') as typeof whm

    return webpackHotMiddleware(getCompiler(), {
      heartbeat: 2000,
    })
  } catch (e) {
    return (req, res, next) => next()
  }
}
