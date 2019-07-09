/* eslint-env jest */

const $$observable = require('symbol-observable').default
const { subscribable } = require('../src/index')

// Observable API: https://github.com/tc39/proposal-observable#api
it('implements subscribe method from Observable API', () => {
  @subscribable
  class Foo {}
  const foo = new Foo()
  expect(typeof foo.subscribe).toEqual('function')
})

it('calls subscribers when state change', () => {
  @subscribable
  class Foo {
    constructor() {
      this.count = 0
    }

    increment() {
      this.count += 1
    }

    decrement() {
      this.count -= 1
    }
  }

  const foo = new Foo()
  let count = 0
  function subscriber() {
    count += 1
  }
  foo.subscribe(subscriber)
  foo.increment()
  foo.decrement()
  foo.increment()
  expect(count).toEqual(4)
  expect(foo.count).toEqual(1)
})

it('doesnt allow state to be changed externally', () => {
  @subscribable
  class Foo {
    constructor() {
      this.count = 0
    }
  }

  const foo = new Foo()

  expect(() => this.state.count = 3).toThrow(Error)
})

it('works as a decorator', () => {
  @subscribable
  class Foo {
    constructor() {
      this.count = 0
    }

    increment() {
      this.count += 1
    }

    decrement() {
      this.count -= 1
    }
  }

  const foo = new Foo()
  foo.increment()

  expect(foo.count).toEqual(1)
})

it('works as a function', () => {
  const Foo = subscribable(class Foo {
    constructor() {
      this.count = 0
    }
    increment() {
      this.count += 1
    }

    decrement() {
      this.count -= 1
    }
  })

  const foo = new Foo()
  foo.increment()

  expect(foo.count).toEqual(1)
})

// Tests adapted from https://github.com/reactjs/redux/blob/4e5f7ef3569e9ef6d02f7b3043b290dc093c853b/test/createStore.spec.js#L613
describe('Symbol.observable interop point', () => {
  it('exists', () => {
    @subscribable
    class Foo {}
    const foo = new Foo()
    expect(typeof foo[$$observable]).toBe('function')
  })

  describe('returned value', () => {
    it('is subscribable', () => {
      @subscribable
      class Foo {}
      const foo = new Foo()
      const obs = foo[$$observable]()
      expect(typeof obs.subscribe).toBe('function')
    })

    it('returns a subscription object when subscribed', () => {
      @subscribable
      class Foo {}
      const foo = new Foo()
      const obs = foo[$$observable]()
      const sub = obs.subscribe({})
      expect(typeof sub.unsubscribe).toBe('function')
    })
  })

  it('passes an integration test with no unsubscribe', () => {
    @subscribable
    class Foo {
      constructor() {
        this.count = 0
      }

      increment() {
        this.count += 1
      }
    }
    const foo = new Foo()
    const observable = foo[$$observable]()
    const results = []

    observable.subscribe({
      next (observed) {
        results.push({ ...observed })
      }
    })

    foo.increment()

    expect(results).toEqual([
      { count: 0 },
      { count: 1 }
    ])
  })

  it('passes an integration test with an unsubscribe', () => {
    @subscribable
    class Foo {
      constructor() {
        this.count = 0
      }

      increment() {
        this.count += 1
      }
    }
    const foo = new Foo()
    const observable = foo[$$observable]()
    const results = []

    const sub = observable.subscribe({
      next (observed) {
        results.push({ ...observed })
      }
    })

    foo.increment()
    sub.unsubscribe()
    foo.increment()

    expect(results).toEqual([
      { count: 0 },
      { count: 1 },
    ])
  })
})
