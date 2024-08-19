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
          title,
          (
              select
                  count(*)
              from
                  pagez X
              where
                  X.up = Z.id
          ) as n
      from
          pagez Z
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
  var root = {c: []}
  for (var row of r) {
    (idx[row.up] || root).c.push(row)
  }

  head(res, 'Навигация')

  head.tail(res)
}
