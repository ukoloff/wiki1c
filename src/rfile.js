//
// Render KB attachment
//
const mssql = require('mssql')
const samba = require('./samba')
const sql = require('./sql')

module.exports = render

async function render(res, page, name) {
  $m = /^(.*?)(?:[.]([^.]*))?$/.exec(name)

  const h = await sql()
  var r = await h.request()
    .input('pid', mssql.Binary, page.id)
    .input('base', mssql.NVarChar, $m[1])
    .input('ext', mssql.NVarChar, $m[2] || '')
    .query(`
      with ${sql.attachments}
      select *
      from attachments
      where
        page_id = @pid
        and basename = @base
        and ext = @ext
    `)
  r = r.recordset[0]
  if (!r) {
    res.statusCode = 404
    res.end()
    return
  }

  var smb = samba()
  // var src = await smb.createReadStream('1c\\UPRIT_WORK\\' + r.filepath)
  var src = await smb.readFile(samba.folder + "\\" + r.filepath)
  var ctype = 'application/binary'
  switch (r.ext) {
    case 'jpg':
    case 'jpeg':
      ctype = 'image/jpeg'
      break
    case 'png':
      ctype = 'image/png'
      break
  }
  res.setHeader('Content-Type', ctype)
  // res.setHeader('Content-Length', r.bytes)
  // src.pipe(res)
  res.end(src)
}

