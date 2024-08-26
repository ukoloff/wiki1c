//
// Find KB attachment
//
const mssql = require('mssql')
const sql = require('../sql')

module.exports = find

async function find($, name) {
  $m = /^(.*?)(?:[.]([^.]*))?$/.exec(name)

  const h = await sql()
  var r = await h.request()
    .input('pid', mssql.Binary, $.page.id)
    .input('base', mssql.NVarChar, $m[1])
    .input('ext', mssql.NVarChar, $m[2] || '')
    .query(`
      with ${sql.attachments}
      select *
      from attachments
      where
        page_id = @pid
        and basename = @base
        and ext = @ext
    `)
  return r.recordset[0]
}
