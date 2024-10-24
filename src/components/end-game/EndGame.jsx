import { motion } from 'framer-motion';
import styles from './EndGame.module.scss';
import { baseVariants, pageTransition } from '../../core/animation';
import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { useGameStateContext } from '../../provider/GameStateProvider';
import { useDirectionContext } from '../../provider/DirectionProvider';
import { GAME_PHASES } from '../../utils/constants';
import Button from '../button/Button';

function EndGame({ className, ...props }) {
  const { player1, player2 } = useDirectionContext();
<<<<<<< HEAD
  const { newScore, setCurrentPhase } = useGameStateContext();
=======
  const { newScore, setCurrentPhase, setNewScore, setChrisUltPercentage,setMissyUltPercentage } = useGameStateContext();
>>>>>>> 4ff7a7888063a59f968e3aecdcbf636e4ed2f9cd

  const handleKeyDown = (event) => {
    if (event.key === 'a') {
      setCurrentPhase(GAME_PHASES.START);
<<<<<<< HEAD
=======
      setChrisUltPercentage(0)
      setMissyUltPercentage(0)
      setNewScore(0.5)
>>>>>>> 4ff7a7888063a59f968e3aecdcbf636e4ed2f9cd
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
      return '/images/end/chris-win.png';
    } else {
      return '/images/end/missy-win.png';
    }
  }, [newScore]);

  return (
    <motion.div className={classNames(styles.wrapper, className)} {...baseVariants} {...pageTransition} {...props}>
      <img className={styles.image} src={imageUrl} alt="End game" />
      <Button text="rejouer" icon='axis_a' color="#000" className={styles.skip} />
    </motion.div>
  );
}

export default EndGame;
