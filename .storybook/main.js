
const path = require('path')

require('ts-node').register({
  project: path.join(__dirname, '../tsconfig.server.json'),
})

const origConfig = require('../config/webpack').default()
const { buildDefinePlugin } = require('../config/webpack/plugins')

const IS_BUILD = process.env.BUILD === 'true'

module.exports = {
  stories: ['./includes.ts', '../site/**/*.stories.[j|t]sx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
  ],

  webpackFinal: (config) => {
    const result =  {
      ...config,
      entry: !IS_BUILD 
        ? config.entry
        : config.entry.map(e => {
          if (e.includes('webpack-hot-middleware')) {
            return `${e}&path=/storybook/__webpack_hmr`
          } else {
            return e
          }
        }),
      output: {
        ...config.output,
        publicPath: IS_BUILD ? '/storybook/' : '/',
      },
      devtool: 'eval-source-map',
      devServer: {
        ...config.devServer,
        publicPath: IS_BUILD ? '/storybook/' : '/',
      },
      resolve: {
        ...config.resolve,
        extensions: [
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '.json',
        ],
      },
      module: {
        ...config.module,
        rules: [
          ...origConfig.module.rules,
        ]
      },
      plugins: [
        ...config.plugins,
        buildDefinePlugin(),
      ],
    }

    return result
  },
};
