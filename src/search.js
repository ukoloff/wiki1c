//
// Search page
//
const url = require('node:url')
const qs = require('node:querystring')
const html = require('./h')
const sql = require('./sql')

module.exports = search

const
  columns = 'title:lat:md'.split(':')

async function search(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`<!DOCTYPE html><html><head><title>Поиск</title></head><body>`)

  var q = qs.decode(url.parse(req.url).query).q || ''

  res.write(`
    <form>
    <div>
    <input type="search" required name="q" value="${html(q)}"/>
    <input type="submit" value=" Поиск " />
    <a href="..">В начало</a>
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
    res.write('<p><small>&raquo; Поиск идёт по словам. Служебные символы игнорируются</small></p>')

  res.end(`</body></html>`)
}

async function render(res, $where) {
  var h = await sql()

  await new Promise(run)

  function run(resolve, reject) {
    res.write('<ul>')
    $N = 0;
    var q = h.request()
    q.stream = true
    q
      .on('row', row => {
        $N++
        res.write(`<li><a href=../${row.id.toString('hex')}/>${html(row.title)}</a></li>\n`)
      })
      .on('done', _ => {
        if (!$N) res.write('<li><i>Ничего не найдено</i></li>')
        res.write('</ul>')
        resolve()
      })
      .on('error', reject)
      .query(`
        with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
        select id, title
        from pagez
        where ${$where}
        order by title
        `)
  }
}
