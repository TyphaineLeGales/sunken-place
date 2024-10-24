import classNames from 'classnames';
import styles from './Progress.module.scss';
import { useGameStateContext } from '../../provider/GameStateProvider';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { baseVariants, pageTransition } from '../../core/animation';
import Icons from '../icons/Icons';
import { GAME_PHASES } from '../../utils/constants';

function ProgressBar({ className, ...props }) {
  const {
    chrisScore,
    missyScore,
    maxPossibleScore,
    setChrisProgressScore,
    setCurrentPhase,
    newScore
  } = useGameStateContext();
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


    if (chrisScore >= maxPossibleScore || missyScore >= maxPossibleScore) {
      //setCurrentPhase(GAME_PHASES.END);
    }
  }, [chrisScore, missyScore]);

  useEffect(() => {
    console.log(newScore)
    if (newScore <= 0 || newScore >= 1) {
      setCurrentPhase(GAME_PHASES.END)
    }
  }, [newScore])

  const ProgressMotif = () => {
    return (
      <svg width="346" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#a)" fill="#000">
          <path d="m160.6 3-16.2 27c-.7 1.3 1.3 2.5 2 1.2l16.2-27c.8-1.3-1.2-2.5-2-1.2ZM182.5-11a496.6 496.6 0 0 0-27 41.8c-.7 1.3 1.3 2.4 2 1.1a497.3 497.3 0 0 1 27-41.8c.9-1.2-1.1-2.4-2-1.2ZM195.6-17c1-1.3-1.1-2.4-2-1.2a542.4 542.4 0 0 0-33 51.6c-.7 1.3 1.3 2.5 2 1.2a556.6 556.6 0 0 1 33-51.6ZM206.2-7.6A559.7 559.7 0 0 0 171.5 37c-.8 1.2 1.2 2.4 2 1.2C184.2 22.9 195.7 8.2 208-6c1-1.2-.7-2.8-1.7-1.7ZM213-10.2l-31.8 46.6c-.9 1.2 1.2 2.4 2 1.2L215-9.1c.9-1.2-1.1-2.4-2-1.1ZM231.7-15.5c.8-1.3-1.2-2.5-2-1.2A461 461 0 0 1 194.5 32c-1 1.2.7 2.8 1.7 1.7a451.2 451.2 0 0 0 35.5-49.2ZM237.2-.7c.9-1.2-1.2-2.4-2-1.2a305.6 305.6 0 0 1-35.8 41.5c-1.1 1 .5 2.7 1.6 1.6a299.3 299.3 0 0 0 36.2-42ZM238.5 2.5c-8.9 14-18.8 27.3-29.8 39.7-1 1.2.7 2.8 1.7 1.7a316 316 0 0 0 30.1-40.2c.8-1.3-1.2-2.4-2-1.2ZM245.5 2.4c-7.4 11.7-15.2 23-23.6 34-.9 1.2 1.2 2.3 2 1.2 8.4-11 16.3-22.3 23.6-34 .8-1.3-1.3-2.4-2-1.2ZM258.9 1.4c-9 11.9-18.7 23.2-29.3 33.7-1 1 .6 2.7 1.7 1.6a307.7 307.7 0 0 0 29.6-34.2c.9-1.2-1.2-2.3-2-1.1ZM346.3-.4a497.3 497.3 0 0 1-27 41.9c-.9 1.2 1.1 2.4 2 1.2a496.6 496.6 0 0 0 27-41.9c.7-1.3-1.3-2.5-2-1.2ZM340.3-4c.8-1.4-1.2-2.6-2-1.2a555.8 555.8 0 0 1-33 51.6c-.9 1.2 1.2 2.4 2 1.1a542 542 0 0 0 33-51.6ZM332.8-6.6a553.9 553.9 0 0 1-34.3 44.1c-1 1.2.6 2.8 1.6 1.7a559.7 559.7 0 0 0 34.7-44.6c.9-1.2-1.2-2.4-2-1.2ZM323.1-6l-31.8 46.6c-.9 1.3 1.1 2.4 2 1.2L325-4.8c.9-1.2-1.1-2.4-2-1.2ZM311.8-.4c1-1.2-.7-2.8-1.6-1.7a451 451 0 0 0-35.6 49.2c-.8 1.3 1.2 2.5 2 1.2A461 461 0 0 1 311.8-.4ZM307-8c1-1-.6-2.7-1.7-1.6a299.3 299.3 0 0 0-36.2 42c-.8 1.1 1.2 2.3 2 1A305.5 305.5 0 0 1 307-8ZM289.8-4.7a316 316 0 0 0-30.2 40.2c-.8 1.3 1.2 2.4 2 1.2 9-14 18.8-27.3 29.8-39.7 1-1.1-.6-2.8-1.6-1.7ZM276-1.4c-8.4 10.9-16.2 22.2-23.5 33.9-.8 1.3 1.2 2.5 2 1.2A439 439 0 0 1 278-.3c1-1.2-1-2.3-2-1.1ZM276.2-6.5a331.5 331.5 0 0 0-31.9 36.9c-.9 1.2 1.2 2.3 2 1.1a327 327 0 0 1 31.5-36.3c1-1-.6-2.7-1.6-1.7ZM27.6-4.5 35-16.1c.8-1.2-1.2-2.4-2-1.1A461 461 0 0 1-2.1 31.5c-1 1.1.7 2.8 1.6 1.6 10-12 19.4-24.6 28-37.6ZM37-2.8C38-4.1 36-5.2 35-4A305.3 305.3 0 0 1-.8 37.5c-1 1 .6 2.6 1.7 1.6A299.3 299.3 0 0 0 37-2.9ZM38.4.4c-9 14-18.8 27.3-29.8 39.7-1 1.1.6 2.8 1.6 1.7A316 316 0 0 0 40.4 1.6c.8-1.3-1.2-2.5-2-1.2ZM45.3.3c-7.3 11.7-15.1 23-23.5 34-1 1.2 1 2.3 2 1.1a440 440 0 0 0 23.5-34c.8-1.2-1.2-2.4-2-1ZM58.7-.8A304 304 0 0 1 29.5 33c-1 1 .6 2.7 1.6 1.6A307.8 307.8 0 0 0 60.7.4c1-1.2-1.1-2.4-2-1.2ZM149 9.5l-16.2 27c-.8 1.3 1.2 2.5 2 1.2l16.2-27c.8-1.4-1.2-2.5-2-1.2ZM148.6-2.5a497.3 497.3 0 0 1-27 41.9c-.8 1.2 1.2 2.3 2 1.1a496.6 496.6 0 0 0 27-41.8c.8-1.3-1.2-2.5-2-1.2ZM143.3-4.1c.7-1.3-1.3-2.5-2-1.2a556.9 556.9 0 0 1-33 51.6c-1 1.2 1 2.4 2 1.2a542.4 542.4 0 0 0 33-51.6ZM132.6-8.7a554.5 554.5 0 0 1-34.3 44.1c-1 1.1.7 2.8 1.6 1.7a559.7 559.7 0 0 0 34.7-44.6c.9-1.2-1.1-2.4-2-1.2ZM123-8.1 91 38.5c-.8 1.3 1.2 2.4 2 1.2L125-7c.8-1.3-1.2-2.4-2-1.2ZM111.6-2.6c1-1.1-.6-2.8-1.6-1.6A451.3 451.3 0 0 0 74.4 45c-.8 1.3 1.3 2.4 2 1.2a460.8 460.8 0 0 1 35.2-48.8ZM106.8-10.1c1-1-.6-2.7-1.7-1.7a299.4 299.4 0 0 0-36.1 42c-1 1.2 1.1 2.4 2 1.2a305.3 305.3 0 0 1 35.8-41.5ZM89.6-6.8a316 316 0 0 0-30.1 40.2c-.8 1.2 1.2 2.4 2 1.2 8.9-14 18.8-27.4 29.8-39.7 1-1.2-.7-2.8-1.7-1.7ZM75.8-3.6a440 440 0 0 0-23.5 34c-.8 1.3 1.3 2.4 2 1.2 7.4-11.7 15.2-23 23.6-34 .9-1.2-1.1-2.3-2-1.2ZM76-8.6a331.4 331.4 0 0 0-31.8 36.8c-1 1.2 1 2.4 2 1.2A327 327 0 0 1 77.6-6.9c1.1-1-.5-2.7-1.6-1.7Z" />
        </g>
      </svg>
    );
  };

  return (
    <motion.div
      ref={ref}
      className={classNames(styles.wrapper, className)}
      style={{ '--progress': progress }}
      {...baseVariants}
      {...pageTransition}
    >
      <div className={classNames(styles.wrapperProgress, className)}>
        <Icons id="missy_initial" />
        <div className={styles.progress}>
          <div className={classNames(styles.motif, className)}>
            <ProgressMotif />
          </div>
        </div>
        <Icons id="chris_initial" />
      </div>
    </motion.div>
  );
}

export default ProgressBar;
