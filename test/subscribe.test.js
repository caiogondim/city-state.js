/* eslint-env jest */

const { Subscribe, subscribable } = require('../src/index')
const React = require('react')
const { mount } = require('enzyme')
const { configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() });

@subscribable
class Foo {
  increment() {
    this._state.count += 1
  }

  decrement() {
    this._state.count -= 1
  }
}

function createIdleForMsPromise(ms = 1) {
  let timeout
  let resolve
  const promise = new Promise(resolve_ => {
    resolve = resolve_
    timeout = setTimeout(resolve, ms)
  })
  promise.reset = () => {
    clearTimeout(timeout)
    timeout = setTimeout(resolve, ms)
  }

  return promise
}

//
// Tests
//

it('re-renders children whenever observable changes', async () => {
  const foo = new Foo({ state: { count: 0 } })

  const idleRender = createIdleForMsPromise()

  function FooComponent() {
    return (
      <Subscribe to={[foo]}>
        {(fooState = {}) => {
          idleRender.reset()
          return (
            <span className="fooState">{fooState.count}</span>
          )
        }}
      </Subscribe>
    )
  }

  const wrapper = mount(<FooComponent />)

  foo.increment()

  await idleRender
  expect(wrapper.find('.fooState').text()).toEqual('1')
})

it('accepts multiple observables', async () => {
  const foo = new Foo({ state: { count: 0 } })
  const bar = new Foo({ state: { count: 1 } })

  const idleRender = createIdleForMsPromise()

  function FooComponent() {
    return (
      <Subscribe to={[foo, bar]}>
        {(fooState = {}, barState = {}) => {
          idleRender.reset()
          return (
            <div>
              <span className="fooState">{fooState.count}</span>
              <span className="barState">{barState.count}</span>
            </div>
          )
        }}
      </Subscribe>
    )
  }

  const wrapper = mount(<FooComponent />)

  foo.increment()
  bar.increment()

  await idleRender
  expect(wrapper.find('.fooState').text()).toEqual('1')
  expect(wrapper.find('.barState').text()).toEqual('2')
})

it('unsubscribe from all subscriptions when component unmounts', async () => {
  const foo = new Foo({ state: { count: 0 } })

  const idleRender = createIdleForMsPromise()

  class FooComponent extends React.Component {
    constructor() {
      super()

      this.state = {
        isHidden: false
      }
    }

    hide() {
      this.setState({
        isHidden: true
      })
    }

    render() {
      idleRender.reset()

      if (this.state.isHidden) return null

      return (
        <Subscribe to={[foo]}>
          {(fooState = {}) => {
            idleRender.reset()
            return (
              <div>
                <span className="fooState">{fooState.count}</span>
              </div>
            )
          }}
        </Subscribe>
      )
    }
  }

  const wrapper = mount(<FooComponent />)

  expect(wrapper.find(Subscribe).instance()._subscriptions.length).toEqual(1)

  wrapper.find(FooComponent).instance().hide()
  expect(wrapper.find(Subscribe).instance()._subscriptions.length).toEqual(0)
})
