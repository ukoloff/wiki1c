//
// Two panes with splitter
//
const fs = require('node:fs/promises')
const path = require('node:path')

module.exports = dual

async function dual(req, res) {
  await head(res, 'Проба')

  tail(res)
}

async function head(res, title) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/simplex/bootstrap.min.css" rel="stylesheet">
<style>
${await fs.readFile(path.join(__dirname, '../assets/kb.css'))}
</style>
<script>
${await fs.readFile(path.join(__dirname, '../assets/kb.js'))}
</script>
</head>
<body>
  `.trim())
}

function tail(res) {
  res.end(`</body></html>`)
}
