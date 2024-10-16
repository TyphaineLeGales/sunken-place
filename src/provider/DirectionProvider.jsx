import React, { createContext, useContext, useState, useEffect } from 'react';
import Axis from 'axis-api';

let context = {};
const DirectionContext = createContext();

export function DirectionProvider({ children }) {
  const [direction, setDirection] = useState({ x: 0, y: 0 });

  const gamepadEmulator = Axis.createGamepadEmulator(0);
  Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator, 0);

  // Axis.registerGamepadEmulatorKeys(gamepadEmulator, 1, 'a', 1);
  // Axis.registerGamepadEmulatorKeys(gamepadEmulator, 0, 'x', 1);
  // Axis.registerGamepadEmulatorKeys(gamepadEmulator, 2, 'i', 1);
  // Axis.registerGamepadEmulatorKeys(gamepadEmulator, 3, 's', 1);

  const player1 = Axis.createPlayer({
    id: 1,
    joysticks: Axis.joystick1,
  });

  // Axis.joystick1

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'z': // Up
          setDirection((prev) => ({ ...prev, y: 1 }));
          break;
        case 's': // Down
          setDirection((prev) => ({ ...prev, y: -1 }));
          break;
        case 'q': // Left
          setDirection((prev) => ({ ...prev, x: -1 }));
          break;
        case 'd': // Right
          setDirection((prev) => ({ ...prev, x: 1 }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'z': // Stop Up
        case 's': // Stop Down
          setDirection((prev) => ({ ...prev, y: 0 }));
          break;
        case 'q': // Stop Left
        case 'd': // Stop Right
          setDirection((prev) => ({ ...prev, x: 0 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const normalizedDirection = {
    x: direction.x !== 0 ? direction.x / Math.abs(direction.x) : 0,
    y: direction.y !== 0 ? direction.y / Math.abs(direction.y) : 0,
  };

  context = {
    direction: normalizedDirection,
    player1,
    gamepadEmulator,
  };

  return <DirectionContext.Provider value={context}>{children}</DirectionContext.Provider>;
}

export function useDirectionContext() {
  const context = useContext(DirectionContext);
  if (!context) throw new Error('useDirectionContext must be used inside a `DirectionProvider`');
  return context;
}
