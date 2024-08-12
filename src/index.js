const md = require('markdown-it')
const mdc = require('markdown-it-container')
const sql = require('./sql')

main()

async function main() {
  const q = await sql()
  var r = await q.query`
    with pages as(
        select
            _IDRRef as id,
            _ParentIDRRef as up,
            _Code as kod,
            _Description as title,
            DATEADD(YYYY, -2000, _Fld9226) as mdate,
            _Fld9227RRef as space_id,
            _Fld9306 as lat,
            _Fld9228 as md
        from
            _Reference9221
    )
    Select
        Top 1 md
    From
        pages
    Where
        title Like '%ssd'
    `
  await q.close()

  var mdx = md({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(mdc, 'info', { marker: '!' })

  var html = mdx.render(r.recordset[0].md)
  console.log(html)
}
