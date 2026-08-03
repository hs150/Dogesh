import './App.css'
import{ Canvas } from '@react-three/fiber'
import Dog from './components/Dog'
function App() {

  return (
   <>
   <Canvas>
    <Dog />
   </Canvas>
   </>
  )
}

export default App
