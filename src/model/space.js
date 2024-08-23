//
// Get Space name
//
const sql = require('../sql')

module.exports = space

async function space() {
  var h = await sql()
  var r = await h.request()
   .query(`
      with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
      select
        top(1) S.name
      from
        pagez Z
        join spaces S on Z.space_id = S.id
      `)
  return r.recordset[0].name
}
