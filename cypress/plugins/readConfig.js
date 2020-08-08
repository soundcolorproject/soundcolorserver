
const DEV = 'development'

module.exports = (_on, config) => {
  const { configFile = DEV } = config.env
  const envConfig = require(`../config/${configFile}.json`)
  if (configFile === DEV) {
    envConfig.baseUrl = envConfig.baseUrl.replace('${PORT}', process.env.PORT || '9000')
  }

  return Object.assign(
    config,
    envConfig,
  )
}
