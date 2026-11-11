// Generates the SVG pieces of the GitHub profile page (kente001/kente001) in the portfolio's style:
// section headers with the ward, one card per repo, a toolkit grid with real logos, contact buttons.
// GitHub READMEs can't carry CSS, so every piece is a self-contained animated SVG shown as an image.
//   node github/make-profile.mjs   -> writes github/profile/assets/*.svg
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LOGOS } from '../src/data/markup.js'
import { ICONS } from '../src/data/icons.js'

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'profile', 'assets')
fs.mkdirSync(out, { recursive: true })
const write = (name, svg) => { fs.writeFileSync(path.join(out, name), svg); console.log('wrote', name) }

const C = { amber: '#f0a020', blue: '#3987e5', teal: '#22b8cf', violet: '#9b7bff', red: '#e5484d', green: '#22b45a' }
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const MONO = "ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',monospace"
const DISP = "'Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif"

// card outline: two sharp corners, two rounded (the portfolio's card silhouette)
const shape = (x, y, w, h, R, r = 4) =>
  `M${x + r} ${y}H${x + w - R}a${R} ${R} 0 0 1 ${R} ${R}V${y + h - r}a${r} ${r} 0 0 1 -${r} ${r}H${x + R}a${R} ${R} 0 0 1 -${R} -${R}V${y + r}a${r} ${r} 0 0 1 ${r} -${r}z`

const svg = (w, h, label, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label)}">\n${body}\n</svg>\n`

const KEYFRAMES = `
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes bolt{0%,100%{opacity:.92}6%{opacity:.35}9%{opacity:1}44%{opacity:.9}47%{opacity:.5}50%{opacity:1}}
  @keyframes arc{0%,100%{opacity:0}5%{opacity:1}12%{opacity:0}46%{opacity:.9}52%{opacity:0}}
  @keyframes run{to{stroke-dashoffset:-1700}}
  @keyframes rule{0%,100%{width:44px}50%{width:150px}}
  @keyframes grow{0%,100%{transform:scaleX(.2)}50%{transform:scaleX(1)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}`

/* ---------- section headers ---------- */
function header(n, title, c) {
  const col = C[c]
  return svg(1200, 76, title, `<style>
  .a{transform-origin:66px 38px;animation:spin 16s linear infinite}.b{transform-origin:66px 38px;animation:spin 10s linear infinite reverse}
  .bolt{animation:bolt 2.8s steps(1,end) infinite}.arc{opacity:0;animation:arc 2.8s steps(1,end) infinite}.arc.x{animation-delay:-1.3s}
  .line{transform-origin:0 0;animation:grow 6s ease-in-out infinite}${KEYFRAMES}
</style>
<defs><filter id="g" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
<text x="0" y="45" font-family="${MONO}" font-size="16" fill="#64738a">${n}</text>
<g fill="none">
  <g class="a" stroke="${col}"><circle cx="66" cy="38" r="30" stroke-dasharray="3 7" stroke-width="1.3"/>
    <path d="M66 4l3.5 4-3.5 4-3.5-4z" fill="${col}" stroke="none"/><path d="M66 64l3.5 4-3.5 4-3.5-4z" fill="${col}" stroke="none"/></g>
  <circle class="b" cx="66" cy="38" r="22.5" stroke="#3987e5" stroke-width="1.8" stroke-dasharray="20 8 4 8"/>
  <g stroke="#eaf6ff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" filter="url(#g)">
    <path class="arc" d="M90 14l6-5 2 6 7-3"/><path class="arc x" d="M42 62l-7 3 1-8-8 1"/></g>
  <path class="bolt" d="M70.500 19l-14.500 22h8.600l-3 16 14.500-22h-8.600z" fill="${col}" stroke="#fff3d6" stroke-width=".8" filter="url(#g)"/>
</g>
<text x="116" y="50" font-family="${DISP}" font-weight="700" font-size="34" fill="#c9d4e3" letter-spacing="-.5">${esc(title)}</text>
<g transform="translate(${130 + title.length * 18} 39)"><rect class="line" width="${1050 - title.length * 18}" height="2" fill="url(#l)"/></g>`)
}

