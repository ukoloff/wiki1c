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
