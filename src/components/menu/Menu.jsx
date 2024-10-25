import classNames from 'classnames';
import styles from './Menu.module.scss';
import { useGameStateContext } from '../../provider/GameStateProvider';
import { useDirectionContext } from '../../provider/DirectionProvider';
import { useEffect } from 'react';
import { GAME_PHASES } from '../../utils/constants';
import Icons from '../icons/Icons';
import UnderLineText from '../underline-text/UnderLine';
import { motion } from 'framer-motion';
import { baseVariants, pageTransition } from '../../core/animation';

function Menu({ className, ...props }) {
  const { setCurrentPhase, setNewScore } = useGameStateContext();
  const { player1, player2, setChrisUltPercentage, setMissyUltPercentage } = useDirectionContext();

  const linkLogo = '/images/logo.svg';

  const changePhase = (event) => {
    if (event.key === 's') {
      setCurrentPhase(GAME_PHASES.INTRO);
      setChrisUltPercentage(0)
      setMissyUltPercentage(0)
      setNewScore(0.5)
    }
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
      <img className={styles.img} src={linkLogo} alt="logo" />

      <UnderLineText
        className={styles.textContainer}
        text1="Appuyer sur"
        text2="pour continuer"
        icon={<Icons id="axis_s" />}
        underlineColor="#ffffff"
      />
    </motion.div>
  );
}

export default Menu;
