//
// Replace links to attachments with spaces
//
const mssql = require('mssql')
const sql = require('../sql')
const sql2it = require('../util/sql2it')

module.exports = unspace

async function unspace(page) {
  if (!page.md)
    return ''
  var h = await sql()
  var q = h.request()
  q.arrayRowMode = true
  q
    .input('pid', mssql.Binary, page.id)
    .query(`
      with ${sql.attachments}
      select
        concat(basename, iif(ext = '', '', '.'), ext) as name
      from
        attachments
      WHERE
        page_id = @pid
        and basename like '% %'
      `)
    .arrayRowMode = true
  let md = page.md
  for await(let [f] of sql2it(q)) {
    md = md
      .replaceAll(`](${f})`, `](<${f}>)`)
      .replaceAll(`](/${f})`, `](<${f}>)`)
  }
  return md
}
