/**
 * Missy Component
 *
 * This component manages the behavior and appearance of the character "Missy" within the game.
 * It handles Missy's movement, rotation, and texture updates based on the player's joystick input
 * and game progress.
 */

import React, { useEffect, useRef, useState } from 'react';
import Axis from 'axis-api';
import { useFrame, extend } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import { useGameStateContext } from '../provider/GameStateProvider';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import Hypnosis from './Hypnosis';
import * as THREE from 'three';
import backgroundVert from '../shaders/spoon.vert?raw'
import backgroundFrag from '../shaders/spoon.frag?raw'
import { shaderMaterial } from '@react-three/drei'
import MissyProjectile from './MissyProjectile';

const SpoonMaterial = shaderMaterial(
  // Uniforms can be passed here (optional)
  {},
  backgroundVert,  // Vertex shader
  backgroundFrag   // Fragment shader
);

extend({ SpoonMaterial })

function Missy() {
  const meshRef = useRef(null);
  const { player2 } = useDirectionContext();
  const { missyScore } = useGameStateContext();
  const [svgGroup, setSvgGroup] = useState(null);
  const spoonRotationRadius = useRef(3)
  const spoon = useRef()
  const controllerPos = useRef({ x: 0, y: 0 })

  // Create a vector to hold the current position of the spoon
  const currentPosition = useRef(new THREE.Vector3());

  const isShootInCoolDown = useRef(false)

  const [missyProjectiles, setMissyProjectiles] = useState([])

  





  useEffect(() => {



    const joystickMoveHandler = (event) => {
      controllerPos.current = { x: event.position.x, y: event.position.y }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'x') {
        if (!isShootInCoolDown.current && !(controllerPos.current.x === 0 && controllerPos.current.y === 0)) {
          shootProjectile()
          isShootInCoolDown.current = true
          setTimeout(() => {
            isShootInCoolDown.current = false
          }, 600)
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
        id:`${directionVector.x}${directionVector.y}${Math.random()*Math.random()}`
      }])
    }

    Axis.joystick1.addEventListener('joystick:move', joystickMoveHandler);
    player2.addEventListener('keydown', handleKeyDown);

    return () => {
      Axis.joystick2.removeEventListener('joystick:move', joystickMoveHandler);
      player2.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  

  useFrame(({ scene }) => {
    const angle = Math.atan2(controllerPos.current.y, controllerPos.current.x);
    moveSpoon(angle)
    
  });

  const moveSpoon = (angle) => {
    const targetPosition = new THREE.Vector3(Math.cos(angle) * spoonRotationRadius.current, Math.sin(angle) * spoonRotationRadius.current, 0)
    // Get the current position of the spoon
    currentPosition.current.copy(spoon.current.position);
    // Lerp (interpolate) between the current position and the target position
    currentPosition.current.lerp(targetPosition, 0.05); // 0.1 is the lerp speed, tweak as necessary
    // Update the spoon position with the interpolated value
    spoon.current.position.copy(currentPosition.current);
    const newXrotation = Math.cos(angle) * (spoonRotationRadius.current + 5); 
    const newYrotation = Math.sin(angle) *  (spoonRotationRadius.current + 5); 
    spoon.current.lookAt(new THREE.Vector3(newXrotation, newYrotation, 8));
  }

  return (
    <>
      {/* <mesh position={[0, -0.8, -11]} ref={meshRef}>
        { {svgGroup && svgGroup.children.map((child, i) => <primitive object={child.clone()} key={i} />)}}
      </mesh> */}
      <Hypnosis />
      <mesh ref={spoon} position-y={ 2.5}>
        <boxGeometry args={[0.7,0.7, 5]} />
        <spoonMaterial/>
      </mesh >
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

    </>
  );
}

export default React.memo(Missy);
