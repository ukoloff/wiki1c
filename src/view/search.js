//
// Search page
//
const url = require('node:url')
const qs = require('node:querystring')
const html = require('./h')
const layout = require('./layout')
const space = require('../model/space')
const model = require('../model/search')

module.exports = search

async function search(res) {
  var q = qs.decode(url.parse(res.req.url).query).q || ''

  const $where = model.prepare(q)

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
    await render(res, await model.feed($where))
  else
    res.write(`
    <p>
    <div class="alert alert-info fade show" role="alert">
    Поиск идёт по словам. Служебные символы игнорируются
    </div>
`
      .trim())
}

async function render(res, iterator) {
  res.write('<ul class="list-group">')
  $N = 0;
  for await (let row of iterator) {
    $N++
    res.write(`<li class="list-group-item"><a href="${res.$base}${row.id.toString('hex')}/">${html(row.title)}</a></li>\n`)
  }
  if (!$N)
    res.write('<li class="list-group-item"><i>Ничего не найдено</i></li>')
  res.write('</ul>')
}
