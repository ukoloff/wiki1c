//
// API entry point
//
module.exports = api

const dispatch = {
  tree: require('./tree')
}

async function api(res) {
  res.setHeader('Content-Type', 'application/json')
  read(res.req)
    .then(JSON.parse)
    .then(data => (dispatch[data.command] || nop)(data))
    .catch(e => ({
      error: e.name,
      message: e.message
    }))
    .then(JSON.stringify)
    .then(json => res.end(json))
}

function read(stream) {
  return new Promise((resolve, reject) => {
    var body = ''
    stream
      .on('data', chunk => body += chunk)
      .on('end', _ => resolve(body))
      .on('error', reject)
  })
}

function nop(data) {
  return {
    error: 404,
    message: 'Unknown command!',
    back: data,
  }
}
