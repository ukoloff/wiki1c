const sql = require('./sql')

main()

async function main() {
  const q = await sql()
  var r = await q.query`Select Top 1 _Fld9228 as md From _Reference9221 Where _Description Like '%ssd'`
  console.log(r)
}
