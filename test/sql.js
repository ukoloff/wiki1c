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
    with pages as(${sql.pages})
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
    with attachments as(${sql.attachments})
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
      with spaces as(${sql.spaces})
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
