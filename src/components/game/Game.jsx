import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import Chris from '../../blocks/Chris';
import Missy from '../../blocks/Missy';
import { Perf } from 'r3f-perf';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import Waves from '../../blocks/Waves';
import Cottons from '../../blocks/Cottons';
import * as THREE from 'three'
import Camera from '../../blocks/Camera';
import Background from '../../blocks/Background/Background';

function Game() {




  return (
    <Canvas className="canvas">
      {/* <Perf position="bottom-right" /> */}
      
      <color attach="background" args={['#000000']} />
      <Suspense fallback={null}>
        <Background/>
        <Camera/>
        <OrbitControls />

        {/* <Grid
            args={[5, 5]}
            cellSize={0.5}
            cellThickness={1}
            cellColor={'#76492b'}
            sectionSize={2}
            sectionThickness={1.5}
            sectionColor={'#523622'}
            fadeDistance={50}
            fadeStrength={0.5}
            followCamera={false}
            infiniteGrid
          /> */}

        <Missy />
        <Chris />

        <Waves />

        <Cottons />

        
      </Suspense>
    </Canvas>
  );
}

export default Game;
