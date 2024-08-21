const home = require('./home')
const oops = require('./404')
const getpage = require('./getpage')
const renderpage = require('./rpage')
const renderfile = require('./rfile')
const assets = require('./assets')

module.exports = route

async function route(req, res) {
  res.$base = `/${req.headers['x-forwarded-base'] || ''}/`.replace(/\/{2,}/g, '/')

  var path = req.url
  if (/^\/($|\?)/.test(path)) {
    home(res)
    return
  }

  if (/^\/assets\/.*/.test(path)) {
    return assets(res)
  }

  var $m = /^\/([\da-f]{4,})($|\/)(.*)/.exec(path)
  if ($m) {
    if (!$m[2]) {
      res.writeHead(301, { Location: $m[1] + '/' })
        .end()
      return
    }
    var page = await getpage($m[1])
    if (!page) return oops(res)
    return $m[3] ?
      renderfile(res, page, decodeURIComponent($m[3])) :
      renderpage(res, page)
  }
  oops(res)
}
