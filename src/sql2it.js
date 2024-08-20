//
// Make async iterator from SQL stream
//

async function* feed(request) {
  let cb, data

  request
    .on('row', row)
    .on('done', finish)
    .on('error', croak)
    .stream = true

  while (true) {
    var status = await new Promise(resolve => cb = resolve)
    if (!status) break
    yield status > 0 ? data : Promise.reject(data)
  }

  function row(row) {
    data = row
    cb(1)
  }

  function finish() {
    cb(0)
  }

  function croak(err) {
    data = err
    cb(-1)
  }
}
