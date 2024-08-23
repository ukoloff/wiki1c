const root = require('../model/tree')

module.exports = tree

async function tree(res) {
  return root()
}
