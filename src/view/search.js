//
// Search page
//
const html = require('./h')
const layout = require('./layout')
const bcz = require('./breadcz')
const model = require('../model/search')

module.exports = search

async function search($) {
  let res = $.res
  let q = new URL($.req.url, 'http://none').searchParams.get('q') || ''

  const $where = model.prepare(q)

  await bcz.open($)
  await bcz.item($, 'Поиск', true)
  await bcz.close($)

  res.write(`
    <form>
    <input type="search"${$where ? '' : 'autofocus'} required name="q" value="${html(q)}" />
    <input type="submit" value=" Поиск " />
    </form>
    `
    .trim())

  if ($where)
    await render($, await model.feed($, $where))
  else
    res.write(`
    <p>
    <div class="alert alert-info fade show" role="alert">
    <i class="fa fa-warning fa-lg text-warning" aria-hidden="true"></i>
    Поиск идёт по словам. Служебные символы игнорируются
    </div>
`
      .trim())
}

async function render($, iterator) {
  let res = $.res
  res.write('<ul class="list-group">')
  $N = 0;
  for await (let row of iterator) {
    $N++
    res.write(`<li class="list-group-item"><a href="${$.base}${row.id.toString('hex')}/">${html(row.title)}</a></li>\n`)
  }
  if (!$N)
    res.write('<li class="list-group-item"><i>Ничего не найдено</i></li>')
  res.write('</ul>')
}
