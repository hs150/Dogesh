import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF, useTexture } from '@react-three/drei'

const texturePaths = [
  '/dog_normals.jpg',
  '/branches_diffuse.jpeg',
  '/branches_normals.jpeg',
  ...Array.from({ length: 20 }, (_, index) => `/matcap/mat-${index + 1}.png`),
]

function copyTexture(source, colorSpace) {
  const texture = source.clone()
  texture.colorSpace = colorSpace
  texture.needsUpdate = true
  return texture
}

function Dog({ matcapIndex, scrollProgress }) {
  const group = useRef()
  const { animations, scene } = useGLTF('/models/dog.drc.glb')
  const textures = useTexture(texturePaths)
  const [dogNormal, branchDiffuse, branchNormal] = textures
  const selectedMatcap = textures[Math.max(3, Math.min(matcapIndex + 2, textures.length - 1))]

  const materials = useMemo(() => {
    const dogNormalTexture = copyTexture(dogNormal, THREE.NoColorSpace)
    const branchNormalTexture = copyTexture(branchNormal, THREE.NoColorSpace)
    const branchTexture = copyTexture(branchDiffuse, THREE.SRGBColorSpace)
    const dogMatcap = copyTexture(selectedMatcap, THREE.SRGBColorSpace)
    const branchMatcap = copyTexture(textures[21], THREE.SRGBColorSpace)
    return {
      dog: new THREE.MeshMatcapMaterial({ matcap: dogMatcap, normalMap: dogNormalTexture }),
      branches: new THREE.MeshMatcapMaterial({ map: branchTexture, matcap: branchMatcap, normalMap: branchNormalTexture }),
    }
  }, [branchDiffuse, branchNormal, dogNormal, selectedMatcap, textures])

  const model = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (!child.isMesh) return
      child.material = child.name.toUpperCase().includes('DOG') ? materials.dog : materials.branches
      child.castShadow = true
      child.receiveShadow = true
    })
    return cloned
  }, [materials, scene])

  const { actions } = useAnimations(animations, model)

  useEffect(() => {
    const animation = actions['Take 001'] ?? Object.values(actions)[0]
    animation?.reset().fadeIn(0.35).play()
    return () => animation?.fadeOut(0.25)
  }, [actions])

  useEffect(() => () => {
    materials.dog.dispose()
    materials.branches.dispose()
  }, [materials])

  useFrame((_, delta) => {
    if (!group.current) return
    const progress = Math.min(1, Math.max(0, scrollProgress))
    const target = new THREE.Vector3(0.22 - progress * 0.5, -0.52 + progress * 0.06, -progress * 0.15)
    const smoothing = 1 - Math.exp(-delta * 4)
    group.current.position.lerp(target, smoothing)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, progress * (Math.PI / 15), smoothing)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.PI / 3.9 - progress * Math.PI, smoothing)
  })

  return <primitive ref={group} object={model} />
}

useGLTF.preload('/models/dog.drc.glb')
export default Dog
