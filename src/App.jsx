import { Suspense, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import Dog from './components/Dog'
import './App.css'

const projects = [
  ['tomorrowland', 'Tomorrowland', 19],
  ['navy-pier', 'Navy Pier', 8],
  ['msi-chicago', 'MSI Chicago', 9],
  ['phone', 'This Was Louise’s Phone', 12],
  ['kikk', 'KIKK Festival 2018', 10],
  ['kennedy', 'The Kennedy Center', 8],
  ['opera', 'Royal Opera Of Wallonia', 13],
]

function CanvasLoader() {
  return <Html center><span className="canvas-loader">Loading…</span></Html>
}

function App() {
  const [activeProject, setActiveProject] = useState(null)
  return (
    <main>
      <div className="images" aria-hidden="true">
        {projects.map(([id]) => <img className={activeProject === id ? 'visible' : ''} id={id} key={id} src={`/${id === 'tomorrowland' ? 'tommorowland' : id}.png`} alt="" />)}
      </div>
      <Canvas id="canvas-elem" camera={{ position: [0, 0, 0.55] }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, outputColorSpace: THREE.SRGBColorSpace, toneMapping: THREE.ReinhardToneMapping }}>
        <Suspense fallback={<CanvasLoader />}><Dog matcapIndex={activeProject ? projects.find(([id]) => id === activeProject)[2] : 2} /></Suspense>
      </Canvas>
      <section id="section-1">
        <nav>
          <div className="nav-elem"><span className="dogstudio-logo">DOG<br />STUDIO<sup>®</sup></span></div>
          <div className="nav-elem"><i className="ri-arrow-right-s-line" /> Our Show reel</div>
          <div className="nav-elem"><i className="ri-menu-3-line" /></div>
        </nav>
        <div className="middle"><div className="left"><h1>WE <br /> Make <br /> Good <br />Shit</h1></div><div className="right" /></div>
        <div className="bottom"><div className="left" /><div className="right"><p>Dogstudio is a multidisciplinary <br />creative studio at the intersection <br />of art, design and technology.</p></div></div>
        <div className="first-line" /><div className="second-line" />
      </section>
      <section id="section-2">
        <div className="titles">
          {projects.map(([id, title]) => (
            <div className="title" img-title={id} key={id} onFocus={() => setActiveProject(id)} onMouseEnter={() => setActiveProject(id)} onMouseLeave={() => setActiveProject(null)} tabIndex="0">
              <small>2020 - ONGOING</small><h1>{title}</h1>
            </div>
          ))}
        </div>
      </section>
      <section id="section-3" />
    </main>
  )
}

export default App
