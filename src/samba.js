require('dotenv/config')
const smb = require('@marsaud/smb2')

module.exports =  connect

function connect() {
  return new smb({
    share: '\\\\srvfile-ekbh1\\dfs02$',
    domain: process.env.DOM,
    username: process.env.USR,
    password: process.env.PSS,
  })
}

connect.folder = '1c\\UPRIT_WORK'
