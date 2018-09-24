# city-state.js

## Installation

```bash
npm install --save city-state
```

## Usage

### `<Subscribe>` component

### `@subscribable`

### `devtool()`

## Motivation

While using Redux on the multimedia player on The New York Times, I felt I ended
up with 2 kind of APIs:
- One through methods, e.g: `player.play()`
- Another with Redux, e.g: `store.dispatch(actions.shouldPlay())`

Encapsulation
- State is changed only by public methods (interface)
- AKA message pass
Reactivity
Refactoring without breaking
Redux devtool is too good to give up
