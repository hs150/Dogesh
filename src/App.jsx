import { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import Dog from './components/Dog'
import './App.css'

const projects = [
  { title: 'Tomorrowland', year: '2020 — ongoing', image: '/tommorowland.png', matcap: 19 },
  { title: 'Navy Pier', year: '2020 — ongoing', image: '/navy-pier.png', matcap: 8 },
  { title: 'MSI Chicago', year: '2020 — ongoing', image: '/msi-chicago.png', matcap: 9 },
  { title: 'This Was Louise’s Phone', year: '2019', image: '/phone.png', matcap: 12 },
  { title: 'KIKK Festival 2018', year: '2018', image: '/kikk.png', matcap: 10 },
  { title: 'The Kennedy Center', year: '2018', image: '/kennedy.png', matcap: 8 },
  { title: 'Royal Opera of Wallonia', year: '2017', image: '/opera.png', matcap: 13 },
]

function CanvasLoader() {
  return <Html center><span className="canvas-loader">Loading the experience…</span></Html>
}

function App() {
  const [activeProject, setActiveProject] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let frameId = 0
    const updateScroll = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        const maximumScroll = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(maximumScroll > 0 ? window.scrollY / maximumScroll : 0)
      })
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  const selectedMatcap = activeProject === null ? 2 : projects[activeProject].matcap

  return (
    <main className="site-shell">
      <div className="scene-backdrop" aria-hidden="true" />
      <div className="project-media" aria-hidden="true">
        {projects.map((project, index) => <img alt="" className={activeProject === index ? 'is-visible' : ''} key={project.title} src={project.image} />)}
      </div>
      <Canvas camera={{ position: [0, 0, 0.72] }} className="scene-canvas" dpr={[1, 1.75]} fallback={<p className="webgl-fallback">This interactive experience needs WebGL.</p>} gl={{ antialias: true, alpha: true, outputColorSpace: THREE.SRGBColorSpace, toneMapping: THREE.ReinhardToneMapping }}>
        <Suspense fallback={<CanvasLoader />}>
          <Dog matcapIndex={selectedMatcap} scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>

      <div className="page-content">
        <section className="hero" id="top">
          <nav className="site-nav" aria-label="Primary navigation">
            <a className="wordmark" href="#top" aria-label="Dog Studio — home">DOG<span>®</span></a>
            <a className="showreel-link" href="#work"><span aria-hidden="true">↗</span> Selected work</a>
            <a className="menu-link" href="#contact">Contact <span aria-hidden="true">+</span></a>
          </nav>
          <div className="hero-copy">
            <p className="eyebrow">Independent creative practice</p>
            <h1>We make<br />good things.</h1>
          </div>
          <div className="hero-footer">
            <span className="scroll-cue">Scroll to explore <i aria-hidden="true">↓</i></span>
            <p>Dog Studio brings art, design and technology together to make digital experiences with character.</p>
          </div>
          <div className="line line-one" aria-hidden="true" />
          <div className="line line-two" aria-hidden="true" />
        </section>

        <section className="work-section" id="work" aria-labelledby="work-heading">
          <div className="section-heading">
            <p className="eyebrow">Selected projects</p>
            <h2 id="work-heading">Work with a<br />point of view.</h2>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <button aria-label={`Preview ${project.title}`} className={`project-row ${activeProject === index ? 'is-active' : ''}`} key={project.title} onBlur={() => setActiveProject(null)} onFocus={() => setActiveProject(index)} onMouseEnter={() => setActiveProject(index)} onMouseLeave={() => setActiveProject(null)} type="button">
                <span>{project.year}</span><strong>{project.title}</strong><i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>
        </section>

        <section className="closing-section" id="contact">
          <p className="eyebrow">Have a bold idea?</p>
          <h2>Let’s give it<br /><em>a pulse.</em></h2>
          <a className="contact-link" href="mailto:hello@dogstudio.example">Start a conversation <span aria-hidden="true">↗</span></a>
        </section>
      </div>
    </main>
  )
}

export default App
