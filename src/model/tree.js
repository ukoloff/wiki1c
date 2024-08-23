//
// Build tree of pages
//
const sql = require('../sql')
const decyfer = require('./decyfer')

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
    row.title = decyfer(row.title)
    idx[row.id = row.id.toString('hex')] = row
    row.c = []
  }
  var root = {
    count: r.length,
    c: []
  }
  for (var row of r) {
    (idx[row.up = row.up.toString('hex')] || root).c.push(row)
  }

  return root
}
