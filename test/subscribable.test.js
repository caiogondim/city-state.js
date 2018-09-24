/* eslint-env jest */

const { Subscribable } = require('../build/index')

// Observable API: https://github.com/tc39/proposal-observable#api
it('implements subscribe method from Observable API', () => {
  const foo = new Subscribable({ state: { a: 1, b: 2} })
  expect(typeof foo.subscribe).toEqual('function')
})

it('calls subscribers when state change', () => {
  class Foo extends Subscribable {
    setA(a) {
      this._state.a = a
    }

    setB(b) {
      this._state.b = b
    }
  }

  const foo = new Foo({ state: { a: 1, b: 2} })
  let count = 0
  function subscriber() {
    count += 1
  }
  foo.subscribe(subscriber)
  foo.setA(2)
  foo.setB(3)
  expect(count).toEqual(2)
  expect(foo.state.a).toEqual(2)
  expect(foo.state.b).toEqual(3)
})

it('doesnt allow state to be changed externally', () => {

})
