//
// Render KB page
//
const mssql = require('mssql')
const sql = require('./sql')
const html = require('./h')
const head = require('./head')
const md = require('./md')

module.exports = render

async function render(res, page) {
  head(res, page.title)

  await breadcrumbs(res, page)

  if (page.ccount) {
    await renderChildren(res, page)
    if (page.md) res.write('<hr>')
  }

  if (page.md) res.write(md(await fixURLs(page)))

  head.tail(res)
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
        res.write(`<li><a href=../${row.id.toString('hex')}/>${html(row.title)}</a></li>\n`)
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
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')

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
  res.write(`<li class="breadcrumb-item"><a href="..">${r.recordset[0].name}</a></li>\n`)

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
    res.write(`<li class="breadcrumb-item"><a href="../${row.id.toString('hex')}/">${html(row.title)}</a></li>\n`)
  }

  res.write(`<li class="breadcrumb-item active"><u>${page.title}</u>
    [<a href="../q/" title="Поиск">?</a>]</li></ol></nav>`)
}

async function fixURLs(page) {
  var h = await sql()
  var q = await h.request()
  q.arrayRowMode = true
  var r = await q
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
  var md = page.md
  r.recordset.map( x => x[0]).forEach(f =>{
    md = md.replaceAll(`](${f})`, `](<${f}>)`)
  })
  return md
}
