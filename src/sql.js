require('dotenv/config')
const sql = require('mssql')
const cte = require('./model/cte')

module.exports = connect

function connect() {
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
