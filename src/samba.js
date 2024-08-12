require('dotenv/config')
const smb = require('@marsaud/smb2')

module.exports = function () {
  return new smb({
    share: '\\\\srvfile-ekbh1\\dfs02$',
    domain: process.env.DOM,
    username: process.env.USR,
    password: process.env.PSS,
  })
}
