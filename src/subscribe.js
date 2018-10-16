const React = require('react')
const $$observable = require('symbol-observable').default

class Subscribe extends React.Component {
  constructor (props) {
    super()
    this.state = {
      last: [],
      isMounted: false
    }
    this._subscriptions = []

    props.to.forEach((observable, index) => {
      const next = val => {
        let last
        if (this.state.last.length === 0) {
          last = new Array(props.to.length)
          last[index] = val
        } else {
          last = [...this.state.last].map((item, index_) => {
            if (index_ === index) {
              return val
            }
            return item
          })
        }

        if (this.state.isMounted) {
          this.setState({
            last
          })
        } else {
          this.state.last = last
        }
      }

      const subscription = observable[$$observable]().subscribe({
        next
      })

      this._subscriptions.push(subscription)
    })
  }

  componentDidMount () {
    this.setState({
      isMounted: true
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
