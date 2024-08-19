//
// Page not found
//
module.exports = oops

function oops(req, res) {
  res.writeHead(301, { Location: '/' })
    .end()
}
