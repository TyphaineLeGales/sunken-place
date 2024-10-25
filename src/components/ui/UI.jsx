import React, { useMemo, useEffect } from 'react';
import styles from './UI.module.scss';
import classNames from 'classnames';
import Menu from '../menu/Menu';
import { useGameStateContext } from '../../provider/GameStateProvider';
import { GAME_PHASES } from '../../utils/constants';
import Intro from '../intro/Intro';
import Tutorial from '../tutorial/Tutorial';
import { AnimatePresence } from 'framer-motion';
import ProgressBar from '../progress/Progress';
import { useAudioContext } from '../../provider/AudioProvider';
import EndGame from '../end-game/EndGame';

function UI({ className, ...props }) {
  const { currentPhase } = useGameStateContext();
  const { playSound, stopSound, setVolume } = useAudioContext();

  useEffect(() => {

    if (currentPhase === GAME_PHASES.GAME) {
      playSound('ambiance', 'background', true);
      setVolume('ambiance', 'background', 0.5);
    } else if (currentPhase === GAME_PHASES.END) {
      stopSound('ambiance', 'background');
      playSound('ambiance', 'end');
    }
  }, [currentPhase, playSound, stopSound]);

  const linkBorder = useMemo(() => {
    if (currentPhase === GAME_PHASES.GAME) {
      return '/images/border-game.svg';
    } else {
      return '/images/border.svg';
    }
  }, [currentPhase]);

  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.backgroud]: currentPhase !== GAME_PHASES.GAME,
      })}
    >
      <img className={styles.border} src={linkBorder} />
      
        {currentPhase === GAME_PHASES.MENU || (currentPhase === GAME_PHASES.START && <Menu key="menu" />)}
        {currentPhase === GAME_PHASES.INTRO && <Intro key="intro" />}
        {currentPhase === GAME_PHASES.TUTORIAL && <Tutorial key="tuto" />}
        {currentPhase === GAME_PHASES.GAME && <ProgressBar key="progressBar" />}
        {currentPhase === GAME_PHASES.END && <EndGame key="endgame" />}
      
    </div>
  );
}

export default UI;
