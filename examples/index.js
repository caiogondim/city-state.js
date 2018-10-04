const React = require('react')
const ReactDOM = require('react-dom')
const { interval } = require('rxjs')
const { Subscribe, subscribable, devtool } = require('../lib')

@subscribable
class Counter {
  increment () {
    this._state.count += 1
  }

  decrement () {
    this._state.count -= 1
  }
}
const counter = new Counter({ state: { count: 0 } })

function CounterView () {
  return (
    <Subscribe to={[counter]}>
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
  constructor () {
    super()
    this.interval1 = interval(2000)
    this.interval2 = interval(1000)
    devtool(this.interval1, { name: 'interval1' })
    devtool(this.interval2, { name: 'interval2' })
  }

  render () {
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

function Main () {
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
