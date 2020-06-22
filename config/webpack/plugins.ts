
import * as webpack from 'webpack'
import * as path from 'path'

import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import { InjectManifest } from 'workbox-webpack-plugin'
import { WatchMissingNodeModulesPlugin } from './WatchMissingNodeModulesPlugin'

import { Constants } from './constants'

import { config } from '../../server/config'

export function buildDefinePlugin (appMode = false) {
  return new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    '__JEST__': JSON.stringify(false),
    '__REMOTE_API__': JSON.stringify(config.remoteApi),
    '__LOG_LEVEL__': JSON.stringify(config.logLevel),
    '__DEV__': JSON.stringify(config.dev),
    '__BUILD_VERSION__': JSON.stringify(process.env.CI_BUILD_NUMBER || process.env.SOURCE_VERSION || 'development'),
    '__APP_MODE__': JSON.stringify(appMode),
  })
}

export function buildPlugins (dev: boolean, appMode: boolean, constants: Constants) {
  let plugins: webpack.Plugin[] = [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: constants.htmlPath,
    }),
    buildDefinePlugin(appMode),
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]

  if (!appMode) {
    plugins.push(
      new InjectManifest({
        swSrc: path.join(__dirname, '../../site/sw.ts'),
        swDest: 'sw.js',
        maximumFileSizeToCacheInBytes: 10000000,
        exclude: [/\.webm$/],
        additionalManifestEntries: [
        ],
      }),
    )
  }

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
