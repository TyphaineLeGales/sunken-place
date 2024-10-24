import { useEffect } from 'react';
import styles from './Intro.module.scss';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import { useDirectionContext } from '../../provider/DirectionProvider';
import { useGameStateContext } from '../../provider/GameStateProvider';

import { GAME_PHASES } from '../../utils/constants';
import { baseVariants, pageTransition } from '../../core/animation';

function Intro({ className, ...props }) {
  const { player1, player2 } = useDirectionContext();
  const { setCurrentPhase } = useGameStateContext();

  const handlePhaseEnd = (event) => {
    if (event.key === 'a') {
      setCurrentPhase(GAME_PHASES.TUTORIAL);
    }
  };
  useEffect(() => {
    player1.addEventListener('keydown', handlePhaseEnd);
    player2.addEventListener('keydown', handlePhaseEnd);

    return () => {
      player1.removeEventListener('keydown', handlePhaseEnd);
      player2.removeEventListener('keydown', handlePhaseEnd);
    };
  }, []);

  const handleVideoEnd = () => {
    setCurrentPhase(GAME_PHASES.TUTORIAL);
  };

  return (
    <motion.div className={classNames(styles.wrapper, className)} {...baseVariants} {...pageTransition} {...props}>
      <video
        className={styles.video}
        src="/video/intro-compressed.mp4"
        autoPlay
        onEnded={handleVideoEnd}
        loop={false}
      />
    </motion.div>
  );
}

export default Intro;
