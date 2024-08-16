//
// Page not found
//
module.exports = oops
const head = require('./head')

function oops(req, res) {
  res.statusCode = 404
  head(res, 'Ошибка')
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write('<li class="breadcrumb-item"><a href="../">База знаний</a></li>')
  res.write('<li class="breadcrumb-item active">404</li></ol></nav><ul>\n')

  res.write(`
  <div class="alert alert-danger fade show" role="alert">
  Указанный путь не найден на сервере.
  </div>
    `)
  head.tail(res)
}
