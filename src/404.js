//
// Page not found
//
module.exports = oops

function oops(req, res) {
  res.statusCode = 404
  res.end(`Path <${req.url}> not found!`)
}
