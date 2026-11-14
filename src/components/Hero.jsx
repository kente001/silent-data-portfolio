import { useEffect, useRef } from 'react'
import { startBrain } from '../brain.js'
import { VOYAGE_SVG, PORTRAIT_BG_SVG } from '../data/markup.js'
import { profile } from '../data/content.js'
import { openPortal } from '../portal.js'
import { Icon } from './ui.jsx'

// hero buttons: play the opening transition instead of a plain jump
const go = (kind, id) => (e) => { e.preventDefault(); openPortal(kind, id) }

export function Nav({ links }) {
  return (
    <nav>
      <div className="wrap nav-in">
        <div className="brand">KN<b>//</b>silent-data</div>
        <div className="nav-links">
          {links.map((l) => <a key={l} href={`#${l}`}>{l}</a>)}
        </div>
      </div>
    </nav>
  )
}

export function Hero() {
  const brain = useRef(null)
  useEffect(() => startBrain(brain.current), [])

  return (
    <header>
      <div className="wrap">
        <div className="hero-top">
          <div className="hero-text">
            <canvas className="brain" ref={brain} aria-hidden="true" />
            <span className="status">Open to opportunities</span>
            <p className="hello">
              Hey <span className="emo" role="img" aria-label="smiling face">😊</span>, I'm Ken — thanks for taking an
              interest in my portfolio, welcome to the{' '}
              <span className="nowrap">
                adventure{' '}
                <span
                  className="voyage" title="Welcome aboard!" role="img"
                  aria-label="a Viking longship sailing through a storm"
                  dangerouslySetInnerHTML={{ __html: VOYAGE_SVG }}
                />
              </span>
            </p>
            <h1>I'm a data analyst who hunts the problems a business <span className="sig">can't hear yet</span>.</h1>
            <p className="sub">Most problems are loud. The expensive ones are quiet: customers slowly drifting away, fraud that trips no alarm. I find them while they're still small.</p>
            <div className="cta-row">
              <a className="btn primary" href="#work" onClick={go('hack', 'work')}><Icon name="term" />See the work</a>
              <a className="btn" href="#contact" onClick={go('hack', 'contact')}><Icon name="signal" />Get in touch</a>
            </div>
          </div>

          <figure className="portrait" aria-label="Photo of Ken">
            <svg className="pbg" viewBox="0 0 400 480" aria-hidden="true" dangerouslySetInnerHTML={{ __html: pbgInner }} />
            <div className={'photo' + (profile.photo ? ' cutout' : '')}>
              {profile.photo ? (
                <img src={profile.photo} alt="Ken" />
              ) : (
                <div className="ph">
                  <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="11" /><path d="M12 56c2-11 10-17 20-17s18 6 20 17" /></svg>
                  <span className="ph-t">Your photo here</span>
                  <span className="ph-s">portrait · 4:5</span>
                </div>
              )}
            </div>
            <span className="chip c1"><i style={{ background: '#f0a020' }} />3 quiet anomalies found</span>
            <span className="chip c2"><i style={{ background: '#22b8cf' }} />each customer, read alone</span>
          </figure>
        </div>
      </div>
    </header>
  )
}

// PORTRAIT_BG_SVG is a full <svg> element; we render its inner markup inside our own <svg className="pbg">.
const pbgInner = PORTRAIT_BG_SVG.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
