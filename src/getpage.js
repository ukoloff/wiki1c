//
// Search for KB Page by hexadecimal id
//
const sql = require('./sql')

module.exports = find

async function find(id) {
  var h = await sql()

  var r = await h.request().query(`
    with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
    select
      *,
      (select count(*) from pagez X where X.up=Z.id) as ccount
    from pagez Z
    where id=0x${id}
    `)
  return r.recordset[0]
}
