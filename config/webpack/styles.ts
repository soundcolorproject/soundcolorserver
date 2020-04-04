import * as webpack from 'webpack'

import * as pcssFunctions from '../../site/pcss-functions'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'

export const styleRule = (dev: boolean, onlyTypes = false): webpack.RuleSetRule => ({
  test: /\.p?css$/,
  use: [
    onlyTypes ? '' : (dev ? 'style-loader' : MiniCssExtractPlugin.loader),
    onlyTypes ? 'null-loader' : {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: dev ? '[name]_[local]--[hash:base64:4]' : '[hash:base64:8]',
        },
        importLoaders: 2,
      },
    },
    'typed-css-modules-loader?noEmit',
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-import'),
          require('postcss-mixins'),
          require('postcss-each'),
          require('postcss-for'),
          require('postcss-simple-vars'),
          require('postcss-calc'),
          require('postcss-flexbugs-fixes'),
          require('postcss-functions')({
            functions: pcssFunctions,
          }),
          require('postcss-color-function'),
          require('postcss-preset-env'),
          require('postcss-nested'),
          require('autoprefixer')({
            flexbox: 'no-2009',
          }),
        ],
      },
    },
  ].filter(l => l),
})
