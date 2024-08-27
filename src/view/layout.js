//
// HTML template
//
module.exports = layout

async function layout($, title = 'База знаний') {
  let assets = $.base + 'assets/'
  let res = $.res
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link href="${assets}bootswatch/litera/bootstrap.min.css" rel="stylesheet">
<link href="${assets}fa/css/font-awesome.min.css" rel="stylesheet">
<link href="${assets}kb.css" rel="stylesheet">
<script src="${assets}kb.js"></script>
</head>
<body>
<div><div class="container-fluid">
<div class="text-center"><i class="fa fa-refresh fa-spin fa-lg fa-fw text-info"></i> Загрузка...</div>
`
    .trim())
  res.write(`</div><a class="btn btn-secondary btn-sm" href="${$.base}theme/" title="Выбрать тему оформления"><i class="fa fa-paint-brush"></i></a>`)
  res.write(`</div><div><div class="container-fluid">`)
  await $.content($)
  res.write(`</div></div><div></div></body></html>`)
  res.end()
}
