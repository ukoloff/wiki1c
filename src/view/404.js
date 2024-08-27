//
// Page not found
//
const layout = require('./layout')
const html = require('./h')
const bcz = require('./breadcz')

module.exports = oops

function oops($) {
  $.res.statusCode = 404
  $.content = contents
  layout($, 'Страница не найдена')
}

async function contents($) {
  await bcz.open($)
  await bcz.item($, 'Ошибка', true)
  await bcz.close($)

  $.res.write(`
    <div class="alert alert-danger">
    Страница ${html(($.base + $.req.url).replace(/\/{2,}/, '/'))} не найдена на сервере!
    </div>
    <div class="text-center">
    <a class="btn btn-info" href="${$.base}"><i class="fa fa-home fa-lg text-dark" aria-hidden="true"></i> Домой</a>
    </div>
    `
    .trim())
}
