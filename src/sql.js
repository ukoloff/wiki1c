require('dotenv/config')

module.exports = function () {
  const sql = require('mssql')

  return sql.connect({
    domain: process.env.DOM,
    user: process.env.USR,
    password: process.env.PSS,
    server: 'srvsql-1c',
    database: 'conv',
    options: {
      trustServerCertificate: true,
    }
  })
}
