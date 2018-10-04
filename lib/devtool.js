module.exports = function devtool (observable, opts = {}) {
  const extension =
    window.__REDUX_DEVTOOLS_EXTENSION__ ||
    window.top.__REDUX_DEVTOOLS_EXTENSION__
  const connection = extension.connect(opts)
  connection.init('')
  observable.subscribe({
    next: val => {
      if (typeof val !== 'object') {
        val = { value: val }
      }
      connection.send('observable', val)
    }
  })
}
