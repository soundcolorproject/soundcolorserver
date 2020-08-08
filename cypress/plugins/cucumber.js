
const browserify = require('@cypress/browserify-preprocessor')
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = (on, config) => {
  console.log('config.projectRoot', config.projectRoot)
  const typescript = require.resolve('typescript')
  console.log('typescript', typescript)

  const options = {
    ...browserify.defaultOptions,
    typescript,
  }

  on('file:preprocessor', cucumber(options))
  console.log('done!')
}
