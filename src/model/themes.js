//
// List Bootswatch themes
//
const fs = require('node:fs/promises')
const path = require('node:path')

module.exports = themes

async function themes() {
  let list = await fs.readdir(path.join(__dirname, '../../assets/bootswatch'),
    { withFileTypes: true })
  return {
    names: list.filter(x => x.isDirectory()).map(x => x.name),
    path: list[0].parentPath,
    url: 'https://bootswatch.com/',
  }
}
