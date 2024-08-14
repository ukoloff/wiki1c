//
// Render KB page
//
const sql = require('./sql')

module.exports = render

async function render(res, page) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  res.end('PAGE')
}

