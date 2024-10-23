/**
 * Cottons Component
 *
 * This component is responsible for rendering and animating "Cottons," which are projectiles that spawn at random
 * positions and move forward to potentially collide with the opposing player (Chris).
 * Each cotton is represented by an SVG that is dynamically loaded and added to the scene.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import * as THREE from 'three';

import { useDirectionContext } from '../provider/DirectionProvider';
import { useGameStateContext } from '../provider/GameStateProvider';
import { missyBounds } from '../utils/constants';
import { useAudioContext } from '../provider/AudioProvider';
import Cotton from './Cotton';

function Cottons() {
  const { chrisBox } = useDirectionContext();
  const { setChrisScore, setMissyScore } = useGameStateContext();
  const { playSound, setVolume } = useAudioContext();
  const { viewport, scene } = useThree();

  const [cottons, setCottons] = useState([]);

  const chrisRef = useRef()
  const boxRef = useRef()

  // Cottons bounds
  const boundsCottons = { z: 10 };

  // Function to get random position outside the viewport
  const getRandomPositionOutsideViewport = () => {
    const { width, height } = viewport;
    const edge = Math.floor(Math.random() * 4); // Choose one of four edges: 0 = top, 1 = right, 2 = bottom, 3 = left

    let x, y;
    switch (edge) {
      case 0: // Top edge
        x = (Math.random() - 0.5) * width * 1.5;
        y = height * 2;
        break;
      case 1: // Right edge
        x = width * 2;
        y = (Math.random() - 0.5) * height * 1.5;
        break;
      case 2: // Bottom edge
        x = (Math.random() - 0.5) * width * 1.5;
        y = -height * 2;
        break;
      case 3: // Left edge
        x = -width * 2;
        y = (Math.random() - 0.5) * height * 1.5;
        break;
      default:
        x = 0;
        y = 0;
    }

    const z = 0;
    return new THREE.Vector3(x, y, z);
  };

  // Function to spawn a new cotton
  const spawnCotton = () => {
    const position = getRandomPositionOutsideViewport();
    const newCotton = {
      id: Math.random() * Math.random(),
      position: position,
      boundingBox: new THREE.Box3().setFromCenterAndSize(
        position,
        new THREE.Vector3(0.5, 0.5, 0.5) // Size of the box
      ),
      hasCollided: false,
    };
    setCottons((prevCottons) => [...prevCottons, newCotton]);
  };

  // Spawn cottons at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      spawnCotton();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const center = {
    id: 1,
    position: new THREE.Vector3(0, 0, 0),
    boundingBox: new THREE.Box3()
      .setFromCenterAndSize(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, 5, 5) // Size of the center's bounding box
      ),
  };

  // Render cottons and SVG group
  return (
    cottons && (
      <>
        {cottons.map((cotton, index) => (
          <Cotton
            key={index}
            id={cotton.id}
            position={[cotton.position.x, cotton.position.y, cotton.position.z]}
            scale={[cotton.scale, cotton.scale, cotton.scale]}
            center={center}
            cottons={cottons}
            setCottons={setCottons}
          />
        ))}
      </>
    )
  );
}

export default React.memo(Cottons);
