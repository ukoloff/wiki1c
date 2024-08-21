!(function () {
  if (localStorage.split)
    document.documentElement.style.setProperty('--split-ratio', localStorage.split + '%')

  document.addEventListener("DOMContentLoaded", ready, { once: true })

  function ready() {
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
})()
