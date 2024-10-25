import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './PlayerSelection.module.scss';
import UnderLineText from '../underline-text/UnderLine';
import Icons from '../icons/Icons';
import Axis from 'axis-api';
import PlayerCursor from '../playerCursor/PlayerCursor';
import { useDirectionContext } from '../../provider/DirectionProvider';
import { useGameStateContext } from '../../provider/GameStateProvider';
import { GAME_PHASES } from '../../utils/constants';
import { baseVariants, pageTransition } from '../../core/animation';
import { motion } from 'framer-motion';

function PlayerSelection({ className, ...props }) {
  const [selectedPlayer1, setSelectedPlayer1] = useState('Missy');
  const [selectedPlayer2, setSelectedPlayer2] = useState('Chris');
  const joystickThreshold = 0.5;

  const { player1, player2 } = useDirectionContext();
  const { setCurrentPhase } = useGameStateContext();

  const handleJoystickMove = (setSelectedPlayer) => (event) => {
    // not working correctly
    const { x } = event.position;

    if (Math.abs(x) > joystickThreshold) {
      setSelectedPlayer((prev) => {
        if (x < joystickThreshold) {
          return 'Missy';
        } else if (x > -joystickThreshold) {
          return 'Chris';
        }
      });
    }
  };

  useEffect(() => {
    const joystick1Handler = handleJoystickMove(setSelectedPlayer1);
    const joystick2Handler = handleJoystickMove(setSelectedPlayer2);

    Axis.joystick1.addEventListener('joystick:move', joystick1Handler);
    Axis.joystick2.addEventListener('joystick:move', joystick2Handler);
    player1.addEventListener('keydown', handleButtonPress);
    player2.addEventListener('keydown', handleButtonPress);

    return () => {
      Axis.joystick1.removeEventListener('joystick:move', joystick1Handler);
      Axis.joystick2.removeEventListener('joystick:move', joystick2Handler);
      player1.removeEventListener('keydown', handleButtonPress);
      player2.removeEventListener('keydown', handleButtonPress);
    };
  }, []);

  const isSelectionValid = useMemo(() => selectedPlayer1 !== selectedPlayer2, [selectedPlayer1, selectedPlayer2]);

  const handleButtonPress = (event) => {
    if (event.key === 'a' && selectedPlayer1 !== selectedPlayer2) {
      console.log('createPlayers', selectedPlayer1, selectedPlayer2);
      setCurrentPhase(GAME_PHASES.INTRO);
    }
  };

  const renderPlayer = (player, selectedPlayer, opponentPlayer, cursorOutline) => (
    <div className={styles.player}>
      <div className={styles.playerCursor}>
        {selectedPlayer === player && <PlayerCursor player="I" outline={cursorOutline} />}
        {opponentPlayer === player && <PlayerCursor player="II" outline={cursorOutline} />}
      </div>
      <div className={styles.playerImg}>
        <img src={`/images/${player.toLowerCase()}.png`} alt={player} />
      </div>
      <div className={styles.playerName}>{player}</div>
    </div>
  );

  return (
    <motion.div className={classNames(styles.wrapper, className)} {...baseVariants} {...pageTransition} {...props}>
      <h1 className={styles.title}>Sélectionnez vos personnages</h1>
      <div className={styles.playersWrapper}>
        {renderPlayer('Missy', selectedPlayer1, selectedPlayer2, 'p1_outline')}
        {renderPlayer('Chris', selectedPlayer1, selectedPlayer2, 'p1_outline')}
      </div>
      <UnderLineText
        className={classNames(styles.textContainer, { [styles.valid]: isSelectionValid })}
        text1="Appuyez sur"
        text2="pour continuer"
        icon={<Icons id="axis_s" fill={isSelectionValid ? '#ffffff' : '#ae9e9c'} />}
        underlineColor={isSelectionValid ? '#ffffff' : '#ae9e9c'}
      />
    </motion.div>
  );
}

export default React.memo(PlayerSelection);
