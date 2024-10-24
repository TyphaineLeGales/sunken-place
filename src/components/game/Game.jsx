import { OrbitControls} from '@react-three/drei';
import Missy from '../../blocks/Missy';
import { Perf } from 'r3f-perf';
import { Canvas } from '@react-three/fiber';
import Cottons from '../../blocks/Cottons';
import Camera from '../../blocks/Camera';
import Background from '../../blocks/Background/Background';
<<<<<<< HEAD
import Chris from '../../blocks/Chris';
=======
import NewChris from '../../blocks/NewChris';
import MissyWave from '../../blocks/MissyWave';
>>>>>>> 4ff7a7888063a59f968e3aecdcbf636e4ed2f9cd

function Game() {

  console.log("game rerender")

  return (
    <Canvas className="canvas">
      <Perf position="bottom-right" />
      <color attach="background" args={['#000000']} />
<<<<<<< HEAD
      <Background />
      <Camera />
      <OrbitControls />
      <Missy />
      <Cottons />
      <Chris />
=======
      <Suspense fallback={null}>
        <Background />
        <Camera />
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

        {
          <Missy />
        }
        {
          //<Chris />
        }



        {/* {
  <Waves />
} */}

        {
          <Cottons />
        }
        <NewChris />
        



      </Suspense>
>>>>>>> 4ff7a7888063a59f968e3aecdcbf636e4ed2f9cd
    </Canvas>
  );
}

export default Game;
