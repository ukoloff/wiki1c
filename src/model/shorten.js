//
// Find the shortest page ID
//
const mssql = require('mssql')
const sql = require('../sql')

module.exports = shorten

async function shorten(id) {
  let lo = 2, hi = id.length
  while (lo < hi) {
    let mid = Math.floor((lo + hi) / 2)
    let z = await count(id, mid)
    if (z > 1) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }
  return lo
}

async function count(id, len) {
  let h = await sql()
  let r = await h.request()
  .input('id', mssql.Binary, id.slice(0, len))
  .input('len', mssql.Int, len)
  .query(`
    with ${sql.pages}
    select
      count(*) as n
    from
      pages
    where substring(id, 1, @len) = @id
    `)
  return r.recordset[0].n
}
