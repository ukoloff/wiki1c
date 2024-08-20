//
// View all pages as tree
//
const html = require('./h')
const sql = require('./sql')

module.exports = tree

async function tree(res) {
  var h = await sql()
  var r = await h.request().query(`
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
  r = r.recordset
  var idx = {}
  for (var row of r) {
    idx[row.id = row.id.toString('hex')] = row
    row.c = []
  }
  var root = { c: [] }
  for (var row of r) {
    (idx[row.up = row.up.toString('hex')] || root).c.push(row)
  }

  function render(rows, level = 1) {
    if (!rows.length) return
    res.write('<ul class="list-group">')
    for (var row of rows) {
      if (row.leaf) {
        res.write(`<li class="list-group-item" title="${html(row.title)}"><a href="${res.$base}${row.id}/">${html(row.title)}</a></li>`)
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
  render(root.c)
}
