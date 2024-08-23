//
// Search page
//
const url = require('node:url')
const qs = require('node:querystring')
const html = require('./view/h')
const sql = require('./sql')
const sql2it = require('./sql2it')
const layout = require('./layout')
const space = require('./model/space')

module.exports = search

const
  columns = 'title:lat:md'.split(':')

async function search(res) {
  var q = qs.decode(url.parse(res.req.url).query).q || ''

  var $where = ''
  for (var m of q.matchAll(/[\p{L}\d]+/ug)) {
    var w = m[0]
    if (w.length < 2) continue
    if ($where) $where += "\nand "
    $where += '(' + columns.map(f => `${f} like '%${w}%'`).join(' or ') + ')'
  }

  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write(`<li class="breadcrumb-item"><a href="${res.$base}">${html(await space())}</a></li>`)
  res.write('<li class="breadcrumb-item active">Поиск</li></ol></nav><ul>\n')

  res.write(`
    <form>
    <input type="search"${$where ? '' : 'autofocus'} required name="q" value="${html(q)}" />
    <input type="submit" value=" Поиск " />
    </form>
    `
    .trim())

  if ($where)
    await render(res, $where)
  else
    res.write(`
    <p>
    <div class="alert alert-info fade show" role="alert">
    Поиск идёт по словам. Служебные символы игнорируются
    </div>
`
      .trim())
}

async function render(res, $where) {
  var h = await sql()
  var q = h.request()
  q.query(`
      with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
      select id, title
      from pagez
      where ${$where}
        and md is not null
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
