
import * as webpack from 'webpack'

import * as path from 'path'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import * as OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import { codeRule } from './code'
import { styleRule } from './styles'
import { buildConstants } from './constants'
import { buildPlugins } from './plugins'

function createConfig ({ prod = false } = {}): webpack.Configuration & { devServer: { [k: string]: any } } {
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
      host: '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      contentBase: [
        constants.staticDir,
      ],
      compress: true,
      clientLogLevel: 'none',
      watchContentBase: true,
      hot: true,
      historyApiFallback: true,
      // TODO: remove this once this issue is resolved:
      // https://github.com/webpack/webpack-dev-server/issues/1604
      disableHostCheck: true,
    },
    output: {
      path: constants.outputDir,
      pathinfo: dev,
      publicPath: '/',
      filename: constants.outputJsFile,
      chunkFilename: constants.outputJsChunkFiles,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: dev
        ? (info: any) =>
            path
              .resolve(info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : (info: any) =>
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
            codeRule(dev),
            styleRule(dev),
            {
              exclude: /\.(js|jsx|mjs|ts|tsx|html|json|css|pcss)$/,
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: buildPlugins(dev, constants),
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    performance: {
      hints: dev ? false : 'warning',
    },
    optimization: !dev ? {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              beautify: false,
            },
          },
          parallel: true,
          cache: 'uglify-cache',
          sourceMap: false,
        }),
        new OptimizeCssAssetsPlugin({}),
      ],
    } : {
      namedModules: true,
    },
  }
}

export default createConfig
