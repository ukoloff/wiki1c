//
// HTML template
//
module.exports = layout

async function layout(res, title, content) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link href="https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/litera/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
<link href="${res.$base}assets/kb.css" rel="stylesheet">
<script src="${res.$base}assets/kb.js"></script>
</head>
<body>
<div><div class="container-fluid">
<div class="text-center"><i class="fa fa-refresh fa-spin fa-lg fa-fw text-info"></i> Загрузка...</div>
`
    .trim())
  res.write(`</div></div><div><div class="container-fluid">`)
  await content(res)
  res.write(`</div></div><div></div></body></html>`)
  res.end()
}