/* ---------- repo cards ---------- */
function card({ n, icon, title, lines, tags, c }, i) {
  const col = C[c]
  const W = 600, H = 232, p = shape(8, 8, W - 16, H - 16, 26)
  let tx = 34
  const tagEls = tags.map((t) => {
    const w = t.length * 8.4 + 20
    const el = `<rect x="${tx}" y="174" width="${w}" height="26" rx="3" fill="#ffffff" fill-opacity=".06" stroke="#ffffff" stroke-opacity=".14"/><text x="${tx + 10}" y="191.500" font-family="${MONO}" font-size="13" fill="#c9d4e3">${esc(t)}</text>`
    tx += w + 8
    return el
  }).join('')
  return svg(W, H, `${title}: ${lines.join(' ')}`, `<style>
  .pulse{stroke-dasharray:110 1590;animation:run 5s linear infinite;animation-delay:-${(i * 0.8).toFixed(1)}s}
  .rule{animation:rule 5s ease-in-out infinite;animation-delay:-${(i * 0.8).toFixed(1)}s}${KEYFRAMES}
</style>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".17"/><stop offset=".6" stop-color="#0f1728" stop-opacity="0"/></linearGradient>
  <pattern id="d" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="${col}"/></pattern>
  <linearGradient id="f" x1="1" y1="0" x2=".4" y2=".9"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <mask id="m"><rect width="${W}" height="${H}" fill="url(#f)"/></mask><clipPath id="c"><path d="${p}"/></clipPath>
  <filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<path d="${p}" fill="#101829"/>
<g clip-path="url(#c)"><rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#d)" mask="url(#m)" opacity=".5"/>
  <rect class="rule" x="8" y="8" width="44" height="3" fill="${col}"/></g>
<path d="${p}" fill="none" stroke="#fff" stroke-opacity=".1"/>
<path class="pulse" d="${p}" fill="none" stroke="${col}" stroke-width="2.2" stroke-linecap="round" filter="url(#g)"/>
<path d="M${W - 20} ${H - 38}v18h-18" fill="none" stroke="${col}" stroke-opacity=".8"/>
<path d="${shape(34, 34, 44, 44, 12, 2)}" fill="${col}" fill-opacity=".13" stroke="${col}" stroke-opacity=".55"/>
<g transform="translate(45 45) scale(.92)" fill="none" stroke="${col}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" color="${col}">${ICONS[icon]}</g>
<text x="94" y="52" font-family="${MONO}" font-size="13" letter-spacing="2.5" fill="${col}">${n}</text>
<text x="94" y="76" font-family="${DISP}" font-weight="700" font-size="25" fill="#eef2f7">${esc(title)}</text>
<text font-family="${MONO}" font-size="15" fill="#9aa8ba"><tspan x="34" y="118">${esc(lines[0])}</tspan><tspan x="34" y="141">${esc(lines[1] || '')}</tspan></text>
${tagEls}`)
}

/* ---------- toolkit: real logos on light badges ---------- */
function toolkit(names) {
  const cols = 6, tw = 186, th = 122, gap = 16, W = 1200
  const rows = Math.ceil(names.length / cols), H = rows * th + (rows - 1) * gap + 8
  const tiles = names.map((name, i) => {
    const x = (i % cols) * (tw + gap) + 2, y = Math.floor(i / cols) * (th + gap) + 4
    // nest the logo and make its internal ids unique to this tile
    const logo = LOGOS[name]
      .replace(/id="([^"]+)"/g, `id="t${i}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#t${i}-$1)`).replace(/href="#([^"]+)"/g, `href="#t${i}-$1"`)
      .replace(/^<svg /, `<svg x="${x + tw / 2 - 17}" y="${y + 27}" width="34" height="34" preserveAspectRatio="xMidYMid meet" `)
      .replace(' aria-hidden="true"', '')
    return `<path d="${shape(x, y, tw, th, 18, 3)}" fill="#111827" stroke="#242e3d"/>
<rect class="u" x="${x + tw / 2 - 30}" y="${y + th - 2.500}" width="60" height="2" fill="#f0a020" style="animation-delay:-${(i * 0.35).toFixed(2)}s"/>
<path d="${shape(x + tw / 2 - 27, y + 17, 54, 54, 13, 3)}" fill="#f3f6fa"/>
${logo}
<text x="${x + tw / 2}" y="${y + 98}" text-anchor="middle" font-family="${MONO}" font-size="14" fill="#9aa8ba">${esc(name)}</text>`
  }).join('\n')
  return svg(W, H, 'Toolkit: ' + names.join(', '), `<style>.u{opacity:.25;animation:u 4.2s ease-in-out infinite}@keyframes u{0%,100%{opacity:.15}50%{opacity:1}}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>\n${tiles}`)
}

