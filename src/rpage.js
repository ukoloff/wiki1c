//
// Render KB page
//
const mssql = require('mssql')
const sql = require('./sql')
const html = require('./h')
const md = require('./md')
const layout = require('./layout')
const space = require('./space')
const sql2it = require('./sql2it')

module.exports = render

async function render(res, page) {
  layout(res, page.title, content)

  async function content() {
    await breadcrumbs(res, page)
    if (page.md)
      res.write(md(await fixURLs(page)))
  }
}

async function breadcrumbs(res, page) {
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write(`<li class="breadcrumb-item"><a href="${res.$base}">${await space()}</a></li>\n`)

  var h = await sql()
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
      order by
          lvl desc
    `)

  for await (var row of sql2it(q)) {
    res.write(`<li class="breadcrumb-item">${html(row.title)}</li>\n`)
  }
  res.write(`</ol></nav>`)
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
