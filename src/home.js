const sql = require('./sql')
const html = require('./h')
const head = require('./head')
const sql2it = require('./sql2it')

module.exports = home

async function home(req, res) {
  var h = await sql()
  var q = h.request()
  q.query(`
    with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
    select
      id, title
    from pagez
    where up=0x00
    order by title
    `)

  head(res, 'База Знаний')
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write(`<li class="breadcrumb-item"><a href="${req.$base}q/">Поиск</a></li></ol></nav><ul class="list-group">\n`)

  for await (let row of sql2it(q)) {
    res.write(`<li class="list-group-item"><a href=${req.$base}${row.id.toString('hex')}/>${html(row.title)}</a>\n`)
  }

  res.write('</ul>')
  head.tail(res)
}
