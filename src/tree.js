//
// View all pages as tree
//
const html = require('./h')
const sql = require('./sql')
const head = require('./head')

module.exports = tree

async function tree(req, res) {
  var h = await sql()
  var r = await h.request().query(`
      with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
      select
          lower(convert(nvarchar, id, 2)) as id,
          lower(convert(nvarchar, up, 2)) as up,
          iif(md is null, 0, 1) as leaf,
          title
      from
          pagez
      order by
          leaf,
          title
    `)
  r = r.recordset
  var idx = {}
  for (var row of r) {
    idx[row.id] = row
    row.c = []
  }
  var root = { c: [] }
  for (var row of r) {
    (idx[row.up] || root).c.push(row)
  }

  function render(rows) {
    if (!rows.length) return
    res.write('<ul class="list-group">')
    for (var row of rows) {
      if (row.leaf) {
        res.write(`<li class="list-group-item"><a href="../${row.id}/" target="KB">${html(row.title)}</a></li>`)
        continue
      }
      res.write(`<details>\n<summary>${html(row.title)}</summary>\n`)
      if (row.c.length) {
        res.write(`<div style="margin-left: 1em;">`)
        render(row.c)
        res.write(`</div>`)
      }
      res.write('</details>')
    }
    res.write('</ul>')
  }

  head(res, 'Навигация')

  render(root.c)

  head.tail(res)
}
