import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as webpack from 'webpack'

import { pcssPlugins } from '../pcssPlugins'

export const styleRules = (dev: boolean, onlyTypes = false): webpack.RuleSetRule[] => [
  {
    test: /\.p?css$/,
    exclude: /node_modules/,
    use: [
      onlyTypes ? '' : (dev ? 'style-loader' : MiniCssExtractPlugin.loader),
      onlyTypes ? 'null-loader' : {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: dev ? '[name]_[local]--[hash:base64:4]' : '[hash:base64:8]',
          },
          localsConvention: 'camelCase',
          importLoaders: 2,
        },
      },
      'typed-css-modules-loader?noEmit&camelCase',
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => pcssPlugins,
        },
      },
    ].filter(l => l),
  },
  onlyTypes ? null as any : {
    test: /\.css$/,
    include: /node_modules/,
    use: [
      dev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
      },
    ],
  },
].filter(l => l)
