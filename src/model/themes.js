//
// List Bootswatch themes
//
const fs = require('node:fs')
const path = require('node:path')
const cookies = require('../util/cookies')

const std = 'litera'

let list = fs.readdirSync(path.join(__dirname, '../../assets/bootswatch'), { withFileTypes: true })
let names = list.filter(x => x.isDirectory()).map(x => x.name)
names.sort()

module.exports = {
  names,
  path: list[0].parentPath,
  url: 'https://bootswatch.com/',
  std,
  get,
}

function get($) {
  let theme = cookies($).theme || ''
  let dark = /!/.test(theme)
  theme = theme.replace(/!/g, '')
  if (!names.includes(theme))
    theme = std
  return {
    name: theme,
    dark,
  }
}
