/* eslint-env jest */

const { Subscribe, subscribable } = require('../src/index')
const React = require('react')
const { mount } = require('enzyme')
const { configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() });

@subscribable
class Foo {
  constructor() {
    this._state = {
      count: 0
    }
  }

  increment() {
    this._state.count += 1
  }

  decrement() {
    this._state.count -= 1
  }
}

//
// Tests
//

it('re-renders children whenever observable changes', async () => {
  const foo = new Foo()

  function FooComponent() {
    return (
      <Subscribe to={[foo]}>
        {(fooState) => {
          return (
            <span className="fooState">{fooState.count}</span>
          )
        }}
      </Subscribe>
    )
  }

  const wrapper = mount(<FooComponent />)

  foo.increment()

  expect(wrapper.find('.fooState').text()).toEqual('1')
})

it('accepts multiple observables', async () => {
  const foo = new Foo()
  const bar = new Foo()


  function FooComponent() {
    return (
      <Subscribe to={[foo, bar]}>
        {(fooState, barState) => {
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
  bar.increment()

  expect(wrapper.find('.fooState').text()).toEqual('1')
  expect(wrapper.find('.barState').text()).toEqual('2')
})

it('unsubscribe from all subscriptions when component unmounts', async () => {
  const foo = new Foo()

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

      if (this.state.isHidden) return null

      return (
        <Subscribe to={[foo]}>
          {(fooState) => {
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
