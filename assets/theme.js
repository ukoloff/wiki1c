!(function () {
  document.addEventListener("DOMContentLoaded", ready, { once: true })

  function ready() {
    document.forms[0].addEventListener('click', click)
  }

  function click(ev) {
    if (ev.target.tagName != 'INPUT')
      return
    let f = document.forms[0]
    let name = f.theme.value
    let dark = f.dark.checked
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light')
    for (let z of document.querySelectorAll('head>link[href]').values()) {
      let $m = /\/assets\/bootswatch\//.exec(z.getAttribute('href'))
      if (!$m)
        continue
      z.href = $m[0] + name + $m.input.slice($m.index + $m[0].length).replace(/^[^\/]*/, '')
      break
    }
  }
})()
