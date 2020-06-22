
import * as webpack from 'webpack'

export const codeRules = (dev: boolean): webpack.RuleSetRule[] => {
  const rules = [
    {
      test: /\.(js|jsx|(?<!\.d\.)ts|tsx)$/,
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
    },
    {
      test: /\.d\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'null-loader',
        },
      ],
    },
  ]

  return rules
}

export const glslRule = (): webpack.RuleSetRule => ({
  test: /\.(vert|frag)$/,
  use: [{ loader: 'raw-loader' }],
})
