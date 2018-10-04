const readOnlyCopy = require('./util/read-only-copy')
const withSubscribe = require('with-subscribe')

function applySubscribableInterface(BaseClass) {
  class Subscribable extends BaseClass {
    constructor(...args) {
      super(...args)

      const { state } = args[0]

      if (typeof state !== 'object') {
        throw TypeError('state must be an object')
      }

      this._state = withSubscribe(state)
    }

    get state() {
      return readOnlyCopy(this._state)
    }

    get subscribe() {
      return this._state.subscribe
    }
  }

  return Subscribable
}

function subscribable(target) {
  // Used as function
  if (typeof target === 'function') {
    return applySubscribableInterface(target)
  }

  // Used as decorator
  const classDescriptor = target;
  return {
    ...classDescriptor,
    finisher: klass => {
      return applySubscribableInterface(klass)
    }
  }
}

module.exports = subscribable
