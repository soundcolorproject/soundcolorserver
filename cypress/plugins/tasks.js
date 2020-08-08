
// tasks have to return something that isn't undefined, or they'll throw an error
module.exports = (on) => {
  on('task', {
    log (args) {
      console.log(...args)
      return null
    },
    warn (args) {
      console.warn(...args)
      return null
    },
    error (args) {
      console.error(...args)
      return null
    }
  })
}
