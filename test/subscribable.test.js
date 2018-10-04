/* eslint-env jest */

const { subscribable } = require('../src/index')

// Observable API: https://github.com/tc39/proposal-observable#api
it('implements subscribe method from Observable API', () => {
  @subscribable
  class Foo {}
  const foo = new Foo({ state: {} })
  expect(typeof foo.subscribe).toEqual('function')
})

it('calls subscribers when state change', () => {
  @subscribable
  class Foo {
    increment() {
      this._state.count += 1
    }

    decrement() {
      this._state.count -= 1
    }
  }

  const foo = new Foo({ state: { count: 0 } })
  let count = 0
  function subscriber() {
    count += 1
  }
  foo.subscribe(subscriber)
  foo.increment()
  foo.decrement()
  foo.increment()
  expect(count).toEqual(3)
  expect(foo.state.count).toEqual(1)
})

it('doesnt allow state to be changed externally', () => {
  @subscribable
  class Foo {}

  const foo = new Foo({ state: { count: 0 } })

  expect(() => this.state.count = 3).toThrow(Error)
})

it('works as a decorator', () => {
  @subscribable
  class Foo {
    increment() {
      this._state.count += 1
    }

    decrement() {
      this._state.count -= 1
    }
  }

  const foo = new Foo({ state: { count: 0 } })
  foo.increment()

  expect(foo.state.count).toEqual(1)
})

it('works as a function', () => {
  const Foo = subscribable(class Foo {
    increment() {
      this._state.count += 1
    }

    decrement() {
      this._state.count -= 1
    }
  })

  const foo = new Foo({ state: { count: 0 } })
  foo.increment()

  expect(foo.state.count).toEqual(1)
})
