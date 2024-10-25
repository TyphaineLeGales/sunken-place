import { OrbitControls} from '@react-three/drei';
import Missy from '../../blocks/Missy';
import { Perf } from 'r3f-perf';
import { Canvas } from '@react-three/fiber';
import Cottons from '../../blocks/Cottons';
import Camera from '../../blocks/Camera';
import Background from '../../blocks/Background/Background';
import Chris from '../../blocks/Chris';

function Game() {


  return (
    <Canvas className="canvas">
      <Perf position="bottom-right" />
      <Background />
      <Camera />
      <OrbitControls />
      <Missy />
      <Cottons />
      <Chris />
    </Canvas>
  );
}

export default Game;
