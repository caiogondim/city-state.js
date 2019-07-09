<img src="https://file-erjgqauviw.now.sh">

# city-state.js

> Observable and encapsulated state management

## Installation

```bash
npm install --save city-state
```

## Usage

### `<Subscribe>` component

Subscribes to an Observable (like a [subscribable](#subscribable)) and updates
children whenever there is a new value.

```js
//
// Model
//

import { subscribable } from 'city-state'

@subscribable
class Counter {
  constructor() {
    this.count = 0
  }

  increment() {
    this.count += 1
  }

  decrement() {
    this.count -= 1
  }
}

const counter = new Counter()

//
// View
//

import React from 'react'
import { Subscribe } from 'city-state'

export default function CounterView({ counter }) {
  <Subscribe to={[counter]}>
    {(counter) => (
      <span>Counter: {counter.count}</span>
    )}
  </Subscribe>
}
```

Redux offers an Observable API that could be used with `Subscribe`.

```js
function CounterView({ reduxStore }) {
  <Subscribe to=[reduxStore]>
    {currentState => (
      <span>Counter: {currentState.count}</span>
    )}
  </Subscribe>
}
```

For a working example, see the code on [`/examples`](/examples/index.js)

### `@subscribable`

Adds a minimal Observable interface to a class.
Whenever a property is changed on the subscribable object, all subscribers are notified.

Interface:

- `this.subscribe()`: Observable subscribe method
- `this[$$obseravble]`: Symbol.Observable interop point

```js
import { subscribable } from 'city-state';

@subscribable
class Counter {
  constructor() {
    this.count = 0
  }

  increment() {
    this.count += 1
  }

  decrement() {
    this.count -= 1
  }
}

const counter = new Counter()
counter.subscribe(() => {
  console.log(counter.count)
}) // => 0

counter.increment() // => 1
counter.increment() // => 2
counter.decrement() // => 1
```

### `devtool()`

Plot current state of a subscribable object (or any Observable) in Redux devtools.

```js
@subscribable
class Foo {}

const foo = new Foo()

devtool(foo, { name: 'foo' })
```

## Related
- [city-state-preact](https://github.com/caiogondim/city-state-preact.js)

## Sponsor

If you found this library useful and are willing to donate, transfer some
bitcoins to `1BqqKiZA8Tq43CdukdBEwCdDD42jxuX9UY`.

## Credits

- Icon by Praveen Patchu from The Noun Project
- [Redux](https://github.com/reduxjs/redux)
- [Unstated](https://github.com/jamiebuilds/unstated)

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
