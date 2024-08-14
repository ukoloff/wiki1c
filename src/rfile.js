//
// Render KB attachment
//
const sql = require('./sql')

module.exports = render

async function render(res, page, name) {
  res.setHeader('Content-Type', 'application/binary')

  res.end()
}

