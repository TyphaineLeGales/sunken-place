import { useThree, extend } from '@react-three/fiber'

import React from 'react'
import backgroundVert from './BackgroundShader/background.vert?raw'
import backgroundFrag from './BackgroundShader/background.frag?raw'
import { shaderMaterial } from '@react-three/drei'

const BackgroundMaterial = shaderMaterial(
  {
    uTime:0,
    uTexture1:null,
    uTexture2:null,
    uScore:0
  },
  backgroundVert,
  backgroundFrag
)

extend({BackgroundMaterial})

const Background = () => {

    const {viewport} = useThree()
  return (
    <mesh
        rotation-x={Math.PI*-0.5}
        position-y={-0.2}
    >
        <planeGeometry args={[viewport.width,viewport.height]}/>
        <backgroundMaterial 
          uTime={0}
          uTexture1={null}
          uTexture2={null}
          uScore={0}
        />
    </mesh>
  )
}

export default Background