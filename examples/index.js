const React = require('react')
const ReactDOM = require('react-dom')
const { interval } = require('rxjs')
const redux = require('redux')
const { Subscribe, subscribable, devtool } = require('../src')

//
// city-state
//

@subscribable
class Counter {
  constructor () {
    this._state = { count: 0 }
  }

  increment () {
    this._state.count += 1
  }

  decrement () {
    this._state.count -= 1
  }
}
const counter = new Counter()

function CounterView () {
  return (
    <Subscribe to={[counter]}>
      {(counterState) => {
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

//
// redux
//

function counterReducer (state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        count: state.count - 1
      }
    default:
      return state
  }
}

const counterStore = redux.createStore(counterReducer)

function CounterReduxView () {
  return (
    <Subscribe to={[counterStore]}>
      {(counterState = {}) => {
        return (
          <div>
            <h1>Counter with redux</h1>
            <p>state: {counterState.count}</p>
            <button onClick={() => counterStore.dispatch({ type: 'INCREMENT' })}>Increment +</button><br />
            <button onClick={() => counterStore.dispatch({ type: 'DECREMENT' })}>Decrement -</button><br />
          </div>
        )
      }}
    </Subscribe>
  )
}

//
// rxjs
//

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
      <CounterReduxView />
      <TimerView />
    </div>
  )
}

const $container = document.createElement('div')
document.body.appendChild($container)
ReactDOM.render(<Main />, $container)
