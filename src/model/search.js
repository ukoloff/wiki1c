//
// Prepare & search for KB pages
//
const sql = require('../sql')
const sql2it = require('../sql2it')

exports.prepare = prepare
exports.feed = feed

const
  columns = 'title:lat:md'.split(':')

function prepare(str) {
  var $where = ''
  for (var m of String(str).matchAll(/[\p{L}\d]+/ug)) {
    var w = m[0]
    if (w.length < 2) continue
    if ($where) $where += "\nand "
    $where += '(' + columns.map(f => `${f} like '%${w}%'`).join(' or ') + ')'
  }
  return $where
}

async function feed($where) {
  if (!$where)
    return none()
  var h = await sql()
  var q = h.request()
  q.query(`
      with ${sql.pages}, ${sql.spaces}, ${sql.pagez}
      select id, title
      from pagez
      where ${$where}
        and md is not null
      order by title
      `)
  return sql2it(q)
}

async function* none() {
}
