//
// Page not found
//
const layout = require('./layout')
const html = require('./h')
const bcz = require('./breadcz')

module.exports = oops

function oops(res) {
  res.statusCode = 404
  layout(res, 'Страница не найдена', contents)
}

async function contents(res) {
  await bcz.open(res)
  await bcz.item(res, 'Ошибка', true)
  await bcz.close(res)

  res.write(`
    <div class="alert alert-danger">
    Страница ${html((res.$base + res.req.url).replace(/\/{2,}/, '/'))} не найдена на сервере!
    </div>
    <div class="text-center">
    <a class="btn btn-info" href="${res.$base}"><i class="fa fa-home fa-lg text-dark" aria-hidden="true"></i> Домой</a>
    </div>
    `
    .trim())
}
