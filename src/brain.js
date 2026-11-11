// Synthetic brain: nodes inside a brain silhouette, connections grow out from the centre.
// startBrain(canvas) draws and animates; it returns a function that stops everything.
export function startBrain(cv) {
  const ctx = cv.getContext('2d')
  if (!ctx) return () => {}

  let W = 0, H = 0, dpr = 1
  let nodes = [], edges = [], pulses = []
  let t0 = 0, raf = 0, visible = true, resizeTimer = 0, retryTimer = 0, stopped = false
  const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // deterministic layout
  let s = 7
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }

  // side-view brain: cerebrum, temporal lobe, cerebellum, brain stem (unit square, x right, y down)
  const parts = [[.50, .42, .40, .30], [.44, .60, .27, .14], [.79, .68, .12, .085], [.66, .80, .035, .09]]
  const inside = (x, y) => parts.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1)

  function build() {
    nodes = []; edges = []; pulses = []
    const bw = Math.min(W * 0.92, H * 1.42), bh = bw / 1.42
    const ox = (W - bw) / 2 + W * 0.04, oy = (H - bh) / 2
    let target = Math.round(Math.max(55, Math.min(120, (bw * bh) / 2600)))

    // outline first, so the silhouette reads
    parts.slice(0, 3).forEach((e, pi) => {
      const steps = pi === 0 ? 44 : pi === 1 ? 22 : 14
      for (let k = 0; k < steps; k++) {
        const an = (k / steps) * 6.283
        const x = e[0] + Math.cos(an) * e[2], y = e[1] + Math.sin(an) * e[3]
        const inOther = parts.some((o, q) => q !== pi && ((x - o[0]) / (o[2] * 1.02)) ** 2 + ((y - o[1]) / (o[3] * 1.02)) ** 2 < 1)
        if (inOther) continue
        const bx = ox + x * bw, by = oy + y * bh
        if (!nodes.some((n) => Math.hypot(n.x - bx, n.y - by) < bw * 0.03)) nodes.push({ x: bx, y: by, r: 1.4, hot: false })
      }
    })
    target += nodes.length

    let tries = 0
    while (nodes.length < target && tries++ < 6000) {
      const x = rnd(), y = rnd()
      if (!inside(x, y)) continue
      const px = ox + x * bw, py = oy + y * bh
      if (nodes.some((n) => Math.hypot(n.x - px, n.y - py) < bw * 0.045)) continue
      nodes.push({ x: px, y: py, r: 1.2 + rnd() * 1.6, hot: rnd() < 0.07 })
    }

    const cx = ox + bw * 0.5, cy = oy + bh * 0.45, seen = {}
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => [Math.hypot(a.x - b.x, a.y - b.y), j])
        .filter((d) => d[1] !== i)
        .sort((p, q) => p[0] - q[0])
        .slice(0, 3)
        .forEach((d) => {
          const key = Math.min(i, d[1]) + '-' + Math.max(i, d[1])
          if (seen[key] || d[0] > bw * 0.16) return
          seen[key] = 1
          const b = nodes[d[1]]
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
          edges.push({ a: i, b: d[1], start: (Math.hypot(mx - cx, my - cy) / bw) * 5200, len: d[0], p: 0 })
        })
    })
  }

  function size() {
    const r = cv.getBoundingClientRect()
    dpr = Math.min(2, window.devicePixelRatio || 1)
    W = r.width; H = r.height
    if (W < 10 || H < 10) return false
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    build()
    return true
  }

  function draw(now) {
    if (!t0) t0 = now
    const t = now - t0
    ctx.clearRect(0, 0, W, H)

    // edges grow from one node to the other
    ctx.lineWidth = 1
    edges.forEach((e) => {
      let g = still ? 1 : Math.max(0, Math.min(1, (t - e.start) / 700))
      if (e.regrow != null) { g = Math.min(1, (now - e.regrow) / 900); if (g >= 1) e.regrow = null }
      e.p = g
      if (g <= 0) return
      const a = nodes[e.a], b = nodes[e.b]
      const x = a.x + (b.x - a.x) * g, y = a.y + (b.y - a.y) * g
      ctx.strokeStyle = `rgba(110,165,245,${0.16 + 0.12 * g})`
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(x, y); ctx.stroke()
      if (g < 1) { ctx.fillStyle = 'rgba(160,215,255,.9)'; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 6.283); ctx.fill() }
    })

    // nodes light up once a connection reaches them
    const lit = {}
    edges.forEach((e) => { if (e.p > 0) lit[e.a] = 1; if (e.p >= 1) lit[e.b] = 1 })
    nodes.forEach((n, i) => {
      if (!lit[i] && !still) return
      ctx.fillStyle = n.hot ? 'rgba(240,160,32,.85)' : 'rgba(170,205,245,.55)'
      ctx.beginPath(); ctx.arc(n.x, n.y, n.hot ? n.r + 0.8 : n.r, 0, 6.283); ctx.fill()
      if (n.hot) { ctx.fillStyle = 'rgba(240,160,32,.12)'; ctx.beginPath(); ctx.arc(n.x, n.y, 7, 0, 6.283); ctx.fill() }
    })
    if (still) return

    // once grown: signals travel along links, and a few links keep re-forming
    const grown = edges.length && edges.every((e) => e.p >= 1 || e.regrow != null)
    if (grown) {
      if (Math.random() < 0.06 && pulses.length < 9) {
        const e = edges[(Math.random() * edges.length) | 0]
        pulses.push({ e, s: now, d: 900 + Math.random() * 700, rev: Math.random() < 0.5 })
      }
      if (Math.random() < 0.012) {
        const r = edges[(Math.random() * edges.length) | 0]
        if (r.regrow == null) r.regrow = now
      }
    }
    ctx.save()
    ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(120,200,255,.9)'
    pulses = pulses.filter((pl) => {
      const k = (now - pl.s) / pl.d
      if (k >= 1) return false
      const a = nodes[pl.rev ? pl.e.b : pl.e.a], b = nodes[pl.rev ? pl.e.a : pl.e.b]
      ctx.fillStyle = `rgba(185,230,255,${0.9 * (1 - Math.abs(k - 0.5))})`
      ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, 1.9, 0, 6.283); ctx.fill()
      return true
    })
    ctx.restore()
  }

  function loop(now) {
    draw(now)
    raf = visible && !document.hidden && !stopped ? requestAnimationFrame(loop) : 0
  }
  function start() {
    if (still) draw(performance.now())
    else if (!raf && !stopped) raf = requestAnimationFrame(loop)
  }

  if (size()) start()
  else retryTimer = setTimeout(() => { if (!stopped && size()) start() }, 300)

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) start() })
    : null
  io?.observe(cv)

  const onVis = () => { if (!document.hidden) start() }
  document.addEventListener('visibilitychange', onVis)

  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => { t0 = 0; if (size()) start() }, 200)
  }
  window.addEventListener('resize', onResize)

  return () => {
    stopped = true
    cancelAnimationFrame(raf)
    clearTimeout(resizeTimer); clearTimeout(retryTimer)
    io?.disconnect()
    document.removeEventListener('visibilitychange', onVis)
    window.removeEventListener('resize', onResize)
  }
}
