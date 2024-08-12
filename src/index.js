const mssql = require('mssql')
const sql = require('./sql')
const md = require('./md')

main()

async function main() {
  const q = await sql()
  var r = await q.request().query(`
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
        Top 1 id, md
    From
        pages
    Where
        title Like '%ssd'
    `)
  var a = await q.request()
    .input('pid', mssql.Binary, r.recordset[0].id)
    .query(`
    with attachments as(
        select
            _IDRRef as id,
            _Description as basename,
            _Fld9235RRef as page_id,
            DATEADD(YYYY, -2000, _Fld9237) as mdate,
            DATEADD(YYYY, -2000, _Fld9238) as cdate,
            _Fld9245 as filepath,
            _Fld9246 as bytes,
            _Fld9247 as ext
        from
            _Reference9222
    )
    select
        basename, ext, bytes, filepath
    from
        attachments
    where
        page_id = @pid
    `)
  await q.close()

  var html = md(r.recordset[0].md)
  console.log(html)
  console.log(a.recordset)
}
