import { useThree, extend,  } from '@react-three/fiber'

import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import backgroundVert from './BackgroundShader/background.vert?raw'
import backgroundFrag from './BackgroundShader/background.frag?raw'
import { shaderMaterial } from '@react-three/drei'
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { log } from 'three/examples/jsm/nodes/Nodes.js'
import { GUI } from 'dat.gui'
import { useGameStateContext } from '../../provider/GameStateProvider';



const BackgroundMaterial = shaderMaterial(
  {
    uTime:0,
    uTexture1:null,
    uTexture2:null,
    uScore:0,
    uProgress: 0, 
    uResolution: new THREE.Vector2(0, 0)
  },
  backgroundVert,
  backgroundFrag
)

extend({BackgroundMaterial})

const Background = () => {
  const {
    newScore
  } = useGameStateContext();
  const bgTex = useLoader(TextureLoader, '/images/aquarelleTexture.png')
  const dispTex = useLoader(TextureLoader, '/images/dispTex.png')
  const progressRef = useRef(0.5);
  const prevProgressRef = useRef(0.5);
  const materialRef = useRef();
  const { gl, size } = useThree();
  const pixelRatio = gl.getPixelRatio();
  const resolution = useRef(new THREE.Vector2(size.width * pixelRatio, size.height * pixelRatio))

  const params = {
    progress: 0.5
  }
  // TODO - should only create texture once and not on every rerender og component

  const {viewport} = useThree()

  // UseFrame to update the shader's uniform on each frame
  useFrame((state) => {
    if (materialRef.current) {
      prevProgressRef.current = THREE.MathUtils.lerp(
        prevProgressRef.current,
        progressRef.current,
        0.05 // Adjust the interpolation speed as needed
      );
      materialRef.current.uniforms.uProgress.value = 1 - prevProgressRef.current;
    }
  });

  useEffect(() => {
    prevProgressRef.current = progressRef.current
    progressRef.current = newScore
  }, [newScore])


  return (
    <mesh
        position-z={-0.2}
    >
        <planeGeometry args={[viewport.width,viewport.height]}/>
        <backgroundMaterial 
          ref={materialRef} 
          uTime={0}
          uTexture1={bgTex}
          uTexture2={dispTex}
          uScore={0}
          uProgress={progressRef.current}
          uResolution={resolution.current}
          needsUpdate={true}
        /> 
    </mesh>
  )
}

export default Background