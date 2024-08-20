//
// Search page
//
const url = require('node:url')
const qs = require('node:querystring')
const html = require('./h')
const sql = require('./sql')
const head = require('./head')
const sql2it = require('./sql2it')

module.exports = search

const
  columns = 'title:lat:md'.split(':')

async function search(req, res) {
  head(res, 'Поиск')
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write(`<li class="breadcrumb-item"><a href="${res.$base}">База знаний</a></li>`)
  res.write('<li class="breadcrumb-item active">Поиск</li></ol></nav><ul>\n')

  var q = qs.decode(url.parse(req.url).query).q || ''

  res.write(`
    <form>
    <div>
    <input type="search" required name="q" value="${html(q)}"/>
    <input type="submit" value=" Поиск " />
    </div>
    </form>
    `)

  var $where = ''
  for (var m of q.matchAll(/\p{L}+/ug)) {
    var w = m[0]
    if (w.length < 2) continue
    if ($where) $where += "\nand "
    $where += '(' + columns.map(f => `${f} like '%${w}%'`).join(' or ') + ')'
  }

  if ($where)
    await render(res, $where)
  else
    res.write(`
  <p>
  <div class="alert alert-info fade show" role="alert">
  Поиск идёт по словам. Служебные символы игнорируются
  </div>
      `)
  head.tail(res)
}

async function render(res, $where) {

  var h = await sql()
  var q = h.request()
  q.query(`
      with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
      select id, title
      from pagez
      where ${$where}
      order by title
      `)

  res.write('<ul class="list-group">')
  $N = 0;
  for await (let row of sql2it(q)) {
    $N++
    res.write(`<li class="list-group-item"><a href="${res.$base}${row.id.toString('hex')}/">${html(row.title)}</a></li>\n`)
  }
  if (!$N)
    res.write('<li class="list-group-item"><i>Ничего не найдено</i></li>')
  res.write('</ul>')
}
