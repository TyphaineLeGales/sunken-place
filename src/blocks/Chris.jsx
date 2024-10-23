/**
 * Chris Component
 *
 * This component manages the behavior and appearance of the character "Chris" within the game.
 * It handles Chris's movement, rotation, and texture updates based on the player's joystick input
 * and game progress.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Axis from 'axis-api';
import { useFrame } from '@react-three/fiber';
import { clamp } from 'lodash';
import * as THREE from 'three';
import { useDirectionContext } from '../provider/DirectionProvider';
import { missyBounds } from '../utils/constants';
import { Plane } from '@react-three/drei';
import { useGameStateContext } from '../provider/GameStateProvider';

function Chris() {
  const meshRef = useRef();
  const { chrisPosition, chrisRotation, setChrisPosition, setChrisMeshPosition, controlledByPlayer } =
    useDirectionContext();
  const { chrisProgressScore } = useGameStateContext();

  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const textureCache = useRef({}); // Store all preloaded textures

  // Preload all textures
  useEffect(() => {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);

    // List of textures to preload (adjust as needed)
    const texturesToLoad = [
      '/images/chris/tete-1.png',
      '/images/chris/tete-2.png',
      '/images/chris/tete-3.png',
      '/images/chris/tete-4.png',
      '/images/chris/tete-5.png',
      '/images/chris/tete-6.png',
      '/images/chris/tete-7.png',
      '/images/chris/tete-dos.png'
    ];

    // Load all textures
    texturesToLoad.forEach((url) => {
      textureCache.current[url] = loader.load(url);
    });

    // Set state when all textures are loaded
    manager.onLoad = () => {
      setTexturesLoaded(true);
    };
  }, []);

  // Joystick event handler
  useEffect(() => {
    const joystick = controlledByPlayer === 2 ? Axis.joystick2 : Axis.joystick1;
    const joystickMoveHandler = (event) => {
      const { x, y } = event.position;
      setChrisPosition({ x, z: y });
    };

    joystick.addEventListener('joystick:move', joystickMoveHandler);

    return () => {
      joystick.removeEventListener('joystick:move', joystickMoveHandler);
    }
  }, [controlledByPlayer, setChrisPosition])

  // Update position and rotation each frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      const { x, z } = chrisPosition;
      const angleRotation = chrisRotation;
      const cosAngle = Math.cos(angleRotation);
      const sinAngle = Math.sin(angleRotation);

      // Calculate rotated positions
      const rotatedX = x * cosAngle - z * sinAngle;
      const rotatedY = x * sinAngle + z * cosAngle;

      setChrisPosition((prev) => ({
        x: prev.x + rotatedX * 15 * delta,
        z: prev.z - rotatedY * 15 * delta,
      }));

      // Clamping positions
      const clampedX = clamp(meshRef.current.position.x + rotatedX * 10 * delta, -missyBounds, missyBounds);
      const clampedZ = clamp(meshRef.current.position.z - rotatedY * 10 * delta, 0, 6);

      meshRef.current.position.x = clampedX;
      meshRef.current.position.z = clampedZ;

      setChrisMeshPosition(meshRef.current.position);

      meshRef.current.rotation.y = angleRotation;
    }
  });

  // Memoize the front and back materials using preloaded textures
  const headFrontMaterial = useMemo(() => {
    if (!texturesLoaded) return null;

    // Determine which texture to use based on `chrisProgressScore`
    const textureNumber = Math.floor(chrisProgressScore * 6 + 1);
    const texturePath = `/images/chris/tete-${textureNumber}.png`;
    const texture = textureCache.current[texturePath];

    const textureAlternate = () => {
      if (!texture) {
        if (chrisProgressScore > 6) {
          return textureCache.current['/images/chris/tete-7.png'];
        } else if (chrisProgressScore < 1) {
          return textureCache.current['/images/chris/tete-1.png'];
        }
      }
    };

    return new THREE.MeshBasicMaterial({
      map: texture || textureAlternate(),
      side: THREE.DoubleSide,
      transparent: true,
    });
  }, [chrisProgressScore, texturesLoaded]);

  const headBackMaterial = useMemo(() => {
    if (!texturesLoaded) return null;

    // Use the back texture
    const texture = textureCache.current['/images/chris/tete-dos.png'];

    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
  }, [texturesLoaded]);

  if (!texturesLoaded) {
    return null;
  }

  return (
    <>
      <group id={'chris'} ref={meshRef} position={[0, 0.8, 7]} rotation={[-0.3, 0, 0]}>
        <mesh scale={[1.5, 1.5, 1.5]}>
          <Plane args={[1, 1]} material={headFrontMaterial} />
        </mesh>

        <mesh scale={[1.5, 1.5, 1.5]} position={[0, 0, -0.02]}>
          <Plane args={[1, 1]} material={headBackMaterial} />
        </mesh>
      </group>
    </>
  );
}

export default React.memo(Chris);
