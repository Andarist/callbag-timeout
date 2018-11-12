# callbag-timeout

Callbag operator which errors if source does not emit before specified duration.

## Example

```js
import concatMap from 'callbag-concat-map'
import of from 'callbag-of'
import pipe from 'callbag-pipe'
import subscribe from 'callbag-subscribe'
import timeout from 'callbag-timeout'
import timer from 'callbag-timer'

// fake request
const makeRequest = ms =>
  pipe(
    timer(ms),
    map(() => 'Request completed.'),
  )

pipe(
  of(2000, 3000, 4000),
  concatMap(ms =>
    pipe(
      makeRequest(ms),
      timeout(3500),
    ),
  ),
  subscribe({
    next(val) {
      // will log 'Request completed.' twice
      console.log(val)
    },
    error(err) {
      // will be called for the 3rd (timed out) request
    },
  }),
)
```
