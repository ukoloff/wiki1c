//
// HTML template
//
const fs = require('node:fs/promises')
const path = require('node:path')
const tree = require('./tree')

module.exports = layout

async function layout(res, title, content) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/journal/bootstrap.min.css" rel="stylesheet">
<style>
${await fs.readFile(path.join(__dirname, '../assets/kb.css'))}
</style>
<script>
${await fs.readFile(path.join(__dirname, '../assets/kb.js'))}
</script>
</head>
<body>
<div><div class="container-fluid">
`
    .trim())
  await tree(res)
  res.write(`</div></div><div><div class="container-fluid">`)
  await content(res)
  res.write(`</div></div><div></div></body></html>`)
  res.end()
}
