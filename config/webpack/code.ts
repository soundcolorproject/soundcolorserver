
import * as webpack from 'webpack'

export const codeRule = (dev: boolean): webpack.RuleSetRule => ({
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        compact: true,
        cacheDirectory: true,
        babelrc: false,
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          dev ? 'react-hot-loader/babel' : undefined,
        ].filter(p => p),
      },
    },
  ],
})
