const test = require('node:test')
const sql = require('../src/sql')

test('Connect to MS SQL', async function (t) {
  var q = await sql()

  await q.query`Select Top 10 * from conv..Config`
  await q.close()
})

test('List articles', async function (t) {
  var q = await sql()

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
    `)
  await q.close()
})

test('List attachments', async function (t) {
  var q = await sql()

  var r = await q.request().query(`
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
    `)
  await q.close()
})


test('List spaces', async function (t) {
  var q = await sql()

  var r = await q.request().query(`
      with spaces as(
          select
              _IDRRef as id,
              _ParentIDRRef as up,
              _Code as kod,
              _Description as name,
              _Fld10772 as handle
          from
              _Reference174
      )
      select
          *
      from
          spaces as S
      where
          up in (
              select
                  id
              from
                  spaces
              where
                  handle = 'baza-znaniy'
          )
    `)
  await q.close()
})
