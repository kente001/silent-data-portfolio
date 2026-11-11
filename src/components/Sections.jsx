import { useState } from 'react'
import { IconTile, Icon, Logo, Tag, SectionHead, Ward } from './ui.jsx'
import { ProfileChart, BiasChart, CapacityChart, FraudChart } from '../charts/Charts.jsx'
import { profile, stats, skills, tools, projects, flowSteps, jobs, background } from '../data/content.js'

export function About() {
  return (
    <section id="about">
      <div className="wrap about">
        <SectionHead n="01" title="About" />
        <p className="about-p">
          The 80% is loud. Revenue dips, customers vanish, numbers crash — <span className="hl">you don't need an analyst to see that.</span> The
          business already feels it. It's the other 20% that kills you: a slow leak of customers, fraud that never trips an alarm, problems that
          make no noise today and quietly grow until, by the time anyone notices, the damage is done. I call it the silent data. It doesn't
          announce itself, and that's exactly why it's dangerous. I go into the overlooked corners of the data and hunt these problems down while
          they're still small enough to fix. <b>That's where I work.</b>
        </p>
        <div className="stats">
          {stats.map((s) => (
            <div key={s.label} className="gcard champ" style={{ '--c': s.color }}>
              <div className="top"><span className="lab">{s.label}</span><IconTile name={s.icon} live={s.live} /></div>
              <div className="num">{s.num}</div>
              <div className="cap">{s.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section id="skills">
      <div className="wrap">
        <SectionHead n="02" title="What I bring" intro="Six things I do well, in plain words." />
        <div className="skills">
          {skills.map((s) => (
            <div key={s.title} className="skill champ" style={{ '--c': s.color }}>
              <IconTile name={s.icon} live={s.live} />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="tags">{s.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Tools() {
  return (
    <section id="tools">
      <div className="wrap">
        <SectionHead n="03" title="Tools I use" intro="The everyday kit." />
        <div className="tools">
          {tools.map((t) => (
            <div key={t} className="tool">
              <span className="tl"><Logo name={t} /></span>
              <span className="nm">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Flow() {
  return (
    <div className="pviz">
      <div className="ptool"><span className="mode">How the data flows</span></div>
      <div className="flow">
        {flowSteps.map((s) => (
          <div key={s.name} className={'step' + (s.run ? ' run' : '')} style={{ '--k': s.k }}>
            <span className="dot" /><b>{s.name}</b><span>{s.text}</span>
          </div>
        ))}
        <div className="gate"><Icon name="gate" />Runs daily · pauses itself if a check fails</div>
      </div>
    </div>
  )
}

function Viz({ p }) {
  switch (p.viz) {
    case 'profile': return <ProfileChart />
    case 'bias': return <BiasChart />
    case 'capacity': return <CapacityChart mode={p.mode} caption={p.caption} />
    case 'fraud': return <FraudChart mode={p.mode} caption={p.caption} />
    default: return <Flow />
  }
}

export function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <SectionHead n="04" title="Selected work" intro="Each one started as something the business couldn't see. The charts use example numbers; the real figures stay with my employer." />
        <div className="projects">
          {projects.map((p) => (
            <article key={p.id} className="proj" style={{ '--c': p.color }}>
              <div className="pin">
                <div className="ptop">
                  <IconTile name={p.icon} live={p.live} />
                  <div><div className="pdomain">{p.domain}</div><h3>{p.title}</h3></div>
                </div>
                <p className="pbody">{p.body}</p>
                <div className="found"><span className="fl">{p.foundLabel}</span><p>{p.found}</p></div>
                {p.tags && <div className="tags" style={{ marginTop: '1rem' }}>{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>}
              </div>
              <Viz p={p} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <SectionHead n="05" title="Experience" />
        <div className="exp">
          {jobs.map((j) => (
            <div key={j.title} className="job">
              <div className="when">{j.when}</div>
              <div><h3>{j.title}</h3><div className="org">{j.org}</div><p>{j.body}</p></div>
            </div>
          ))}
        </div>
        <p className="s-intro" style={{ marginTop: '1.5rem', fontSize: '.9rem' }}>{background}</p>
      </div>
    </section>
  )
}

function ContactCard({ c }) {
  const [done, setDone] = useState(false)
  const body = (
    <>
      <IconTile name={c.icon} />
      <span className="cc-txt"><span className="cc-lab">{c.label}</span><span className="cc-val">{c.value}</span></span>
      <span className="cc-act">{c.url ? 'open ↗' : done ? 'copied ✓' : 'copy'}</span>
    </>
  )
  if (c.url) {
    return <a className="ccard champ" style={{ '--c': c.color }} href={c.url} target="_blank" rel="noopener noreferrer">{body}</a>
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(c.copy) } catch { /* clipboard blocked: still acknowledge */ }
    setDone(true)
    setTimeout(() => setDone(false), 1400)
  }
  return <button type="button" className="ccard champ" style={{ '--c': c.color }} onClick={copy} aria-label={`Copy ${c.label}: ${c.value}`}>{body}</button>
}

export function Contact() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="contact-box">
          <Ward />
          <h2>Something quiet worth finding?</h2>
          <p>If the loud numbers look fine but something feels off, that's usually where I start.</p>
          <div className="contact-grid">
            {profile.contacts.map((c) => <ContactCard key={c.label} c={c} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="inner"><span>{profile.name} · {profile.location}</span><span>the silent data // 2026</span></div>
      </div>
    </footer>
  )
}
