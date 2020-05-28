
import * as webpack from 'webpack'
import * as path from 'path'

import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import { WatchMissingNodeModulesPlugin } from './WatchMissingNodeModulesPlugin'

import { Constants } from './constants'

import { config } from '../../server/config'

export const definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  '__REMOTE_API__': JSON.stringify(config.remoteApi),
  '__LOG_LEVEL__': JSON.stringify(config.logLevel),
  '__DEV__': JSON.stringify(config.dev),
  '__BUILD_NUMBER__': JSON.stringify(process.env.CI_BUILD_NUMBER || 'development'),
})

export function buildPlugins (dev: boolean, constants: Constants) {
  let plugins = [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: constants.htmlPath,
    }),
    definePlugin,
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]

  if (dev) {
    plugins = [
      ...plugins,
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin('node_modules'),
    ]
  } else {
    plugins = [
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, '../../static'),
          to: constants.outputDir,
        },
      ]),
      ...plugins,
      new MiniCssExtractPlugin({
        filename: constants.outputCssFile,
        chunkFilename: constants.outputCssChunkFiles,
      }),
    ]
  }

  return plugins
}
