const sql = require('./sql')
const html = require('./h')
const head = require('./head')

module.exports = home

async function home(req, res) {
  head(res, 'База Знаний')
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write('<li class="breadcrumb-item"><a href="q/">Поиск</a></li></ol></nav><ul class="list-group">\n')

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
  q.stream = true
  q
    .on('row', row => {
      res.write(`<li class="list-group-item"><a href=${row.id.toString('hex')}/>${html(row.title)}</a>\n`)
    })
    .on('done', _ => {
      res.write('</ul>')
      head.tail(res)
    })
}
