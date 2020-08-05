
import * as pcssFunctions from '../site/pcss-functions'

export const pcssPlugins = [
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
]
