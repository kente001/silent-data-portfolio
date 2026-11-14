// Hero button transitions (styles: "hack" block in index.css).
// "See the work" and "Get in touch" each run a short terminal break-in: code rain, typed commands,
// a decrypt bar, then ACCESS GRANTED and a glitch into the section.
// After opening, the page shows only that section ("focus view") with a back button; goBack() returns.

const still = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// each line: [command, result] or [command, 'BAR'] for a progress bar
const SCRIPTS = {
  work: {
    title: 'silent-data://work',
    lines: [
      ['connect silent-data://work', 'OK'],
      ['authenticating visitor', 'TRUSTED'],
      ['decrypting case files', 'BAR'],
      ['scanning for quiet anomalies', '5 FOUND'],
      ['rendering charts', 'OK'],
    ],
    granted: 'ACCESS GRANTED',
  },
  contact: {
    title: 'silent-data://contact',
    lines: [
      ['open secure channel --to ken', 'OK'],
      ['handshake', 'ACCEPTED'],
      ['encrypting line', 'BAR'],
      ['locating Nairobi, KE', 'ONLINE'],
    ],
    granted: 'CHANNEL OPEN',
  },
  back: {
    title: 'silent-data://home',
    lines: [
      ['close session', 'OK'],
      ['restoring full profile', 'BAR'],
    ],
    granted: 'PROFILE RESTORED',
  },
}

let busy = false
let backBtn = null

function setView(id) {
  if (id) document.body.dataset.view = id
  else delete document.body.dataset.view
  window.scrollTo(0, 0)
  history.replaceState(null, '', id ? '#' + id : location.pathname)
  if (id && !backBtn) {
    backBtn = document.createElement('button')
    backBtn.type = 'button'
    backBtn.className = 'btn backbar'
    backBtn.innerHTML = '<span aria-hidden="true">←</span> Back to full profile'
    backBtn.addEventListener('click', goBack)
    document.body.appendChild(backBtn)
  }
  if (!id && backBtn) { backBtn.remove(); backBtn = null }
}

// falling code behind the terminal; returns a stop function
function codeRain(cv) {
  const ctx = cv.getContext('2d')
  const glyphs = '01ABCDEF<>/{}[]$#=+*アカサタナハマヤラワ'
  const size = 16
  let cols = 0, drops = [], raf = 0, last = 0
  const fit = () => {
    cv.width = cv.clientWidth; cv.height = cv.clientHeight
    cols = Math.ceil(cv.width / size)
    drops = Array.from({ length: cols }, () => Math.random() * -40)
  }
  fit()
  const tick = (now) => {
    raf = requestAnimationFrame(tick)
    if (now - last < 45) return
    last = now
    ctx.fillStyle = 'rgba(5,8,13,.22)'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.font = size + 'px ui-monospace,Consolas,monospace'
    for (let i = 0; i < cols; i++) {
      const y = drops[i] * size
      ctx.fillStyle = Math.random() < 0.06 ? '#f0a020' : Math.random() < 0.5 ? '#22b8cf' : '#1c8fa3'
      ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * size, y)
      drops[i] = y > cv.height && Math.random() > 0.96 ? 0 : drops[i] + 1
    }
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

async function runTerminal(script, onGranted, speed = 1) {
  busy = true
  const el = document.createElement('div')
  el.className = 'hack'
  el.setAttribute('aria-hidden', 'true')
  el.innerHTML =
    '<canvas></canvas>' +
    `<div class="term"><div class="term-bar"><b></b><b></b><b></b><span>${script.title}</span></div><div class="term-body"></div></div>` +
    `<div class="granted"><span data-text="${script.granted}">${script.granted}</span></div>`
  document.body.appendChild(el)
  const stopRain = codeRain(el.querySelector('canvas'))
  const body = el.querySelector('.term-body')
  void el.offsetWidth
  el.classList.add('in')
  await sleep(220 * speed)

  for (const [cmd, result] of script.lines) {
    const ln = document.createElement('div')
    ln.className = 'ln cur'
    ln.innerHTML = '<span class="p">&gt;</span> <span class="c"></span>'
    body.appendChild(ln)
    const c = ln.querySelector('.c')
    for (const ch of cmd) { c.textContent += ch; await sleep(11 * speed) }
    await sleep(90 * speed)
    if (result === 'BAR') {
      ln.insertAdjacentHTML('beforeend', ' <span class="bar"><i></i></span><span class="pct">0%</span>')
      const fill = ln.querySelector('.bar i'), pct = ln.querySelector('.pct')
      for (let p = 0; p <= 100; p += 4 + ((Math.random() * 9) | 0)) {
        fill.style.width = p + '%'; pct.textContent = p + '%'
        await sleep(26 * speed)
      }
      fill.style.width = '100%'; pct.textContent = '100%'; pct.classList.add('ok')
    } else {
      ln.insertAdjacentHTML('beforeend', ` <span class="dots">....</span> <span class="ok">${result}</span>`)
    }
    ln.classList.remove('cur')
    await sleep(110 * speed)
  }

  el.classList.add('ok')          // ACCESS GRANTED, glitching
  await sleep(620 * speed)
  onGranted()                     // swap the page underneath
  el.classList.add('out')         // tear the overlay away
  await sleep(480)
  stopRain()
  el.remove()
  busy = false
}

// `kind` is kept for the callers' sake; the section id picks the script
export function openPortal(kind, targetId) {
  if (busy || !document.getElementById(targetId)) return
  if (still()) return setView(targetId)
  runTerminal(SCRIPTS[targetId] || SCRIPTS.work, () => setView(targetId))
}

export function goBack() {
  if (busy || !document.body.dataset.view) return
  if (still()) return setView(null)
  runTerminal(SCRIPTS.back, () => setView(null), 0.7)
}

// Escape goes back; a nav link clicked inside a focus view returns to the full page first.
export function enablePortalKeys() {
  const onKey = (e) => { if (e.key === 'Escape') goBack() }
  const onNav = (e) => {
    if (document.body.dataset.view && e.target.closest('nav a[href^="#"]')) setView(null)
  }
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onNav, true)
  return () => {
    document.removeEventListener('keydown', onKey)
    document.removeEventListener('click', onNav, true)
  }
}
