//
// View all pages as tree
//
const html = require('./h')
const sql = require('./sql')
const head = require('./head')

module.exports = tree

function tree(req, res) {
  head(res, 'Навигация')

  head.tail(res)
}
