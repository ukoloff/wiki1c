const md = require('markdown-it')
const mdc = require('markdown-it-container')
const sql = require('./sql')

main()

async function main() {
  const q = await sql()
  var r = await q.query`Select Top 1 _Fld9228 as md From _Reference9221 Where _Description Like '%ssd'`
  await q.close()

  var mdx = md({
    html: true,
    linkify: true,
    typographer: true,
  })
  var html = mdx.render(r.recordset[0].md)
  console.log(html)
}
