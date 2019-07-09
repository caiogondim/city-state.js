const React = require('react')
const ReactDOM = require('react-dom')
const { interval, from } = require('rxjs')
const redux = require('redux')
const msleep = require('async-msleep')
const { Subscribe, subscribable, devtool } = require('../src')

//
// city-state
//

@subscribable
class Counter {
  constructor () {
    this.count = 0
  }

  increment () {
    this.count += 1
  }

  decrement () {
    this.count -= 1
  }
}
const counter = new Counter()
try {
  devtool(counter, { name: 'Counter' })
} catch (_) {}

function CounterView () {
  return (
    <Subscribe to={[counter]}>
      {() => {
        return (
          <div>
            <h1>Counter</h1>
            <p>state: {counter.count}</p>
            <button onClick={() => counter.increment()}>Increment +</button><br />
            <button onClick={() => counter.decrement()}>Decrement -</button><br />
          </div>
        )
      }}
    </Subscribe>
  )
}

//
// city-state async
//

@subscribable
class CounterAsync {
  constructor () {
    this.count = 0
    this.isComputing = false
  }

  async increment () {
    this.isComputing = true
    await msleep(1000)
    this.count += 1
    this.isComputing = false
  }

  async decrement () {
    this.isComputing = true
    await msleep(1000)
    this.count -= 1
    this.isComputing = false
  }
}
const counterAsync = new CounterAsync()
try {
  devtool(counterAsync, { name: 'CounterAsync' })
} catch (_) {}

function CounterAsyncView () {
  return (
    <Subscribe to={[counterAsync]}>
      {(counterAsync) => {
        return (
          <div>
            <h1>Counter Async</h1>
            <p>state: {counterAsync.isComputing ? '...' : counterAsync.count}</p>
            <button disabled={counterAsync.isComputing} onClick={() => counterAsync.increment()}>Increment +</button><br />
            <button disabled={counterAsync.isComputing} onClick={() => counterAsync.decrement()}>Decrement -</button><br />
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
// Native Observable
//

let ObservableCounterView = null
// RxJS is throwing an error on Safari
try {
  const counter2 = new Counter()
  const observableCounter = from(counter2)
  ObservableCounterView = () => {
    return (
      <Subscribe to={[observableCounter]}>
        {(counterState = {}) => {
          return (
            <div>
              <h1>Counter Observable</h1>
              <p>state: {counterState.count}</p>
              <button onClick={() => counter2.increment()}>Increment +</button><br />
              <button onClick={() => counter2.decrement()}>Decrement -</button><br />
            </div>
          )
        }}
      </Subscribe>
    )
  }
} catch (error) {
  ObservableCounterView = () => null
}

//
// rxjs
//

class TimerView extends React.Component {
  constructor () {
    super()
    this.interval1 = interval(2000)
    this.interval2 = interval(1000)
    try {
      devtool(this.interval1, { name: 'interval1' })
      devtool(this.interval2, { name: 'interval2' })
    } catch (_) {}
  }

  // RxJS is throwing an error on Safari
  componentDidCatch () {
    return null
  }

  render () {
    return (
      <Subscribe to={[this.interval1, this.interval2]}>
        {(time1, time2) => {
          return (
            <div>
              <h1>rxjs</h1>
              <p>time1: {time1 || 0}</p>
              <p>time2: {time2 || 0}</p>
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
      <CounterAsyncView />
      <CounterReduxView />
      <ObservableCounterView />
      <TimerView />
    </div>
  )
}

const $container = document.createElement('div')
document.body.appendChild($container)
ReactDOM.render(<Main />, $container)
