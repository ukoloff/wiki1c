!(function () {
  let base = "/"

  if (localStorage.split)
    document.documentElement.style.setProperty('--split-ratio', localStorage.split + '%')

  document.addEventListener("DOMContentLoaded", ready, { once: true })

  function ready() {
    leftPane()

    if (localStorage.expand)
      try {
        JSON.parse(localStorage.expand).forEach(id => document.getElementById(id).open = true)
      } catch (e) { }

    var splitter = document.querySelector('body>:nth-child(3)')

    splitter.addEventListener('mousedown', click)
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    window.addEventListener("unload", unload)

    var fired = false

    async function leftPane() {
      base = document.querySelector('script[src^="/"]').getAttribute('src').replace(/assets.*/, '')
      let res = await fetch(base + 'api/', {
        method: 'POST',
        body: JSON.stringify({
          command: 'tree'
        })
      })
      let data = await res.json()
      document.querySelector('body>:first-child>*').innerHTML = renderTree(data)
    }

    function renderTree(page, level = 1) {
      return page.c
        .map(function (page) {
          if (page.leaf) {
            return `<div><a href="${base}${page.id}/">${h(page.title)}</a></div>`
          } else {
            let result = `<details id=":${page.id}" name="$${level}"><summary title="${h(page.title)}">${h(page.title)}</summary>`
            if (page.c.length > 0) {
              result += '<div>' + renderTree(page) + '</div>'
            }
            return result + '</details>'
          }
        })
        .join('')
    }

    function click(ev) {
      if (fired) return
      ev.preventDefault()
      fired = true
    }

    function move(ev) {
      if (!fired) return
      var r = Math.round(ev.clientX / splitter.parentNode.clientWidth * 100)
      r = Math.min(95, Math.max(5, r))
      localStorage.split = r
      document.documentElement.style.setProperty('--split-ratio', r + '%')
    }

    function up(ev) {
      if (!fired) return
      fired = false
    }

    function unload() {
      var list = []
      document.querySelectorAll('details[open]').forEach(z => list.push(z.id))
      localStorage.expand = JSON.stringify(list)
    }
  }
  var htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }

  function h(s) {
    return String(s).replace(/[&<>"]/g, e => htmlEntities[e])
  }
})()
