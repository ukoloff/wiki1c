//
// View all pages as tree
//
const html = require('./h')
const root = require('../model/tree')

module.exports = tree

async function tree($) {
  let r = await root($)

  function render(rows, level = 1) {
    if (!rows.length) return
    for (var row of rows) {
      if (row.leaf) {
        res.write(`<div title="${html(row.title)}"><a href="${res.$base}${row.id}/">${html(row.title)}</a></div>\n`)
        continue
      }
      res.write(`<details name="$${level}" id=":${row.id}"><summary title="${html(row.title)}">${html(row.title)}</summary>\n`)
      if (row.c.length) {
        res.write(`<div>`)
        render(row.c, level + 1)
        res.write(`</div>`)
      }
      res.write('</details>\n')
    }
  }
  render(r.c)
}
