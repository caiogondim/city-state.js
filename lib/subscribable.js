const clone = require('clone')
const withSubscribe = require('with-subscribe')

function subscribable(BaseClass) {
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
      return clone(this._state)
    }

    get subscribe() {
      return this._state.subscribe
    }
  }

  return Subscribable
}

module.exports = subscribable
