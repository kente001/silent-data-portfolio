// Card energy effects (styles: .zap and .aura in index.css).
//  - click: a pulse races round the card edge
//  - hover: electric arcs crackle around the outside of the card, in the card's colour
// enableCardSignals() returns a function that removes everything it added.

const SVG = 'http://www.w3.org/2000/svg'
const rand = (a, b) => a + Math.random() * (b - a)

// Point at distance d along a rectangle's perimeter (clockwise from top-left) + outward normal.
function edgePoint(d, w, h) {
  const p = 2 * (w + h)
  d = ((d % p) + p) % p
  if (d < w) return [d, 0, 0, -1]
  if (d < w + h) return [w, d - w, 1, 0]
  if (d < 2 * w + h) return [w - (d - w - h), h, 0, 1]
  return [0, h - (d - 2 * w - h), -1, 0]
}

// One jagged arc hugging the edge, sometimes with a fork shooting outward.
function bolt(w, h, pad) {
  const start = rand(0, 2 * (w + h))
  const len = rand(50, 170)
  let d = ''
  let fork = ''
  for (let s = 0; s <= len; s += rand(6, 12)) {
    const [x, y, nx, ny] = edgePoint(start + s, w, h)
    const off = rand(-3, 9)
    const px = pad + x + nx * off + rand(-2, 2)
    const py = pad + y + ny * off + rand(-2, 2)
    d += (d ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1)
    if (!fork && Math.random() < 0.09) {
      fork = `M${px.toFixed(1)} ${py.toFixed(1)}`
      let fx = px, fy = py
      for (let k = 0; k < 3; k++) {
        fx += nx * rand(4, 8) + rand(-4, 4)
        fy += ny * rand(4, 8) + rand(-4, 4)
        fork += `L${fx.toFixed(1)} ${fy.toFixed(1)}`
      }
    }
  }
  return d + fork
}

export function enableCardSignals() {
  const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const PAD = 28 // room around the card for arcs and glow

  /* ---------- click pulse ---------- */
  const onClick = (e) => {
    const card = e.target.closest('.champ, .tool, .proj')
    if (!card) return
    // controls inside a card keep their own feedback; a card that is itself a button/link still pulses
    const control = e.target.closest('button, a')
    if (control && control !== card) return
    const zap = document.createElement('i')
    zap.className = 'zap'
    zap.setAttribute('aria-hidden', 'true')
    card.appendChild(zap)
    setTimeout(() => zap.remove(), 1200)
  }

  /* ---------- hover aura ---------- */
  // One shared SVG laid over the hovered card. It lives on <body>, so the card's own
  // overflow clipping can't cut the arcs off.
  const aura = document.createElementNS(SVG, 'svg')
  aura.setAttribute('class', 'aura')
  aura.setAttribute('aria-hidden', 'true')
  const glow = document.createElementNS(SVG, 'path')
  glow.setAttribute('class', 'aura-glow')
  const core = document.createElementNS(SVG, 'path')
  core.setAttribute('class', 'aura-core')
  aura.append(glow, core)

  let current = null
  let timer = 0

  function frame() {
    if (!current || !current.isConnected) return stop()
    const r = current.getBoundingClientRect()
    aura.style.left = r.left + window.scrollX - PAD + 'px'
    aura.style.top = r.top + window.scrollY - PAD + 'px'
    aura.setAttribute('width', r.width + PAD * 2)
    aura.setAttribute('height', r.height + PAD * 2)
    let d = ''
    const n = Math.random() < 0.25 ? 1 : Math.round(rand(2, 4)) // uneven, so it crackles
    for (let i = 0; i < n; i++) d += bolt(r.width, r.height, PAD)
    glow.setAttribute('d', d)
    core.setAttribute('d', d)
  }

  function startOn(card) {
    stop()
    current = card
    const c = getComputedStyle(card).getPropertyValue('--c').trim()
    aura.style.setProperty('--c', c || '#f0a020')
    document.body.appendChild(aura)
    frame()
    timer = setInterval(frame, 75)
  }

  function stop() {
    clearInterval(timer)
    timer = 0
    current = null
    aura.remove()
  }

  const onOver = (e) => {
    const card = e.target.closest?.('.champ, .tool')
    if (card && card !== current) startOn(card)
  }
  const onOut = (e) => {
    if (current && !current.contains(e.relatedTarget)) stop()
  }

  document.addEventListener('click', onClick)
  if (!still) {
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
  }
  return () => {
    stop()
    document.removeEventListener('click', onClick)
    document.removeEventListener('mouseover', onOver)
    document.removeEventListener('mouseout', onOut)
  }
}
