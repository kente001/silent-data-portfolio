import { useId } from 'react'
import { ICONS } from '../data/icons.js'
import { LOGOS } from '../data/markup.js'

// Small icon tile used on cards ("glass" square with a stroke icon).
export function IconTile({ name, live }) {
  return (
    <span className={'ci' + (live ? ' live' : '')}>
      <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
    </span>
  )
}

export function Icon({ name }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
}

// Official tool logo. Gradient/mask ids inside the SVGs are re-suffixed per instance so repeats never collide.
export function Logo({ name }) {
  const uid = useId().replace(/:/g, '')
  const svg = LOGOS[name].replace(/id="([^"]+)"|url\(#([^)]+)\)|href="#([^"]+)"/g, (m, a, b, c) => {
    if (a) return `id="${a}-${uid}"`
    if (b) return `url(#${b}-${uid})`
    return `href="#${c}-${uid}"`
  })
  return <span dangerouslySetInnerHTML={{ __html: svg }} style={{ display: 'contents' }} />
}

export function Tag({ children }) {
  return LOGOS[children]
    ? <span className="tag"><i className="lg"><Logo name={children} /></i>{children}</span>
    : <span className="tag">{children}</span>
}

// Heading ward: two counter-rotating rune rings around a flickering lightning bolt.
export function Ward() {
  return (
    <svg className="ward" viewBox="0 0 48 48" aria-hidden="true">
      <g className="ward-a">
        <circle cx="24" cy="24" r="21" strokeDasharray="2 5" />
        {[0, 90, 180, 270].map((r) => (
          <path key={r} className="ward-rune" d="M24 .8l2.2 2.2L24 5.2 21.8 3z" transform={`rotate(${r} 24 24)`} />
        ))}
      </g>
      <circle className="ward-b" cx="24" cy="24" r="16.5" strokeWidth="1.3" strokeDasharray="14 6 3 6" />
      <path className="ward-hex" d="M24 11.5 34.8 17.75v12.5L24 36.5 13.2 30.25v-12.5z" />
      <path className="ward-arc" d="M37 9l3-2.5 1 3.5 4-1.5" />
      <path className="ward-arc b" d="M10 38l-3.5 1.5.5-4-4 .5" />
      <path className="ward-bolt" d="M27 11.5 17.5 26h5.6l-2 10.5L30.6 22h-5.7z" />
    </svg>
  )
}

export function SectionHead({ n, title, intro }) {
  return (
    <>
      <div className="s-head"><span className="n">{n}</span><Ward /><h2>{title}</h2></div>
      {intro && <p className="s-intro">{intro}</p>}
    </>
  )
}
