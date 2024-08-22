//
// API entry point
//
module.exports = api

async function api(res) {
  res.setHeader('Content-Type', 'application/json')
  res.end('{"answer":42}')
}
