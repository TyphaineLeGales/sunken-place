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
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Missy() {
  const {playSound} = useAudioContext()
  const { player2, setMissyUltPercentage } = useDirectionContext();
  const spoonRotationRadius = useRef(2)
  const spoon = useRef()
  const debug = useRef()
  const controllerPos = useRef({ x: 0, y: 0 })

  // Create a vector to hold the current position of the spoon
  const currentPosition = useRef(new THREE.Vector3());
  const isShootInCoolDown = useRef(false)
  const [missyProjectiles, setMissyProjectiles] = useState([])
  const gltf = useLoader(GLTFLoader, "/models/spoon.glb");

  useEffect(() => {
    const missyInterval = setInterval(()=>{
      setMissyUltPercentage(prev=>Math.min(100,prev+1))
      
    },1000)

    const joystickMoveHandler = (event) => {
      controllerPos.current = { x: event.position.x, y: event.position.y }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'x') {
        if (!isShootInCoolDown.current && !(controllerPos.current.x === 0 && controllerPos.current.y === 0)) {
          shootProjectile()
          playSound('actions', 'shoot')
          isShootInCoolDown.current = true
          setTimeout(() => {
            isShootInCoolDown.current = false
          }, 250)
        }
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

  useFrame(({ scene }) => {
    if (!(Math.abs(controllerPos.current.y) < 0.2 && Math.abs(controllerPos.current.x) < 0.2)) {
      const angle = Math.atan2(controllerPos.current.y, controllerPos.current.x);
      moveSpoon(angle)
    }
  });

  const moveSpoon = (angle) => {
    const targetPosition = new THREE.Vector3(Math.cos(angle) * spoonRotationRadius.current, Math.sin(angle) * spoonRotationRadius.current, 0)
    // Get the current position of the spoon
    currentPosition.current.copy(spoon.current.position);
    // Lerp (interpolate) between the current position and the target position
    currentPosition.current.lerp(targetPosition, 0.05); // 0.1 is the lerp speed, tweak as necessary
    // Update the spoon position with the interpolated value
    spoon.current.position.copy(currentPosition.current);
    const newXrotation = Math.cos(angle) * (spoonRotationRadius.current + 4);
    const newYrotation = Math.sin(angle) * (spoonRotationRadius.current + 4);
    spoon.current.lookAt(new THREE.Vector3(newXrotation, newYrotation, 8));
    // debug.current.position.x = Math.cos(angle) * (spoonRotationRadius.current + 5)
    // debug.current.position.y = Math.sin(angle) * (spoonRotationRadius.current + 5);
  }

  return (
    <>
      <Hypnosis />
      <primitive object={gltf.scene} ref={spoon} position-y={0} scale={[3, 3, 3]}/>
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
      {/* <mesh position-z={8} ref={debug} >
        <sphereGeometry/>
        <meshBasicMaterial color={0xff0000} />
      </mesh> */}

    </>
  );
}

export default React.memo(Missy);
