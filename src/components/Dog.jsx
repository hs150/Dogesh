import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useAnimations, useGLTF, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MATCAP_PATHS = Array.from(
  { length: 20 },
  (_, index) => `/matcap/mat-${index + 1}.png`,
)

const TEXTURE_PATHS = [
  '/dog_normals.jpg',
  '/branches_diffuse.jpeg',
  '/branches_normals.jpeg',
  ...MATCAP_PATHS,
]

const INITIAL_ROTATION_Y = Math.PI / 3.9

function cloneTexture(source, colorSpace) {
  const texture = source.clone()
  texture.colorSpace = colorSpace
  texture.needsUpdate = true
  return texture
}

function Dog({ matcapIndex }) {
  const dogRef = useRef()

  const transition = useRef({
    from: { value: null },
    to: { value: null },
    progress: { value: 1 },
  })

  const { scene, animations } = useGLTF('/models/dog.drc.glb')

  const textures = useTexture(TEXTURE_PATHS)

  const [dogNormal, branchDiffuse, branchNormal] = textures

  const matcaps = useMemo(
    () => textures.slice(3),
    [textures],
  )

  const transitionMatcaps = useMemo(
    () =>
      matcaps.map((matcap) =>
        cloneTexture(matcap, THREE.SRGBColorSpace),
      ),
    [matcaps],
  )

  const materials = useMemo(() => {
    const dogNormalMap = cloneTexture(
      dogNormal,
      THREE.NoColorSpace,
    )

    dogNormalMap.flipY = false
    dogNormalMap.needsUpdate = true

    const branchMap = cloneTexture(
      branchDiffuse,
      THREE.SRGBColorSpace,
    )

    const branchNormalMap = cloneTexture(
      branchNormal,
      THREE.NoColorSpace,
    )

    const dogMaterial = new THREE.MeshMatcapMaterial({
      matcap: transitionMatcaps[1],
      normalMap: dogNormalMap,
    })

    dogMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uMatcapFrom =
        transition.current.from

      shader.uniforms.uMatcapTo =
        transition.current.to

      shader.uniforms.uMatcapProgress =
        transition.current.progress

      shader.fragmentShader =
        shader.fragmentShader.replace(
          'void main() {',
          `
          uniform sampler2D uMatcapFrom;
          uniform sampler2D uMatcapTo;
          uniform float uMatcapProgress;

          void main() {
          `,
        )

      shader.fragmentShader =
        shader.fragmentShader.replace(
          'vec4 matcapColor = texture2D( matcap, uv );',
          `
          vec4 matcapFrom =
            texture2D(uMatcapFrom, uv);

          vec4 matcapTo =
            texture2D(uMatcapTo, uv);

          float edge = smoothstep(
            uMatcapProgress - 0.2,
            uMatcapProgress,
            (vViewPosition.x + vViewPosition.y)
              * 0.5
              + 0.5
          );

          vec4 matcapColor =
            mix(matcapTo, matcapFrom, edge);
          `,
        )
    }

    const branchMaterial =
      new THREE.MeshMatcapMaterial({
        map: branchMap,
        matcap: transitionMatcaps[18],
        normalMap: branchNormalMap,
      })

    return {
      dog: dogMaterial,
      branches: branchMaterial,
      textures: [
        dogNormalMap,
        branchMap,
        branchNormalMap,
      ],
    }
  }, [
    dogNormal,
    branchDiffuse,
    branchNormal,
    transitionMatcaps,
  ])

  useMemo(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return

      child.material = child.name.includes('DOG')
        ? materials.dog
        : materials.branches

      child.frustumCulled = false
    })

    return scene
  }, [scene, materials])

  const { actions } = useAnimations(
    animations,
    scene,
  )

  useEffect(() => {
    const action =
      actions['Take 001'] ??
      Object.values(actions)[0]

    action
      ?.reset()
      .fadeIn(0.2)
      .play()

    return () => {
      action?.fadeOut(0.15)
    }
  }, [actions])

  useEffect(() => {
    const initialMatcap =
      transitionMatcaps[1]

    if (!initialMatcap) return

    transition.current.from.value =
      initialMatcap

    transition.current.to.value =
      initialMatcap

    transition.current.progress.value = 1
  }, [transitionMatcaps])

  useEffect(() => {
    const index = Math.max(
      0,
      Math.min(
        matcapIndex - 1,
        transitionMatcaps.length - 1,
      ),
    )

    const nextMatcap =
      transitionMatcaps[index]

    if (
      !nextMatcap ||
      transition.current.to.value === nextMatcap
    ) {
      return
    }

    const uniforms = transition.current

    gsap.killTweensOf(
      uniforms.progress,
    )

    uniforms.from.value =
      nextMatcap

    gsap.fromTo(
      uniforms.progress,
      { value: 1 },
      {
        value: 0,
        duration: 0.3,

        onComplete: () => {
          uniforms.to.value =
            nextMatcap

          uniforms.progress.value = 1
        },
      },
    )
  }, [
    matcapIndex,
    transitionMatcaps,
  ])

  useLayoutEffect(() => {
    const target = dogRef.current

    if (!target) return

    // ================================================
    // WOLF POSITION
    // ================================================

    target.position.set(
      0,
      -0.15,
      0,
    )

    target.rotation.set(
      0,
      INITIAL_ROTATION_Y,
      0,
    )

    target.scale.setScalar(0.42)

    // ================================================
    // SCROLL ANIMATION
    // ================================================

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
      .to(
        target.position,
        {
          z: -0.25,
          y: -0.05,
          duration: 1,
        },
        0,
      )
      .to(
        target.rotation,
        {
          x: Math.PI / 15,
          duration: 1,
        },
        0,
      )
      .to(
        target.rotation,
        {
          y: INITIAL_ROTATION_Y - Math.PI,
          duration: 1,
        },
        'third',
      )
      .to(
        target.position,
        {
          x: -0.35,
          z: 0.05,
          y: -0.1,
          duration: 1,
        },
        'third',
      )

    ScrollTrigger.refresh()

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
  }, [])

  return (
    <primitive
      ref={dogRef}
      object={scene}
    />
  )
}

useGLTF.preload(
  '/models/dog.drc.glb',
)

export default Dog
