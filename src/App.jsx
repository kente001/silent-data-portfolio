import { useEffect } from 'react'
import { Nav, Hero } from './components/Hero.jsx'
import { About, Skills, Tools, Work, Experience, Contact, Footer } from './components/Sections.jsx'
import { navLinks } from './data/content.js'
import { enableCardSignals } from './zap.js'
import { enablePortalKeys } from './portal.js'

export default function App() {
  useEffect(() => enableCardSignals(), [])
  useEffect(() => enablePortalKeys(), [])

  return (
    <>
      <Nav links={navLinks} />
      <Hero />
      <About />
      <Skills />
      <Tools />
      <Work />
      <Experience />
      <Contact />
      <Footer />
    </>
  )
}
