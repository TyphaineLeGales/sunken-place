import React from 'react';
import { Loader } from '@react-three/drei';
import { Leva } from 'leva';

import UI from './components/ui/UI';
import Game from './components/game/Game';
import { useGameStateContext } from './provider/GameStateProvider';
import { GAME_PHASES } from './utils/constants';

function Scene() {
  const { currentPhase } = useGameStateContext();

  return (
    <>
      {/* <Leva /> */}
      {/* <Loader /> */}
      <UI />
      {currentPhase === GAME_PHASES.GAME && <Game />}
    </>
  );
}

export default React.memo(Scene);
