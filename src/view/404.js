//
// Page not found
//
const layout = require('./layout')
const html = require('./h')
const space = require('../model/space')

module.exports = oops

function oops(res) {
  res.statusCode = 404
  layout(res, 'Страница не найдена', contents)
}

async function contents(res) {
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write(`<li class="breadcrumb-item"><a href="${res.$base}">${html(await space())}</a></li>`)
  res.write('<li class="breadcrumb-item active">Ошибка</li></ol></nav><ul>\n')

  res.write(`
    <div class="alert alert-danger">
    Страница ${html((res.$base + res.req.url).replace(/\/{2,}/, '/'))} не найдена на сервере!
    </div>
    <div class="text-center">
    <a class="btn btn-info" href="${res.$base}">Домой</a>
    </div>
    `
  .trim())
}
