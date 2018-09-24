const subscribable = require('./lib/subscribable')

class Car {
  constructor({ model } = {}) {
    console.log('model constr', model)
    this.model = model
  }

  start() {
    this._interval = setInterval(() => {
      this._state.x += 10
    }, 1000)
  }

  stop() {
    clearInterval(this._interval)
  }
}

const SubscribableCar = subscribable(Car)

const car = new SubscribableCar({
  state: { x: 0, y: 0 },
  model: 'XPTO'
})
car.subscribe(() => {
  console.log('current x', car.state.x)
})
car.start()

console.log('model', car.model)

car.state.x = 25 // Throws error
