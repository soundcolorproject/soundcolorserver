'use strict';

// This is a custom Jest transformer turning style imports into a proxy
// The proxy returns the name of the property asked for whenever a property is accessed.

const transformContent = `
  module.exports = new Proxy({}, {
    get (_target, prop) {
      return prop.toString()
    },
  })
`

module.exports = {
  process() {
    return transformContent;
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  },
};
