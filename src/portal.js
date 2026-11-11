// Hero button portals (styles: "portals" block in index.css).
//   openPortal('book', 'work')    -> a spellbook rises, ignites, opens, and you fall into its pages
//   openPortal('gate', 'contact') -> stone doors slam shut, an arch draws itself in light, they swing open
// After opening, the page shows only that section ("focus view") with a back button.
// goBack() closes the book / the doors again and returns to the full profile.

const still = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const KIND = { work: 'book', contact: 'gate' }

const SIGIL =
  '<svg class="sigil" viewBox="0 0 48 48" aria-hidden="true"><g class="ring"><circle cx="24" cy="24" r="21" stroke-dasharray="2 5"/>' +
  '<path class="fill" d="M24 .8l2.2 2.2L24 5.2 21.8 3z"/><path class="fill" d="M24 42.8l2.2 2.2-2.2 2.2-2.2-2.2z"/>' +
  '<path class="fill" d="M.8 24 3 21.8 5.2 24 3 26.2z"/><path class="fill" d="M42.8 24l2.2-2.2 2.2 2.2-2.2 2.2z"/></g>' +
  '<circle class="ring2" cx="24" cy="24" r="16.5" stroke-dasharray="14 6 3 6"/>' +
  '<path d="M24 11.5 34.8 17.75v12.5L24 36.5 13.2 30.25v-12.5z" opacity=".5"/>' +
  '<path class="fill bolt" d="M27 11.5 17.5 26h5.6l-2 10.5L30.6 22h-5.7z"/></svg>'

const SPARKS =
  '<svg class="sparks" viewBox="0 0 200 260" aria-hidden="true">' +
  '<path d="M18 40l-14-8 6-12-16-6"/><path d="M184 30l12-12 4 14 16-4"/><path d="M190 200l14 4-6 14 16 6"/>' +
  '<path d="M12 214l-12 10-2-16-14 2"/><path d="M100 2l6-12 8 10 8-12"/><path d="M96 258l-8 12-6-12-10 10"/></svg>'

const STAR =
  '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 2l3 15 11-9-7 12 15 4-15 4 7 12-11-9-3 15-3-15-11 9 7-12L2 24l15-4-7-12 11 9z"/></svg>'

// half an arch: pillar up, curve to the centre. Drawn once, mirrored for the right door.
const ARCH =
  '<svg viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true">' +
  '<path pathLength="1" d="M34 200V86C34 44 62 26 100 22"/><path pathLength="1" d="M46 200V92C46 58 68 42 100 38"/>' +
  '<path pathLength="1" d="M34 120h12M34 150h12M34 180h12"/><path pathLength="1" d="M72 200V120c0-14 12-22 28-24"/></svg>'

const MARKUP = {
  book:
    '<div class="veil"></div><div class="rays"></div>' +
    '<div class="stage"><div class="tome">' + SPARKS +
    '<div class="pages"></div><div class="leaf"></div>' +
    `<div class="cover"><div class="front"><div class="plate">${SIGIL}<b>Selected work</b><i>the silent data</i></div></div><div class="back"></div></div>` +
    '</div></div><div class="flash"></div>',
  gate:
    '<div class="glowback"></div>' +
    `<div class="door l">${ARCH}</div><div class="door r">${ARCH}</div>` +
    `<div class="lintel">${STAR}<i>speak, friend, and enter</i></div><div class="seam"></div>`,
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

function mount(kind, classes) {
  const el = document.createElement('div')
  el.className = `portal ${kind} ${classes}`
  el.setAttribute('aria-hidden', 'true')
  el.innerHTML = MARKUP[kind]
  document.body.appendChild(el)
  void el.offsetWidth // commit the starting state before any class changes
  return el
}

// run [delay, fn] steps on one timeline
function play(steps) {
  busy = true
  steps.forEach(([t, fn]) => setTimeout(fn, t))
  setTimeout(() => { busy = false }, steps[steps.length - 1][0] + 50)
}

export function openPortal(kind, targetId) {
  if (busy || !document.getElementById(targetId)) return
  if (still()) return setView(targetId)

  if (kind === 'book') {
    const el = mount('book', '')
    const add = (c) => () => el.classList.add(c)
    play([
      [20, add('in')],        // book rises out of the dark
      [750, add('lit')],      // sigil ignites, sparks crackle
      [1400, add('open')],    // cover swings open, light pours out
      [2550, add('dive')],    // fall into the pages
      [2900, () => setView(targetId)],
      [3000, add('out')],
      [3650, () => el.remove()],
    ])
  } else {
    const el = mount('gate', 'open nofx')
    const add = (c) => () => el.classList.add(c)
    play([
      [20, () => el.classList.remove('nofx', 'open')], // doors swing shut
      [700, add('thud')],                              // they land
      [760, add('draw')],                              // the arch draws itself in light
      [1800, add('seam')],                             // a seam of light climbs the join
      [2250, () => { setView(targetId); el.classList.add('open', 'slow') }], // and they part
      [4000, () => el.remove()],
    ])
  }
}

export function goBack() {
  const id = document.body.dataset.view
  if (busy || !id) return
  if (still()) return setView(null)

  if (KIND[id] === 'book') {
    const el = mount('book', 'open nofx')
    play([
      [20, () => { el.classList.remove('nofx'); el.classList.add('in') }],
      [500, () => { setView(null); el.classList.remove('open') }], // the book closes
      [1650, () => el.classList.add('out')],
      [2250, () => el.remove()],
    ])
  } else {
    const el = mount('gate', 'open nofx')
    play([
      [20, () => el.classList.remove('nofx', 'open')],
      [700, () => { el.classList.add('thud'); setView(null) }],
      [1150, () => el.classList.add('open', 'slow')],
      [2800, () => el.remove()],
    ])
  }
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
