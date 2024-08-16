//
// Output HTML preamble
//
module.exports = head

head.tail = tail

function head(res, title) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/morph/bootstrap.min.css" rel="stylesheet">
</head>
<body><div class="container-fluid">
  `.trim())
}

function tail(res) {
  res.end(`</div></body></html>`)
}
