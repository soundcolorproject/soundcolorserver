
import * as OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import * as path from 'path'
import * as TerserPlugin from 'terser-webpack-plugin'
import * as webpack from 'webpack'

import { codeRules, glslRule } from './code'
import { buildConstants } from './constants'
import { buildPlugins } from './plugins'
import { styleRules } from './styles'

function createConfig ({ prod = false, appMode = false } = {}): webpack.Configuration & { devServer: { [k: string]: any } } {
  const dev = !prod
  const constants = buildConstants(dev)

  return {
    bail: false,
    mode: dev ? 'development' : 'production',
    devtool: dev ? 'eval-source-map' : undefined,
    entry: [
      require.resolve('babel-polyfill'),
      require.resolve('../polyfills'),
      dev ? require.resolve('webpack-hot-middleware/client') : '',
      constants.entrypoint,
    ].filter(e => e),
    devServer: {
      compress: true,
      hot: true,
      historyApiFallback: true,
    },
    output: {
      path: constants.outputDir,
      pathinfo: dev,
      publicPath: '/',
      filename: constants.outputJsFile,
      chunkFilename: constants.outputJsChunkFiles,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: dev
      ? (info) =>
          path
            .resolve(info.absoluteResourcePath)
            .replace(/\\/g, '/')
      : (info) =>
          path
            .relative(constants.srcDir, info.absoluteResourcePath)
            .replace(/\\/g, '/'),
    },
    resolve: {
      extensions: [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
      ],
      alias: {
        'react-dom': dev ? '@hot-loader/react-dom' : 'react-dom',
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            ...codeRules(dev),
            glslRule(),
            ...styleRules(dev),
            {
              test: /\.svg$/,
              include: /Icon\/svg/,
              exclude: /node_modules/,
              use: [
                {
                  loader: 'raw-loader',
                },
              ],
            },
            {
              exclude: /\.(ejs|js|jsx|mjs|ts|tsx|html|json|css|pcss)$/,
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: buildPlugins(dev, appMode, constants),
    performance: {
      hints: dev ? false : 'warning',
    },
    optimization: !dev ? {
      minimizer: [
        new TerserPlugin(),
        new OptimizeCssAssetsPlugin(),
      ],
    } : {
      namedModules: true,
    },
  }
}

export default createConfig
