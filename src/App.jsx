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
          <div className="nav-elem">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 401.23099 116.838" aria-label="Dogstudio">
              <path d="M97.9212,84.4793c0-13.21301-7.2132-23.3924-25.54961-23.3924h-19.6172v46.7851h19.6172c18.3364,0,25.54961-10.1797,25.54961-23.3927Zm-13.3478,0c0,9.2356-5.1908,12.6737-12.404,12.6737h-6.6739v-25.3474h6.6739c7.2132,0,12.404,3.4381,12.404,12.6737Z" />
              <path d="M100.972,107.872h37.078v-10.6516h-24.33701v-8.0222h21.37v-10.112h-21.37v-7.348h23.73v-10.6513h-36.47099v46.7851Z" />
              <path d="M181.211,77.3335c0-11.7973-7.55-16.2466-19.28-16.2466h-20.29199v46.7851h12.741v-14.2919h7.55099c11.73,0,19.28-4.4493,19.28-16.2466Zm-13.213,0c0,4.5841-2.157,6.47169-7.34801,6.47169h-6.26999v-12.9434h6.26999c5.19101,0,7.34801,1.8876,7.34801,6.4717Z" />
              <path d="M182.601,72.0079h14.76401v35.86411h12.741v-35.86411h14.763v-10.921h-42.26801v10.921Z" />
              <path d="M219.575,101.66c0,4.23399,3.427,7.661,7.661,7.661,4.233,0,7.694-3.427,7.694-7.661,0-4.23331-3.461-7.694-7.694-7.694-4.234,0-7.661,3.4609-7.661,7.694Zm1.478,0c0-3.4941,2.755-6.35011,6.183-6.35011,3.427,0,6.216,2.856,6.216,6.35011,0,3.495-2.789,6.317-6.216,6.317-3.428,0-6.183-2.822-6.183-6.317Zm2.587,3.797h2.42v-2.621h1.377l1.445,2.621h2.621l-1.747-3.091c.806-.336,1.411-1.243,1.411-2.251,0-1.781-1.142-2.621-3.091-2.621h-4.436v7.963Zm5.074-5.309c0,.639-.403,.908-1.176,.908h-1.478v-1.68h1.478c.773,0,1.176,.202,1.176,.772Z" />
              <path d="M48.0438,24.4527C48.0438,11.1965,40.807,.98386,22.4106,.98386H2.72925V47.9216H22.4106c18.3964,0,25.6332-10.2127,25.6332-23.4689Zm-13.3915,0c0,9.2658-5.2078,12.7152-12.4446,12.7152h-6.6957V11.7376h6.6957c7.2368,0,12.4446,3.4493,12.4446,12.7151Z" />
              <path d="M99.8921,24.4527C99.8921,9.84386,90.8292,.17226,75.2734,.17226s-24.6186,9.6716-24.6186,24.28044,9.0629,24.2805,24.6186,24.2805,24.6187-9.6716,24.6187-24.2805Zm-13.4591,0c0,7.8455-4.2609,13.5944-11.1596,13.5944s-11.1595-5.7489-11.1595-13.5944,4.2609-13.5943,11.1595-13.5943,11.1596,5.7488,11.1596,13.5943Z" />
              <path d="M175.40601,48.7332c12.715,0,20.696-5.9517,20.696-15.4205,0-7.7102-5.073-11.7006-12.986-13.3238l-10.145-2.0966c-4.058-.8116-5.275-2.0967-5.275-4.1933,0-2.2996,2.367-4.1933,6.628-4.1933,4.734,0,8.183,2.029,8.522,6.2899h12.579c0-11.227-9.468-15.623-21.169-15.623-11.227,0-19.411,5.614-19.411,14.744,0,7.71,5.073,11.701,12.986,13.324l10.145,2.097c4.058,.812,5.275,2.097,5.275,4.193,0,2.976-2.908,4.667-7.507,4.667-5.208,0-8.995-2.705-9.266-7.575h-12.58c.271,10.551,7.44,17.111,21.508,17.111Z" />
              <path d="M196.80901,11.9405h14.812v35.9811h12.782V11.9405h14.812V.98386h-42.406v10.95664Z" />
              <path d="M263.302,48.7332c13.594,0,21.169-6.1547,21.169-20.4254V.98386h-12.783V28.3078c0,6.29-3.179,9.5364-8.386,9.5364-5.276,0-8.455-3.2464-8.455-9.5364V.98386h-12.782V28.3078c0,14.2707,7.575,20.4254,21.237,20.4254Z" />
              <path d="M332.995,24.4527c0-13.2562-7.237-23.46884-25.633-23.46884h-19.682v46.93774h19.682c18.396,0,25.633-10.2127,25.633-23.4689Zm-13.391,0c0,9.2658-5.208,12.7152-12.445,12.7152h-6.696V11.7376h6.696c7.237,0,12.445,3.4493,12.445,12.7151Z" />
              <path d="M335.904,47.9216h12.783V.98386h-12.783V47.9216Z" />
              <path d="M401.23099,24.4527c0-14.60884-9.063-24.28044-24.619-24.28044s-24.619,9.6716-24.619,24.28044,9.063,24.2805,24.619,24.2805,24.619-9.6716,24.619-24.2805Zm-13.46,0c0,7.8455-4.26,13.5944-11.159,13.5944s-11.16-5.7489-11.16-13.5944,4.261-13.5943,11.16-13.5943,11.159,5.7488,11.159,13.5943Z" />
              <path d="M128.905,30.638h10.415c-1.217,4.802-5.749,7.5074-11.227,7.5074-7.169,0-11.904-5.2754-11.904-13.8649,0-7.8455,4.329-13.5944,11.769-13.5944,4.464,0,8.319,1.8938,9.401,6.1547h13.594c-1.488-10.686-10.889-16.841-23.266-16.841-15.759,0-24.957,9.672-24.957,24.281,0,14.677,9.469,24.281,22.184,24.281,7.237,0,11.768-2.705,14.88-6.561v5.749h11.294V21.3046h-22.183v9.3334Z" />
              <path d="M30.4351,61.1758h-10.4155L0,116.838H10.3479L30.4351,61.1758Z" />
            </svg>
          </div>
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
