import React from 'react'
import ReactDOM from 'react-dom'
import withSubscribe from 'with-subscribe'
import { Observable, interval } from 'rxjs'
import $$observable from 'symbol-observable'

class Subscribe extends React.Component {
  constructor() {
    super()
    this.state = {
      last: []
    }
  }

  componentDidMount() {
    this.props.to.forEach((observable, index) => {
      observable[$$observable]().subscribe({
        next: val => {
          let last
          if (this.state.last.length === 0) {
            last = new Array(this.props.to.length)
            last[index] = val
          } else {
            last = [ ...this.state.last ].map((item, index_) => {
              if (index_ === index) {
                return val
              }
              return item
            })
          }

          this.setState({
            last
          })
        }
      })
    })
  }

  render() {
    return (
      <div>
        {this.props.children(...this.state.last)}
      </div>
    )
  }
}

//
// Models
//

class Counter {
  constructor() {
    state = withSubscribe({
      count: 0
    })
  }

  increment() {
    this.state.count += 1
  }

  decrement() {
    this.state.count -= 1
  }
}
const counter = new Counter()

//
// Views
//

function CounterView() {
  return (
    <Subscribe to={[counter.state]}>
      {(counterState = {}) => {
        return (
          <div>
            <h1>Counter</h1>
            <p>state: {counterState.count}</p>
            <button onClick={() => counter.increment()}>Increment +</button><br />
            <button onClick={() => counter.decrement()}>Decrement -</button><br />
          </div>
        )
      }}
    </Subscribe>
  )
}

class TimerView extends React.Component {
  constructor() {
    super()
    this.interval1 = interval(2000)
    this.interval2 = interval(1000)
  }

  render() {
    return (
      <Subscribe to={[this.interval1, this.interval2]}>
        {(time1, time2) => {
          return (
              <div>
                <h1>Timer</h1>
                <p>time1: {time1}</p>
                <p>time2: {time2}</p>
              </div>
            )
        }}
      </Subscribe>
    )
  }
}

function Main() {
  return (
    <div>
      <CounterView />
      <TimerView />
    </div>
  )
}

const $container = document.createElement('div')
document.body.appendChild($container)
ReactDOM.render(<Main />, $container)
