// Generates animated SVG banners for GitHub READMEs in the portfolio's "Silent Data" style.
// GitHub strips custom CSS/JS from READMEs, but an SVG shown as an image keeps its own CSS
// animations, so all the motion lives inside each file.
//   node github/make-banners.mjs        -> writes github/banners/<name>.svg
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'banners')
fs.mkdirSync(out, { recursive: true })

const COLORS = { amber: '#f0a020', blue: '#3987e5', teal: '#22b8cf', violet: '#9b7bff', red: '#e5484d', green: '#22b45a' }

const banners = [
  { file: 'profile', n: '00', kicker: 'KN//silent-data', title: 'Kennedy Njoroge', tag: "Data analyst. I hunt the problems a business can't hear yet.", c: 'amber' },
  { file: 'kente_dw', n: '01', kicker: 'data warehouse · dbt', title: 'Kente Data Warehouse', tag: 'Raw to bronze to silver to gold. Cleaned in layers, ready for reports.', c: 'violet' },
  { file: 'airflow-kente', n: '02', kicker: 'orchestration · airflow · docker', title: 'Airflow for Kente', tag: 'The scheduler that runs the warehouse pipeline every day.', c: 'blue' },
  { file: 'End-to-End-Data-Analysis-Project', n: '03', kicker: 'analysis · python · looker studio', title: 'End-to-End Data Analysis', tag: 'Extraction, cleaning, EDA and a live dashboard.', c: 'teal' },
  { file: 'Customer-Segmentation-RFM-K-MEANS-', n: '04', kicker: 'customers · rfm · k-means', title: 'Customer Segmentation', tag: 'Who buys, how often, and who is drifting away.', c: 'green' },
  { file: 'Excelerate-EDA-Project', n: '05', kicker: 'eda · python · looker studio', title: 'Excelerate EDA', tag: 'Sign-ups and program applications on an online platform.', c: 'red' },
  { file: 'silent-data-portfolio', n: '06', kicker: 'portfolio · react · vite', title: 'The Silent Data', tag: 'My portfolio: living charts, a thinking brain, and a little magic.', c: 'amber' },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// card outline: two sharp corners, two rounded (same silhouette as the portfolio cards)
const W = 1200, H = 280, X = 14, Y = 14, CW = W - 28, CH = H - 28, R = 34, r = 5
const card = `M${X + r} ${Y}H${X + CW - R}a${R} ${R} 0 0 1 ${R} ${R}V${Y + CH - r}a${r} ${r} 0 0 1 -${r} ${r}H${X + R}a${R} ${R} 0 0 1 -${R} -${R}V${Y + r}a${r} ${r} 0 0 1 ${r} -${r}z`

function banner({ n, kicker, title, tag, c }) {
  const col = COLORS[c]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}: ${esc(tag)}">
<style>
  .mono{font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',monospace}
  .disp{font-family:'Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif;font-weight:700}
  .spin{transform-origin:1068px 140px;animation:spin 16s linear infinite}
  .rev{transform-origin:1068px 140px;animation:spin 10s linear infinite reverse}
  .bolt{animation:bolt 2.8s steps(1,end) infinite}
  .arc{opacity:0;animation:arc 2.8s steps(1,end) infinite}
  .arc.b{animation-delay:-1.3s}.arc.c{animation-delay:-2.1s}
  .pulse{stroke-dasharray:150 2750;animation:run 4.5s linear infinite}
  .rule{animation:rule 4.5s ease-in-out infinite}
  .surge{animation:surge 1.6s steps(1,end) infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes bolt{0%,100%{opacity:.92}6%{opacity:.35}9%{opacity:1}44%{opacity:.9}47%{opacity:.5}50%{opacity:1}}
  @keyframes arc{0%,100%{opacity:0}5%{opacity:1}12%{opacity:0}46%{opacity:.9}52%{opacity:0}}
  @keyframes run{to{stroke-dashoffset:-2900}}
  @keyframes rule{0%,100%{width:60px}50%{width:260px}}
  @keyframes surge{0%,100%{opacity:.35}18%{opacity:.7}27%{opacity:.25}52%{opacity:.6}61%{opacity:.85}70%{opacity:.3}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".16"/><stop offset=".55" stop-color="#0f1728" stop-opacity="0"/></linearGradient>
  <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="${col}"/></pattern>
  <linearGradient id="fade" x1="1" y1="0" x2=".45" y2=".9"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <mask id="m"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  <clipPath id="clip"><path d="${card}"/></clipPath>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="halo" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
</defs>

<path class="surge" d="${card}" fill="none" stroke="${col}" stroke-width="6" filter="url(#halo)"/>
<path d="${card}" fill="#101829"/>
<g clip-path="url(#clip)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#m)" opacity=".5"/>
  <rect class="rule" x="${X}" y="${Y}" width="60" height="3" fill="${col}"/>
</g>
<path d="${card}" fill="none" stroke="#ffffff" stroke-opacity=".1"/>
<path class="pulse" d="${card}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" filter="url(#glow)"/>
<path d="M${X + CW - 12} ${Y + CH - 34}v22h-22" fill="none" stroke="${col}" stroke-opacity=".8"/>

<text class="mono" x="64" y="84" font-size="17" letter-spacing="3" fill="${col}">${n} / ${esc(kicker.toUpperCase())}</text>
<text class="disp" x="62" y="152" font-size="54" fill="#eef2f7" letter-spacing="-1">${esc(title)}</text>
<text class="mono" x="64" y="198" font-size="19" fill="#9aa8ba">${esc(tag)}</text>
<text class="mono" x="64" y="238" font-size="13" letter-spacing="2" fill="#64738a">THE SILENT DATA // KENNEDY NJOROGE</text>

<g fill="none">
  <g class="spin" stroke="${col}">
    <circle cx="1068" cy="140" r="74" stroke-dasharray="4 12" stroke-width="1.5"/>
    <path d="M1068 58l7 8-7 8-7-8z" fill="${col}" stroke="none"/><path d="M1068 206l7 8-7 8-7-8z" fill="${col}" stroke="none"/>
    <path d="M986 140l8-7 8 7-8 7z" fill="${col}" stroke="none"/><path d="M1134 140l8-7 8 7-8 7z" fill="${col}" stroke="none"/>
  </g>
  <circle class="rev" cx="1068" cy="140" r="56" stroke="#3987e5" stroke-width="2.5" stroke-dasharray="48 20 10 20"/>
  <path d="M1068 98l36.4 21v42L1068 182l-36.4-21v-42z" stroke="#ffffff" stroke-opacity=".2"/>
  <g stroke="#eaf6ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
    <path class="arc" d="M1118 86l12-10 4 13 15-6"/>
    <path class="arc b" d="M1016 192l-13 6 2-15-15 2"/>
    <path class="arc c" d="M1010 96l-14-4 6-12-13-5"/>
  </g>
  <path class="bolt" d="M1079 96l-34 50h20l-7 38 34-52h-20z" fill="${col}" stroke="#fff3d6" stroke-width="1.5" filter="url(#glow)"/>
</g>
</svg>
`
}

for (const b of banners) {
  fs.writeFileSync(path.join(out, b.file + '.svg'), banner(b))
  console.log('wrote', b.file + '.svg')
}
