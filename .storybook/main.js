
const path = require('path')

require('ts-node').register({
  project: path.join(__dirname, '../tsconfig.server.json'),
})

const origConfig = require('../config/webpack').default()
const { definePlugin } = require('../config/webpack/plugins')

module.exports = {
  stories: ['./includes.ts', '../site/**/*.stories.[j|t]sx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
  ],
  webpackFinal: (config) => {
    return {
      ...config,
      devtool: 'eval-source-map',
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
        definePlugin,
      ],
    }
  },
};
