// @flow

import React from 'react'
import $$observable from 'symbol-observable'

type Props = {|
  children: (...args: mixed) => React$Element<*>,
  // flow doesn't support symbols
  to: Array<{}>
|};

type State = {|
  last: Array<mixed>
|};

export class Subscribe extends React.Component<Props, State> {
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
            last = [...this.state.last].map((item, index_) => {
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
    return <div>{this.props.children(...this.state.last)}</div>
  }
}

export function devtool(observable: any, opts: {} = {}) {
  const extension =
    window.__REDUX_DEVTOOLS_EXTENSION__ ||
    window.top.__REDUX_DEVTOOLS_EXTENSION__
  const connection = extension.connect(opts)
  connection.init('')
  observable[$$observable]().subscribe((state, action) => {
    if (typeof state !== 'object') {
      state = { value: state }
    }
    connection.send('observable', state)
  })
}
