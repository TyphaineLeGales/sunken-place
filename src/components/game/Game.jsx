import { OrbitControls} from '@react-three/drei';
import Missy from '../../blocks/Missy';
import { Perf } from 'r3f-perf';
import { Canvas } from '@react-three/fiber';
import Cottons from '../../blocks/Cottons';
import Camera from '../../blocks/Camera';
import Background from '../../blocks/Background/Background';
import NewChris from '../../blocks/NewChris';

function Game() {

  console.log("game rerender")

  return (
    <Canvas className="canvas">
      <Perf position="bottom-right" />
      <color attach="background" args={['#000000']} />
      <Background />
      <Camera />
      <OrbitControls />
      <Missy />
      <Cottons />
      <NewChris />
    </Canvas>
  );
}

export default Game;
