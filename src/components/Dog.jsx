import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'


const Dog = () => {
    
   const model = useGLTF("/public/model/dog.drc.glb")
   
   useThree(({camera,scene,gl})=>{
        camera.position.z=0.8
   })  

  return (
  <>
     <primitive position={[0.1,-0.38,0]} rotation={[0 , Math.PI/3.7 ,0]} object={model.scene} />
     <directionalLight position={[0, 5, 5]} intensity={10} />
     <OrbitControls />
  </>
  
  )
}

export default Dog
