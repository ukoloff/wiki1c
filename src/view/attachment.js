//
// Render KB attachment
//
const mssql = require('mssql')
const samba = require('../samba')
const find = require('../model/attachment')

module.exports = render

async function render(res, page, name) {
  let r = await find(page, name)
  if (!r) {
    res.statusCode = 404
    res.end()
    return
  }

  var smb = samba()
  // var src = await smb.createReadStream('1c\\UPRIT_WORK\\' + r.filepath)
  var src = await smb.readFile(samba.folder + "\\" + r.filepath)
  res.setHeader('Content-Type', ctype(r.ext))
  // res.setHeader('Content-Length', r.bytes)
  // src.pipe(res)
  res.end(src)
}

function ctype(ext) {
  switch(ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return  'image/png'
    default:
      return 'application/binary'
  }
}
