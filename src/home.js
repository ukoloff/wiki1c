const sql = require('./sql')

module.exports = home

async function home(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write('<title>База Знаний</title><ul>')
  var h = await sql()

  var q = h.request()
  q.stream = true
  q
    .on('row', row => {
      res.write(`<li><a href=${row.id.toString('hex')}/>${row.title}</a>`)
    })
    .on('done', _ => {
      res.end('</ul>')
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
