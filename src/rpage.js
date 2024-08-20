//
// Render KB page
//
const mssql = require('mssql')
const sql = require('./sql')
const html = require('./h')
const md = require('./md')
const layout = require('./layout')

module.exports = render

async function render(res, page) {
  layout(res, page.title, content)

  async function content() {
    if (page.md)
      res.write(md(await fixURLs(page)))
  }
}

async function renderChildren(res, page) {
  var h = await sql()
  var q = h.request()
  q
    .input('pid', mssql.Binary, page.id)
    .query(`
      with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
        select id, title
        from pagez
        where up = @pid
        order by title
      `)

  res.write('<ul class="list-group">')
  for await (let row of sql2it(q)) {
    res.write(`<li class="list-group-item"><a href=${res.$base}${row.id.toString('hex')}/>${html(row.title)}</a></li>\n`)
  }
  res.write('</ul>')
}

async function breadcrumbs(res, page) {

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

  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write(`<li class="breadcrumb-item"><a href="${res.$base}">${r.recordset[0].name}</a></li>\n`)

  q = h.request()
  q
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

  for await (var row of sql2it(q)) {
    res.write(`<li class="breadcrumb-item"><a href="${res.$base}${row.id.toString('hex')}/">${html(row.title)}</a></li>\n`)
  }

  res.write(`<li class="breadcrumb-item active"><u>${page.title}</u>
    <a href="${res.$base}q/" title="Поиск по всей Базе Знаний" class="badge text-bg-info">?</a></li></ol></nav>`)
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
  r.recordset.map(x => x[0]).forEach(f => {
    md = md
      .replaceAll(`](${f})`, `](<${f}>)`)
      .replaceAll(`](/${f})`, `](<${f}>)`)
  })
  return md
}
