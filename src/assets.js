//
// Render assets
//
const fs = require('node:fs')
const path = require('node:path')

module.exports = assets

async function assets(res) {
  let open = false
  let src = path.join(__dirname, '..', res.req.url)
  src = fs.createReadStream(src)
  src
    .on('ready', pipe)
    .on('error', croak)

  function pipe() {
    res.setHeader('Content-Type', mime(path.extname(res.req.url)))
    open = true
    src.pipe(res)
  }

  function croak(err) {
    if (open) throw err
    res.statusCode = 404
    res.end()
  }
}

function mime(ext) {
  switch (ext) {
    case '.js': return 'application/javascript'
    case '.css': return 'text/css'
    default: return 'application/binary'
  }
}
