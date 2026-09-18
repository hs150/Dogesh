import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

function Dog({ matcapIndex }) {
  const { animations, scene } = useGLTF('/models/dog.drc.glb')
  const textures = useTexture(texturePaths)
  const [dogNormal, branchDiffuse, branchNormal] = textures
  const matcaps = useMemo(() => textures.slice(3), [textures])
  const initialMatcap = matcaps[1]
  const transition = useRef({
    uMatcapTexture1: { value: initialMatcap },
    uMatcapTexture2: { value: initialMatcap },
    uProgress: { value: 1 },
  })

  const materials = useMemo(() => {
    const dogNormalTexture = copyTexture(dogNormal, THREE.NoColorSpace)
    const branchNormalTexture = copyTexture(branchNormal, THREE.NoColorSpace)
    const branchTexture = copyTexture(branchDiffuse, THREE.SRGBColorSpace)
    const dogMatcap = copyTexture(initialMatcap, THREE.SRGBColorSpace)
    const branchMatcap = copyTexture(matcaps[18], THREE.SRGBColorSpace)
    const dog = new THREE.MeshMatcapMaterial({ matcap: dogMatcap, normalMap: dogNormalTexture })
    dog.onBeforeCompile = (shader) => {
      shader.uniforms.uMatcapTexture1 = transition.current.uMatcapTexture1
      shader.uniforms.uMatcapTexture2 = transition.current.uMatcapTexture2
      shader.uniforms.uProgress = transition.current.uProgress
      shader.fragmentShader = shader.fragmentShader.replace('void main() {', `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;
        void main() {
      `)
      shader.fragmentShader = shader.fragmentShader.replace('vec4 matcapColor = texture2D( matcap, uv );', `
        vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
        vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
        float transitionFactor = 0.2;
        float progress = smoothstep(uProgress - transitionFactor, uProgress, (vViewPosition.x + vViewPosition.y) * 0.5 + 0.5);
        vec4 matcapColor = mix(matcapColor2, matcapColor1, progress);
      `)
    }
    return {
      dog,
      branches: new THREE.MeshMatcapMaterial({ map: branchTexture, matcap: branchMatcap, normalMap: branchNormalTexture }),
    }
  }, [branchDiffuse, branchNormal, dogNormal, initialMatcap, matcaps])

  const model = useMemo(() => {
    const cloned = scene.clone(true)
    // Frame the visible geometry inside the hero's central content area.
    cloned.position.set(0.18, -0.55, 0)
    cloned.scale.setScalar(0.7)
    cloned.rotation.set(0, Math.PI / 3.9, 0)
    cloned.traverse((child) => {
      if (!child.isMesh) return
      child.material = child.name.includes('DOG') ? materials.dog : materials.branches
    })
    return cloned
  }, [materials, scene])
  const { actions } = useAnimations(animations, model)

  useEffect(() => {
    const animation = actions['Take 001'] ?? Object.values(actions)[0]
    animation?.reset().play()
    return () => animation?.stop()
  }, [actions])

  useEffect(() => {
    const nextMatcap = matcaps[Math.max(0, Math.min(matcapIndex - 1, matcaps.length - 1))]
    if (!nextMatcap || transition.current.uMatcapTexture2.value === nextMatcap) return
    gsap.killTweensOf(transition.current.uProgress)
    transition.current.uMatcapTexture1.value = nextMatcap
    gsap.fromTo(transition.current.uProgress, { value: 1 }, {
      value: 0,
      duration: 0.3,
      onComplete: () => {
        transition.current.uMatcapTexture2.value = nextMatcap
        transition.current.uProgress.value = 1
      },
    })
  }, [matcapIndex, matcaps])

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#section-1',
        endTrigger: '#section-3',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    timeline
      .to(model.position, { z: '-=0.75', y: '+=0.1' })
      .to(model.rotation, { x: `+=${Math.PI / 15}` })
      .to(model.rotation, { y: `-=${Math.PI * 2}`, duration: 3, ease: 'none' }, 0)
      .to(model.position, { z: '+=0.6', y: '-=0.05' }, 'third')
  }, { dependencies: [model], revertOnUpdate: true })

  useEffect(() => () => {
    materials.dog.dispose()
    materials.branches.dispose()
  }, [materials])

  return <primitive object={model} />
}

useGLTF.preload('/models/dog.drc.glb')
export default Dog
