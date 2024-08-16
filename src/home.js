const sql = require('./sql')
const html = require('./h')
const head = require('./head')

module.exports = home

async function home(req, res) {
  head(res, 'База Знаний')
  res.write('<div class="breadcrumbs"><a href="q/">Поиск</a></div><ul>\n')

  var h = await sql()

  var q = h.request()
  q.stream = true
  q
    .on('row', row => {
      res.write(`<li><a href=${row.id.toString('hex')}/>${html(row.title)}</a>\n`)
    })
    .on('done', _ => {
      res.write('</ul>')
      head.tail(res)
    })
  q.query(`
    with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
    select
      id, title
    from pagez
    where up=0x00
    order by title
    `)
}
