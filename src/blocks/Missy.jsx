/**
 * Missy Component
 *
 * This component manages the behavior and appearance of the character "Missy" within the game.
 * It handles Missy's movement, rotation, and texture updates based on the player's joystick input
 * and game progress.
 */

import React, { useEffect, useRef, useState } from 'react';
import Axis from 'axis-api';
import { useFrame } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import Hypnosis from './Hypnosis';
import * as THREE from 'three';
import MissyProjectile from './MissyProjectile';
import { useAudioContext } from '../provider/AudioProvider';
import { useTextureContext } from '../provider/TextureProvider';
import MissyWave from './MissyWave';

function Missy() {
  const { playSound } = useAudioContext()
  const { player2, setMissyUltPercentage, missyUltPercentage } = useDirectionContext();
  const spoonRotationRadius = useRef(2)
  const spoon = useRef()
  const { spoonModel } = useTextureContext();
  const controllerPos = useRef({ x: 0, y: 0 })
  const missyUltPercentageRef = useRef(0)

  useEffect(() => {
    missyUltPercentageRef.current = missyUltPercentage
    if (missyUltPercentageRef.current >= 100) {
      playSound('actions', 'jauge')
    }
  }, [missyUltPercentage])

  // Create a vector to hold the current position of the spoon
  const currentPosition = useRef(new THREE.Vector3());
  const isShootInCoolDown = useRef(false)
  const [missyProjectiles, setMissyProjectiles] = useState([])
  const [missyWaves, setMissyWaves] = useState([])

  useEffect(() => {
    const missyInterval = setInterval(() => {
      setMissyUltPercentage(prev => Math.min(100, prev + 1))

    }, 1000)

    const joystickMoveHandler = (event) => {
      controllerPos.current = { x: event.position.x, y: event.position.y }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'a') {
        if (!isShootInCoolDown.current && !(controllerPos.current.x === 0 && controllerPos.current.y === 0)) {
          shootProjectile()
          playSound('actions', 'shoot')
          isShootInCoolDown.current = true
          setTimeout(() => {
            isShootInCoolDown.current = false
          }, 250)
        }
      }

      if (event.key === "w" && missyUltPercentageRef.current === 100) {
        setMissyUltPercentage(0)
        playSound('actions', 'ultiMissyStart')
        setMissyWaves([
          {
            angle: Math.atan2(controllerPos.current.y, controllerPos.current.x),
            id: 0
          }
        ])
        setTimeout(() => {
          playSound('actions', 'ultiMissyStart')
          setMissyWaves(prevMissyWaves => [
            ...prevMissyWaves,
            {
              angle: Math.atan2(controllerPos.current.y, controllerPos.current.x),
              id: 1
            }
          ])
        }, 5000)
        setTimeout(() => {
          playSound('actions', 'ultiMissyStart')
          setMissyWaves(prevMissyWaves => [
            ...prevMissyWaves,
            {
              angle: Math.atan2(controllerPos.current.y, controllerPos.current.x),
              id: 2
            }
          ])
        }, 10000)
      }
    };

    const shootProjectile = () => {
      const directionVector = new THREE.Vector2(
        controllerPos.current.x,
        controllerPos.current.y
      ).normalize()
      setMissyProjectiles(prevMissyProjectiles => [...prevMissyProjectiles, {
        directionVector,
        id: `${directionVector.x}${directionVector.y}${Math.random() * Math.random()}`
      }])
    }

    Axis.joystick2.addEventListener('joystick:move', joystickMoveHandler);
    player2.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(missyInterval)
      Axis.joystick2.removeEventListener('joystick:move', joystickMoveHandler);
      player2.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useFrame(() => {
    if (!(Math.abs(controllerPos.current.y) < 0.2 && Math.abs(controllerPos.current.x) < 0.2)) {
      const angle = Math.atan2(controllerPos.current.y, controllerPos.current.x);
      moveSpoon(angle)
      playSound('actions', 'missySpoon')
    } else {
      currentPosition.current.lerp(new THREE.Vector3(0, 0, 0), 0.05)
      spoon.current.position.copy(currentPosition.current);
      spoon.current.rotation.x = THREE.MathUtils.lerp(spoon.current.rotation.x, 0, 0.05);
      spoon.current.rotation.y = THREE.MathUtils.lerp(spoon.current.rotation.y, 0, 0.05);
      spoon.current.rotation.z = THREE.MathUtils.lerp(spoon.current.rotation.z, 0, 0.05);
    }
  });

  const moveSpoon = (angle) => {
    const targetPosition = new THREE.Vector3(Math.cos(angle) * spoonRotationRadius.current, Math.sin(angle) * spoonRotationRadius.current, 0)
    currentPosition.current.copy(spoon.current.position);
    currentPosition.current.x -= 0.02 // sprite is not centered
    currentPosition.current.lerp(targetPosition, 0.05); // 0.1 is the lerp speed, tweak as necessary
    spoon.current.position.copy(currentPosition.current);
    const newXrotation = Math.cos(angle) * (spoonRotationRadius.current + 4);
    const newYrotation = Math.sin(angle) * (spoonRotationRadius.current + 4);
    spoon.current.lookAt(new THREE.Vector3(newXrotation, newYrotation, 8));
  }

  return (
    <>
      <Hypnosis />
      <primitive object={spoonModel.scene} ref={spoon} position-y={0} scale={[3, 3, 3]} />
      {
        missyProjectiles.map((projectile) => (
          <MissyProjectile
            key={projectile.id}
            direction={projectile.directionVector}
            id={projectile.id}
            missyProjectiles={missyProjectiles}
            setMissyProjectiles={setMissyProjectiles}
          />
        ))
      }
      {
        missyWaves.map(wave => (
          <MissyWave
            key={wave.id}
            id={wave.id}
            angle={wave.angle}
            missyWaves={missyWaves}
            setMissyWaves={setMissyWaves}
          />
        ))
      }
    </>
  );
}

export default React.memo(Missy);
