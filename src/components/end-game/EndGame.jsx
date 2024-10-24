import { motion } from 'framer-motion';
import styles from './EndGame.module.scss';
import { baseVariants, pageTransition } from '../../core/animation';
import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { useGameStateContext } from '../../provider/GameStateProvider';
import { useDirectionContext } from '../../provider/DirectionProvider';
import { GAME_PHASES } from '../../utils/constants';

function EndGame({ className, ...props }) {
  const { player1, player2 } = useDirectionContext();
  const { newScore, setCurrentPhase, setNewScore, setChrisUltPercentage,setMissyUltPercentage } = useGameStateContext();

  const handleKeyDown = (event) => {
    if (event.key === 'a') {
      setCurrentPhase(GAME_PHASES.START);
      setChrisUltPercentage(0)
      setMissyUltPercentage(0)
      setNewScore(0.5)
    }
  };

  useEffect(() => {
    player1.addEventListener('keydown', handleKeyDown);
    player2.addEventListener('keydown', handleKeyDown);

    return () => {
      player1.removeEventListener('keydown', handleKeyDown);
      player2.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const imageUrl = useMemo(() => {
    if (newScore >= 1) {
      return '/images/chris-win.png';
    } else {
      return '/images/missy-win.png';
    }
  }, [newScore]);

  const linkSkipBtn = '/images/ui/start-again.png';

  return (
    <motion.div className={classNames(styles.wrapper, className)} {...baseVariants} {...pageTransition} {...props}>
      <img className={styles.image} src={imageUrl} alt="End game" />
      <img className={styles.skip} src={linkSkipBtn} alt="Skip" />
    </motion.div>
  );
}

export default EndGame;
