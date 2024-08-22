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
    .then(dispatch.tree)
    .catch(e => ({
      error: e.name,
      message: e.message
    }))
    .then(JSON.stringify)
    .then(json => res.end(json))
}

function read(stream) {
  return new Promise(resolve => {
    var body = ''
    stream.on('data', chunk => body += chunk)
    stream.on('end', _ => resolve(body))
  })
}
