const clone = require('clone')

function isPrimitive (value) {
  return value === null || (typeof value !== 'function' && typeof value !== 'object')
}

function setAllPropertiesAsReadOnly(src) {
  Object.keys(src).forEach(key => {
    if (!isPrimitive(src[key])) {
      setAllPropertiesAsReadOnly(src[key])
    }
    Object.defineProperty(src, key, { writable: false })
  })

  return src
}

function readOnlyCopy(src) {
  const copy = clone(src)

  return setAllPropertiesAsReadOnly(copy)
}

module.exports = readOnlyCopy
