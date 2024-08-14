const test = require('node:test')

test('Connect to Samba', async function (t) {
  const samba = require('../src/samba')
  var smb = samba()

  await smb.readdir(samba.folder)
  await smb.disconnect()
})
