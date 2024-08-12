const test = require('node:test')

test('Connect to Samba', async function (t) {
  const smb = require('../src/samba')()

  await smb.readdir('1c\\UPRIT_WORK')
  await smb.disconnect()
})
