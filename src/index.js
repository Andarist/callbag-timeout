export default function timeout(delay) {
  return source => (start, sink) => {
    if (start !== 0) return

    const absoluteDelay = delay instanceof Date
    let talkback
    let timerId

    function scheduleTimeout(ms) {
      timerId = setTimeout(() => {
        talkback(2)
        const err = new Error('Timeout.')
        err.code = 'TIMEOUT'
        sink(2, err)
      }, ms)
    }

    source(0, (type, data) => {
      if (type === 0) {
        talkback = data

        scheduleTimeout(absoluteDelay ? delay - Date.now() : delay)

        sink((type, data) => {
          if (type === 2) {
            clearTimeout(timerId)
          }
          talkback(type, data)
        })
        return
      }

      if (type === 2) {
        clearTimeout(timerId)
      } else if (type === 1 && !absoluteDelay) {
        clearTimeout(timerId)
        scheduleTimeout(delay)
      }
      sink(type, data)
    })
  }
}