/* ---------- contact buttons ---------- */
function button(icon, label, sub, c) {
  const col = C[c], W = 390, H = 84, p = shape(4, 4, W - 8, H - 8, 20, 3)
  return svg(W, H, `${label}: ${sub}`, `<style>.pulse{stroke-dasharray:80 860;animation:r 4s linear infinite}@keyframes r{to{stroke-dashoffset:-940}}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>
<defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".2"/><stop offset=".7" stop-color="#0f1728" stop-opacity="0"/></linearGradient></defs>
<path d="${p}" fill="#101829"/><path d="${p}" fill="url(#bg)"/><path d="${p}" fill="none" stroke="${col}" stroke-opacity=".45"/>
<path class="pulse" d="${p}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" filter="url(#g)"/>
<path d="${shape(20, 20, 44, 44, 12, 2)}" fill="${col}" fill-opacity=".13" stroke="${col}" stroke-opacity=".55"/>
<g transform="translate(31 31) scale(.92)" fill="none" stroke="${col}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" color="${col}">${ICONS[icon]}</g>
<text x="80" y="38" font-family="${MONO}" font-size="12" letter-spacing="2.5" fill="${col}">${esc(label.toUpperCase())}</text>
<text x="80" y="60" font-family="${MONO}" font-size="15" fill="#eef2f7">${esc(sub)}</text>
<text x="${W - 26}" y="50" text-anchor="end" font-family="${MONO}" font-size="18" fill="${col}">↗</text>`)
}

/* ---------- content ---------- */
;[['01', 'About', 'amber'], ['02', 'Selected work', 'teal'], ['03', 'Toolkit', 'violet'], ['04', 'Contact', 'blue']]
  .forEach(([n, t, c]) => write(`head-${t.toLowerCase().replace(/ /g, '-')}.svg`, header(n, t, c)))

export const repos = [
  { repo: 'kente_dw', n: '01', icon: 'layers', c: 'violet', title: 'Kente Data Warehouse', lines: ['A warehouse built from scratch with dbt: bronze,', 'silver, gold, snapshots and tests.'], tags: ['dbt', 'MySQL', 'star schema'] },
  { repo: 'airflow-kente', n: '02', icon: 'gate', c: 'blue', title: 'Airflow for Kente', lines: ['Runs the warehouse build every day and stops', 'if a quality check fails.'], tags: ['Airflow', 'Docker', 'dbt'] },
  { repo: 'End-to-End-Data-Analysis-Project', n: '03', icon: 'bars', c: 'teal', title: 'End-to-End Data Analysis', lines: ['From PostgreSQL, through Python cleaning,', 'to a live Looker Studio dashboard.'], tags: ['Python', 'PostgreSQL', 'Looker Studio'] },
  { repo: 'Customer-Segmentation-RFM-K-MEANS-', n: '04', icon: 'users', c: 'green', title: 'Customer Segmentation', lines: ['RFM scores, K-Means segments and', 'churn prediction.'], tags: ['RFM', 'K-Means', 'scikit-learn'] },
  { repo: 'Excelerate-EDA-Project', n: '05', icon: 'table', c: 'red', title: 'Excelerate EDA', lines: ['Sign-ups and program applications', 'on an online platform.'], tags: ['pandas', 'matplotlib', 'Looker Studio'] },
  { repo: 'silent-data-portfolio', n: '06', icon: 'book', c: 'amber', title: 'The Silent Data', lines: ['My portfolio: living charts, a thinking brain', 'and a little magic.'], tags: ['React', 'Vite', 'ECharts'] },
]
repos.forEach((r, i) => write(`card-${r.repo}.svg`, card(r, i)))

write('toolkit.svg', toolkit(['Python', 'pandas', 'NumPy', 'PostgreSQL', 'MySQL', 'DuckDB', 'Power BI', 'Excel', 'Looker Studio', 'dbt', 'Airflow', 'Docker']))
write('btn-linkedin.svg', button('linkedin', 'LinkedIn', 'in/kennedy-njoroge', 'blue'))
write('btn-portfolio.svg', button('book', 'Portfolio', 'silent-data-portfolio', 'amber'))
write('btn-github.svg', button('github', 'GitHub', 'github.com/kente001', 'violet'))
