const readOnlyCopy = require('./util/read-only-copy')
const withSubscribe = require('with-subscribe')
const $$observable = require('symbol-observable').default

function applySubscribableInterface (BaseClass) {
  class Subscribable extends BaseClass {
    constructor (...args) {
      super(...args)

      this._stateReadOnlyCache
      this._state = this._state || {}
      this._state = withSubscribe(this._state)
      this._state.subscribe((state) => {
        this._stateReadOnlyCache = readOnlyCopy(state)
      })
    }

    get state () {
      return this._stateReadOnlyCache
    }

    get subscribe () {
      return this._state.subscribe
    }

    get [$$observable] () {
      return this._state[$$observable]
    }
  }

  return Subscribable
}

function subscribable (target) {
  // Used as function
  if (typeof target === 'function') {
    return applySubscribableInterface(target)
  }

  // Used as decorator
  const classDescriptor = target
  return {
    ...classDescriptor,
    finisher: klass => {
      return applySubscribableInterface(klass)
    }
  }
}

module.exports = subscribable
