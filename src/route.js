const home = require('./home')
const oops = require('./404')
const getpage = require('./getpage')
const renderpage = require('./rpage')
const renderfile = require('./rfile')
const search = require('./search')
const tree = require('./tree')
const dual = require('./dual')

module.exports = route

async function route(req, res) {
  var path = req.url
  if ('/' == path) {
    home(req, res)
    return
  }
  if (/^\/q\/($|\?)/.test(path))
    return search(req, res)
  if (/^\/nav\/($|\?)/.test(path))
    return tree(req, res)
  if (/^\/2\/($|\?)/.test(path))
    return dual(req, res)
  var $m = /^\/([\da-f]{4,})($|\/)(.*)/.exec(path)
  if ($m) {
    if (!$m[2]) {
      res.writeHead(301, {Location: $m[1] + '/'})
        .end()
      return
    }
    var page = await getpage($m[1])
    if (!page) return oops(req, res)
    return $m[3] ?
      renderfile(res, page, decodeURIComponent($m[3])) :
      renderpage(res, page)
  }
  oops(req, res)
}
