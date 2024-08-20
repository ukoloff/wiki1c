//
// Page not found
//
const layout = require('./layout')
const html = require('./h')

module.exports = oops

function oops(res) {
  layout(res, 'Страница не найдена', contents)
}

function contents(res) {
  res.write(`
    <h2>
    Страница ${html((res.$base + res.req.url).replace(/\/{2,}/, '/'))} не найдена на сервере!
    </h2>
    <div class="text-center">
    <a class="btn btn-info" href="${res.$base}">Домой</a>
    </div>
    `
  .trim())
}
