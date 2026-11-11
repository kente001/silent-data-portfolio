// Illustrative example data (the real figures stay with the employer).

export const C = {
  fg: '#eef2f7', muted: '#9aa8ba', faint: '#64738a', line: '#242e3d',
  blue: '#3987e5', teal: '#22b8cf', amber: '#f0a020', red: '#e5484d',
  violet: '#9b7bff', green: '#22b45a', grey: '#c9d4e3',
}

function rng(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}
const R = rng(42)

// customers: usual gap in days, days quiet now, group index
export const GROUPS = [
  { k: 'Daily buyers', col: C.blue, n: 18, gap: [1, 3] },
  { k: 'Weekly buyers', col: C.teal, n: 18, gap: [5, 9] },
  { k: 'Monthly buyers', col: C.violet, n: 14, gap: [24, 34] },
]

export const CUST = []
GROUPS.forEach((g, gi) => {
  for (let i = 0; i < g.n; i++) {
    const gap = g.gap[0] + R() * (g.gap[1] - g.gap[0])
    let quiet = gap * (0.3 + R() * 1.4)
    if ((gi === 0 && (i === 3 || i === 11)) || (gi === 1 && (i === 5 || i === 14)) || (gi === 2 && i === 7)) {
      quiet = gap * (3.4 + R() * 1.6)
    }
    CUST.push({ gap: +gap.toFixed(1), quiet: +quiet.toFixed(1), g: gi, drift: quiet > 2.5 * gap })
  }
})
GROUPS.forEach((g, gi) => {
  const m = CUST.filter((c) => c.g === gi)
  g.avg = +(m.reduce((s, c) => s + c.quiet, 0) / m.length).toFixed(1)
  g.drift = m.filter((c) => c.drift).length
})

export const BIAS = { raw: { e: 92, c: 55 }, fair: { e: 71, c: 66 } }

export const HOURS = ['6am', '7', '8', '9', '10', '11', '12pm', '1', '2', '3', '4', '5', '6', '7', '8pm']
export const CALLS = [14, 24, 40, 58, 74, 86, 94, 82, 70, 76, 88, 79, 58, 40, 26, 16]
export const CAP = 60

export const USE = []
for (let u = 0; u < 34; u++) USE.push(Math.round(35 + R() * 58))
USE[6] = 260
USE[15] = 410
USE[22] = 330
USE[29] = 560
