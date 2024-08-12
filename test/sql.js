const test = require('node:test')

test('Connect to MS SQL', async function (t) {
  const sql = await require('../src/sql')()

  await sql.query`Select * from Config`
  await sql.close()
})

