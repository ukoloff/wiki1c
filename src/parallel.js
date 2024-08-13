const sql = require('./sql')

module.exports = main

async function main() {
  var q = await sql()
  var page = q.request().query('Select Top 1 * From _Reference9221')
  var file = q.request().query('Select Top 1 * From _Reference9222')
  var space = q.request().query(`
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

  $N = 0
  function out(data) {
    console.log(data)
    $N++
    if ($N == 3) q.close()
  }
  page.then(out)
  file.then(out)
  space.then(out)

  // page = await page
  // console.log(page)

  // file = await file
  // console.log(file)

  // space = await space
  // console.log(space)
  // [page, file, space] = await Promise.all([page, file, space])
  // console.log(file)
  // console.log(space)
  //   await q.close()
}
