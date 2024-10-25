import classNames from 'classnames';
import styles from './Tutorial.module.scss';
import { useGameStateContext } from '../../provider/GameStateProvider';
import { useDirectionContext } from '../../provider/DirectionProvider';
import { useEffect } from 'react';
import { GAME_PHASES } from '../../utils/constants';
import Icons from '../icons/Icons';
import UnderLineText from '../underline-text/UnderLine';
import Button from '../button/Button';
import { motion } from 'framer-motion';
import { baseVariants, pageTransition } from '../../core/animation';

function Tutorial({ className, ...props }) {
  const { setCurrentPhase } = useGameStateContext();
  const { player1, player2 } = useDirectionContext();

  const linkLogo = '/images/logo.svg';

  const changePhase = (event) => {
    if (event.key === 's') setCurrentPhase(GAME_PHASES.GAME);
  };

  useEffect(() => {
    player1.addEventListener('keydown', changePhase);
    player2.addEventListener('keydown', changePhase);

    return () => {
      player1.removeEventListener('keydown', changePhase);
      player2.removeEventListener('keydown', changePhase);
    };
  }, []);

  return (
    <motion.div className={classNames(styles.wrapper, className)} {...baseVariants} {...pageTransition}>

      <video
        className={styles.video}
        src="/video/tutorial.mp4"
        autoPlay
        loop={false}
      />
      <Button text=" pour passer" icon='axis_s' color="#000" className={styles.buttonSkip} />

    </motion.div>
  );
}

export default Tutorial;
