import { useThree, extend,  } from '@react-three/fiber'

import React, {useEffect, useRef} from 'react'
import { Vector2 } from 'three';

import backgroundVert from './BackgroundShader/background.vert?raw'
import backgroundFrag from './BackgroundShader/background.frag?raw'
import { shaderMaterial } from '@react-three/drei'
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { log } from 'three/examples/jsm/nodes/Nodes.js'
import { GUI } from 'dat.gui'


const BackgroundMaterial = shaderMaterial(
  {
    uTime:0,
    uTexture1:null,
    uTexture2:null,
    uScore:0,
    uProgress: 0, 
    uResolution: new Vector2(0, 0)
  },
  backgroundVert,
  backgroundFrag
)

extend({BackgroundMaterial})

const Background = () => {
  const bgTex = useLoader(TextureLoader, '/images/aquarelleTexture.png')
  const dispTex = useLoader(TextureLoader, '/images/dispTex.png')
  const progressRef = useRef(1.0);
  const materialRef = useRef();
  const { gl, size } = useThree();
  const pixelRatio = gl.getPixelRatio();
  const resolution = useRef(new Vector2(size.width * pixelRatio, size.height * pixelRatio))
  const params = {
    progress: 1.0
  }

  // TODO - should only create texture once and not on every rerender og component

  const {viewport} = useThree()

  // UseFrame to update the shader's uniform on each frame
  useFrame(({ clock }) => {
    if (materialRef.current) {
      //materialRef.current.uTime = clock.getElapsedTime();
    }
  });

  useEffect(() => {
    const gui = new GUI()
    gui.add(params, 'progress', 0,1).onChange(value => {
      progressRef.current = value;
      materialRef.current.uniforms.uProgress.value = progressRef.current; 
    })
    return () => {
      gui.destroy()
    }
  }, [])


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