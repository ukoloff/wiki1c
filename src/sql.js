require('dotenv/config')

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
