//
// Make async iterator from SQL stream
//

async function* feed(request) {
  var done = false
  var error = false
  var reason
  var consumers = []
  var rows = []

  request
    .on('row', row)
    .on('done', finish)
    .on('error', croak)
    .stream = true

  while (!done) {
    if (rows.length) {
      yield rows.shift()
      continue
    }
    if (error) {
      yield new Promise.reject(reason)
      break
    }
    yield new Promise(...args => consumers.push(args))
  }

  function row(row) {
    if (consumers.length) {
      consumers.shift()[0](row)
      return
    }
    rows.push(row)
  }

  function finish() {
    done = true
    for (let z of consumers) z[0]()
  }

  function croak(err) {
    error = true
    reason = err
    for (let z of consumers) z[1](err)
  }
}
