//
// Search for KB Page by hexadecimal id
//
const sql = require('../sql')

module.exports = find

async function find(id) {
  var h = await sql()

  var $where = ''
  var L = id.length
  if (L & 1) {
    $where = `substring(convert(nvarchar, id, 2), ${L}, 1) = '${id.slice(-1).toUpperCase()}' and `
    L--
  }
  $where += `substring(id, 1, ${L/2}) = 0x${id.slice(0, L)}`

  var r = await h.request().query(`
    with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
    select top 2
      *,
      (select count(*) from pagez X where X.up=Z.id) as ccount
    from pagez Z
    where ${$where}
    `)
  r = r.recordset
  if (r.length == 1)
    return r[0]
}
