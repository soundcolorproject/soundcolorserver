
const runAll = (funcs) => (on, originalConfig) =>
  funcs.reduce((config, func) => {
    return func(on, config) || config
  }, originalConfig)

module.exports = runAll([
  require('./readConfig'),
  require('./cucumber'),
  require('./tasks')
])
