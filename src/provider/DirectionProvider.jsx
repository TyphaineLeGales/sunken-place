import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Axis from 'axis-api';

let context = {};
const DirectionContext = createContext();

export function DirectionProvider({ children }) {
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [chrisBox, setChrisBox] = useState()
  const isChrisInvincible = useRef(false)
  const [chrisPosition, setChrisPosition] = useState({ x: 0, z: 0 });
  const [chrisRotation, setChrisRotation] = useState(0);
  const [chrisMeshPosition, setChrisMeshPosition] = useState({ x: 0, z: 0 });
  const [missyPosition, setMissyPosition] = useState({ x: 0 });
  const [missyMeshPosition, setMissyMeshPosition] = useState({ x: 0 });
  const [controlledByPlayer, setControlledByPlayer] = useState(1); // Nouveau: qui contrôle Chris (1 ou 2)

  const [rotation, setRotation] = useState(0);

  const gamepadEmulator1 = Axis.createGamepadEmulator(0);
  const gamepadEmulator2 = Axis.createGamepadEmulator(1);

  Axis.registerKeys('o', 'a', 2);
  Axis.registerKeys('p', 'x', 2);
  Axis.registerKeys('w', 'w', 2);

  Axis.joystick1.setGamepadEmulatorJoystick(gamepadEmulator1, 0);
  Axis.joystick2.setGamepadEmulatorJoystick(gamepadEmulator2, 0);

  const buttonsPlayer1 = [
    Axis.registerKeys('z', 'i', 1),
    Axis.registerKeys('s', 's', 1),
    Axis.registerKeys('w', 'w', 1),
    Axis.registerKeys('a', 'a', 1),
    Axis.registerKeys('d', 'x', 1),
  ];

  // manette a = 0, b = 1, y = 2, x = 3
  Axis.registerGamepadEmulatorKeys(gamepadEmulator1, 0, 'a', 1); // Gamepad button index 0 (PS4 X) to button "a" from group 1
  Axis.registerGamepadEmulatorKeys(gamepadEmulator1, 1, 'x', 1); // Gamepad button index 1 (PS4 Square) to button "x" from group 1
  Axis.registerGamepadEmulatorKeys(gamepadEmulator1, 2, 'i', 1); // Gamepad button index 2 (PS4 Circle) to button "i" from group 1
  Axis.registerGamepadEmulatorKeys(gamepadEmulator1, 3, 's', 1); // Gamepad button index 3 (PS4 Triangle) to button "s" from group 1

  Axis.registerGamepadEmulatorKeys(gamepadEmulator2, 0, 'a', 2); // Gamepad button index 0 (PS4 X) to button "a" from group 1
  Axis.registerGamepadEmulatorKeys(gamepadEmulator2, 1, 'x', 2); // Gamepad button index 1 (PS4 Square) to button "x" from group 1
  Axis.registerGamepadEmulatorKeys(gamepadEmulator2, 2, 'i', 2); // Gamepad button index 2 (PS4 Circle) to button "i" from group 1
  Axis.registerGamepadEmulatorKeys(gamepadEmulator2, 3, 's', 2);

  const player1 = Axis.createPlayer({
    id: 1,
    joysticks: Axis.joystick1,
    buttons: Axis.buttonManager.getButtonsById(1),
  });

  const player2 = Axis.createPlayer({
    id: 2,
    joysticks: Axis.joystick2,
    buttons: Axis.buttonManager.getButtonsById(2),
  });

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
        case 'ArrowLeft': // Rotate Left
          setRotation((prev) => (prev - 10 + 360) % 360); // Decrease rotation by 10 degrees
          break;
        case 'ArrowRight': // Rotate Right
          setRotation((prev) => (prev + 10) % 360); // Increase rotation by 10 degrees
        case 'a': // Left
          setDirection((prev) => ({ ...prev, x: -1 }));
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
    rotation,
    player1,
    player2,
    gamepadEmulator1,
    gamepadEmulator2,
    chrisPosition,
    setChrisPosition,
    chrisRotation,
    setChrisRotation,
    chrisMeshPosition,
    setChrisMeshPosition,
    missyPosition,
    setMissyPosition,
    missyMeshPosition,
    setMissyMeshPosition,
    controlledByPlayer,
    setControlledByPlayer,
    chrisBox,
    setChrisBox,
    isChrisInvincible
  };

  return <DirectionContext.Provider value={context}>{children}</DirectionContext.Provider>;
}

export function useDirectionContext() {
  const context = useContext(DirectionContext);
  if (!context) throw new Error('useDirectionContext must be used inside a `DirectionProvider`');
  return context;
}
