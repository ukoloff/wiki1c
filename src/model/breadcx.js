//
// Iterator for page's breadcrumbs
//
const mssql = require('mssql')
const sql = require('../sql')
const sql2it = require('../util/sql2it')

module.exports = breadcx

async function breadcx(page) {
  var h = await sql()
  q = h.request()
  q
    .input('pid', mssql.Binary, page.id)
    .query(`
      with ${sql.pages},
      tower as (
          select
              id,
              up,
              0 as lvl,
              title
          from
              pages
          where
              id = @pid
          union all
          select
              P.id,
              P.up,
              lvl + 1,
              P.title
          from
              pages P
              join tower on P.id = tower.up
      )
      select
          id, title, lvl
      from
          tower
      order by
          lvl desc
    `)
  return sql2it(q)
}
