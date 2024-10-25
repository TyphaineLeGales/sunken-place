import { useThree, extend,  } from '@react-three/fiber'

import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import backgroundVert from './BackgroundShader/background.vert?raw'
import backgroundFrag from './BackgroundShader/background.frag?raw'
import { shaderMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { useGameStateContext } from '../../provider/GameStateProvider';
import {useTextureContext} from '../../provider/TextureProvider';


const BackgroundMaterial = shaderMaterial(
  {
    uTexture1:null,
    uTexture2:null,
    uProgress: 0, 
  },
  backgroundVert,
  backgroundFrag
)

extend({BackgroundMaterial})

const Background = () => {
  const {
    newScore
  } = useGameStateContext();
  const { bgTex, dispTex } = useTextureContext(); 
  const progressRef = useRef(0.5);
  const prevProgressRef = useRef(0.5);
  const materialRef = useRef();
  const {viewport} = useThree()
  

  // UseFrame to update the shader's uniform on each frame
  useFrame((state) => {
    if (materialRef.current) {
      prevProgressRef.current = THREE.MathUtils.lerp(
        prevProgressRef.current,
        progressRef.current,
        0.05 // Adjust the interpolation speed as needed
      );
      materialRef.current.uniforms.uProgress.value = prevProgressRef.current;
    }
  });

  useEffect(() => {
    if(newScore >= 0.5) {
      prevProgressRef.current = progressRef.current
      progressRef.current = newScore
    } 
  }, [newScore])

  return (
    <mesh
        position-z={-0.2}
    >
        <planeGeometry args={[viewport.width,viewport.height]}/>
        <backgroundMaterial 
          ref={materialRef} 
          uTexture1={bgTex}
          uTexture2={dispTex}
          uProgress={progressRef.current}
          needsUpdate={true}
        /> 
    </mesh>
  )
}

export default Background