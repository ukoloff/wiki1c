require('dotenv/config')
cte = require('./cte')

module.exports = connect

function connect() {
  const sql = require('mssql')

  return sql.connect({
    domain: process.env.DOM,
    user: process.env.USR,
    password: process.env.PSS,
    server: 'srvsql-1c',
    database: 'UPRIT_WORK',
    options: {
      trustServerCertificate: true,
    }
  })
}

for (var k in cte) {
  connect[k] = `${k} as (${cte[k]})`
}
