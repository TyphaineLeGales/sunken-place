import classNames from 'classnames';
import styles from './Progress.module.scss';
import { useGameStateContext } from '../../provider/GameStateProvider';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { baseVariants, pageTransition } from '../../core/animation';
import Icons from '../icons/Icons';
import { GAME_PHASES } from '../../utils/constants';
import { useDirectionContext } from '../../provider/DirectionProvider';

function ProgressBar({ className, ...props }) {
  const {
    chrisScore,
    missyScore,
    maxPossibleScore,
    setChrisProgressScore,
    setCurrentPhase,
    newScore
  } = useGameStateContext();
  const { chrisUltPercentage, missyUltPercentage } = useDirectionContext()

  const [chrisAngle, setChrisAngle] = useState(0);
  const [missyAngle, setMissyAngle] = useState(0);

  const ref = useRef(null);

  const progressValue = useMemo(() => {
    const totalScore = chrisScore + missyScore;
    if (totalScore === 0) return 0.5;

    const chrisProgress = chrisScore / maxPossibleScore;
    const missyProgress = missyScore / maxPossibleScore;

    const normalizedProgress = chrisProgress / (chrisProgress + missyProgress);

    const progress = 0.5 + (normalizedProgress - 0.5) * (totalScore / maxPossibleScore);

    return progress;
  }, [chrisScore, missyScore]);

  const progress = useMemo(() => {
    return newScore;
  }, [newScore]);

  useEffect(() => {
    setChrisProgressScore(progressValue);
  }, [progressValue]);

  useEffect(() => {
    const newAngle = (chrisUltPercentage / 100) * 360;
    setChrisAngle(newAngle);
  }, [chrisUltPercentage]);

  useEffect(() => {
    const newAngle = (missyUltPercentage / 100) * 360;
    setMissyAngle(newAngle);
  }, [missyUltPercentage]);

  useEffect(() => {
    if (newScore <= 0 || newScore >= 1) {
      setCurrentPhase(GAME_PHASES.END)
    }
  }, [newScore])

  return (
    <motion.div
      ref={ref}
      className={classNames(styles.wrapper, className)}
      style={{ '--progress': progress, '--chrisAngle': `${chrisAngle}deg`, '--missyAngle': `${missyAngle}deg` }}
      {...baseVariants}
      {...pageTransition}
    >
      <div className={classNames(styles.wrapperProgress, className)}>
        <div className={styles.playerWrapper}>
          <div className={classNames(styles.ultiBar, styles.chrisAngle)}></div>
          <Icons id="chris_initial" className={styles.playerIcon} />
        </div>
        <div className={styles.centerZone}>
          <div className={classNames(styles.backgroundProgress, className)}>
            <div className={styles.progress}>
              <div className={classNames(styles.motif, className)}>
              </div>
            </div>
          </div>
          <div className={styles.wrapperMark}>
            <div className={styles.mark}></div>
          </div>
        </div>
        <div className={styles.playerWrapper}>
          <div className={classNames(styles.ultiBar, styles.missyAngle)}></div>
          <Icons id="missy_initial" className={styles.playerIcon} />
        </div>
      </div>
    </motion.div>
  );
}

export default ProgressBar;
