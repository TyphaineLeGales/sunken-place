import { useThree, extend } from '@react-three/fiber'

import React from 'react'
import backgroundVert from './BackgroundShader/background.vert?raw'
import backgroundFrag from './BackgroundShader/background.frag?raw'
import { shaderMaterial } from '@react-three/drei'
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { log } from 'three/examples/jsm/nodes/Nodes.js'


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
  const bgTex = useLoader(TextureLoader, '/images/aquarelleTexture.png')
  console.log("bg tex", bgTex)

    const {viewport} = useThree()
  return (
    <mesh
        
        position-z={-0.2}
    >
        <planeGeometry args={[viewport.width,viewport.height]}/>
        <backgroundMaterial 
          uTime={0}
          uTexture1={bgTex}
          uTexture2={null}
          uScore={0}
        /> 
    </mesh>
  )
}

export default Background