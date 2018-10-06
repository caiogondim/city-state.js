const React = require('react')
const $$observable = require('symbol-observable').default

class Subscribe extends React.Component {
  constructor () {
    super()
    this.state = {
      last: []
    }
    this._subscriptions = []
  }

  componentDidMount () {
    this.props.to.forEach((observable, index) => {
      let subscription
      const next = val => {
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

      if (typeof observable[$$observable] === 'function') {
        subscription = observable[$$observable]().subscribe({
          next
        })
      } else {
        subscription = observable.subscribe(next)
      }

      this._subscriptions.push(subscription)
    })
  }

  componentWillUnmount() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe())
    this._subscriptions = []
  }

  render () {
    return (
      <div style={this.props.style} className={this.props.className}>
        {this.props.children(...this.state.last)}
      </div>
    )
  }
}

module.exports = Subscribe
