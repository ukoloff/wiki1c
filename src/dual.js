//
// Two panes with splitter
//
module.exports = dual

async function dual(req, res) {
  head(res, 'Проба')

  tail(res)
}

function head(res, title) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/simplex/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  `.trim())
}

function tail(res) {
  res.end(`</body></html>`)
}
