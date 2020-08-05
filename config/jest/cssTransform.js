'use strict';

// This is a custom Jest transformer turning style imports into a proxy
// The proxy returns the name of the property asked for whenever a property is accessed.

// const transformContent = (filename) => `
//   module.exports = new Proxy({}, {
//     get (_target, prop) {
//       const propStr = prop.toString()
//       const kebabCased = propStr.replace(/[A-Z]/g, (c, i) => {
//         if (i === 0) {
//           return c.toLowerCase()
//         } else {
//           return '-' + c.toLowerCase()
//         }
//       })

//       return '${filename}_' + kebabCased
//     },
//   })
// `
const transformContent = `
  module.exports = new Proxy({}, {
    get (_target, prop) {
      const propStr = prop.toString()
      return propStr.replace(/[A-Z]/g, (c, i) => {
        if (i === 0) {
          return c.toLowerCase()
        } else {
          return '-' + c.toLowerCase()
        }
      })
    },
  })
`

module.exports = {
  process () {
    // return transformContent(path);
    return transformContent
  },
  getCacheKey () {
    // The output is always the same.
    return 'cssTransform';
  },
};
