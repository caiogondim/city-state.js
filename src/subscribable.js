const withSubscribe = require('with-subscribe')

function applySubscribableInterface (target) {
  return withSubscribe(target)
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
