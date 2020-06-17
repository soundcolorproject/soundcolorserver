
import * as webpack from 'webpack'
import * as path from 'path'
import * as glob from 'glob'

// This has to be done because there aren't typings for disable-output-webpack-plugin
const DisableOutputWebpackPlugin = require('disable-output-webpack-plugin')

import { styleRules } from './styles'

function createOnlyStylesConfig (): webpack.Configuration {
  return {
    bail: false,
    mode: 'none',
    entry: glob.sync(path.join(__dirname, '../../site/**/*.pcss')),
    output: {
      path: path.join(__dirname, '../../tmp'),
    },
    resolve: {
      extensions: [
        '.js',
        '.pcss',
      ],
    },
    module: {
      rules: [
        ...styleRules(true, true),
      ],
    },
    plugins: [
      new DisableOutputWebpackPlugin(),
    ],
  }
}

export default createOnlyStylesConfig
