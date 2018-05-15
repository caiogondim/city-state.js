import React from 'react'
import ReactDOM from 'react-dom'
import withSubscribe from 'with-subscribe'
// import CityState from '../lib'

const Counter = withSubscribe(class {
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
const counter = new Counter()

class Look extends React.Component {
  componentDidMount() {
    this.props.for.forEach(observable => {
      observable.subscribe(() => this.forceUpdate())
    })
  }

  render() {
    return (
      <div>
        {this.props.children(...this.props.for)}
      </div>
    )
  }
}

function Main() {
  return (
    <Look for={[counter]}>
      {(counter) => (
        <div>
          <h1>Counter</h1>
          <p>state: {counter.count}</p>
          <button onClick={() => counter.increment()}>+</button><br />
          <button onClick={() => counter.decrement()}>-</button><br />
        </div>
      )}
    </Look>
  )
}

const $container = document.createElement('div')
document.body.appendChild($container)
ReactDOM.render(<Main />, $container)
