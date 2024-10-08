const crypto = require('node:crypto')
const root = require('../model/tree')

module.exports = tree

async function tree(data) {
  let z = await root(data.$)
  dropup(z)
  let hash = crypto.createHash('sha256')
  z.hash = hash.update(JSON.stringify(z.c)).digest('hex').slice(0, 12)
  return z.hash != data.hash ?
    z
    :
    {
      hash: z.hash,
      the: 'same'
    }
}

function dropup(tree) {
  delete tree.up
  for (let c of tree.c) {
    dropup(c)
  }
}
