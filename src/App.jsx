import './App.css'
import{ Canvas } from '@react-three/fiber'
import Dog from './components/Dog'
function App() {

  return (
   <>
   <Canvas>
     // Implements the dog style
    <Dog />
   </Canvas>
   </>
  )
}

export default App
