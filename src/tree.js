//
// View all pages as tree
//
const html = require('./h')
const sql = require('./sql')
const head = require('./head')
const sql2it = require('./sql2it')

module.exports = tree

async function tree(req, res) {
  var h = await sql()
  var q = h.request()
  q.query(`
      with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
      select
          id, up,
          iif(md is null, 0, 1) as leaf,
          title
      from
          pagez
      order by
          leaf,
          title
    `)

  var idx = {}
  var rows = []
  for await (let row of sql2it(q)) {
    idx[row.id = row.id.toString('hex')] = row
    row.c = []
    rows.push(row)
  }
  var root = { c: [] }
  for (var row of rows) {
    (idx[row.up = row.up.toString('hex')] || root).c.push(row)
  }

  function render(rows, level = 1) {
    if (!rows.length) return
    res.write('<ul class="list-group">')
    for (var row of rows) {
      if (row.leaf) {
        res.write(`<li class="list-group-item" title="${html(row.title)}"><a href="../${row.id}/" target="KB">${html(row.title)}</a></li>`)
        continue
      }
      res.write(`<details name="$${level}">\n<summary title="${html(row.title)}">${html(row.title)}</summary>\n`)
      if (row.c.length) {
        res.write(`<div style="margin-left: 1em;">`)
        render(row.c, level + 1)
        res.write(`</div>`)
      }
      res.write('</details>')
    }
    res.write('</ul>')
  }

  head(res, 'Навигация')

  res.write(`<div style="position: fixed; left: 0; top: 0; width: 21%; bottom: 0; overflow: auto; white-space: nowrap;">`)
  render(root.c)
  res.write(`</div>`)

  head.tail(res)
}
