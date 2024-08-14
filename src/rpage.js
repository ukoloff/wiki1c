//
// Render KB page
//
const mssql = require('mssql')
const sql = require('./sql')
const html = require('./h')
const md = require('./md')

module.exports = render

async function render(res, page) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`<title>${page.title}</title>`)

  await breadcrumbs(res, page)

  if (page.ccount) {
    await renderChildren(res, page)
    if (page.md) res.write('<hr>')
  }

  res.end(page.md ? md(page.md) : null)
}

async function renderChildren(res, page) {
  var h = await sql()

  await new Promise(run)

  function run(resolve, reject) {
    res.write('<ul>')
    var q = h.request()
    q.stream = true
    q
      .on('row', row => {
        res.write(`<li><a href=../${row.id.toString('hex')}/>${html(row.title)}</a>`)
      })
      .on('done', _ => {
        res.write('</ul>')
        resolve()
      })
      .on('error', reject)
      .input('pid', mssql.Binary, page.id)
      .query(`
        with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
          select id, title
          from pagez
          where up = @pid
          order by title
        `)
  }
}

async function breadcrumbs(res, page) {
  res.write('<div class="breadcrumbs">')

  var h = await sql()
  var r = await h.request()
    .input('pid', mssql.Binary, page.id)
    .query(`
      with ${sql.pages}, ${sql.spaces}
      select
        S.name
      from
        pages P join spaces S on P.space_id = S.id
      where
        P.id = @pid
      `)
  res.write(`<a href="..">${r.recordset[0].name}</a> &raquo; `)

  r = await h.request()
  .input('pid', mssql.Binary, page.id)
  .query(`
      with ${sql.pages},
      tower as (
          select
              id,
              up,
              0 as lvl,
              title
          from
              pages
          where
              id = @pid
          union all
          select
              P.id,
              P.up,
              lvl + 1,
              P.title
          from
              pages P
              join tower on P.id = tower.up
      )
      select
          id, title
      from
          tower
      where
          lvl > 0
      order by
          lvl desc

    `)
  for (var row of r.recordset) {
    res.write(`<a href="../${row.id.toString('hex')}/">${ html(row.title) }</a> &raquo; `)
  }

  res.write(`<u>${page.title}</u></div>\n`)
}
