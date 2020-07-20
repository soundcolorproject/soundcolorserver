
const noop = () => undefined
exports.default = {
  create: jest.fn((options) => {
    const self = {
      setColor: () => true,
      on: () => self,
      destroyAndRemove: noop,
      options,
    }

    return self
  }),
}
