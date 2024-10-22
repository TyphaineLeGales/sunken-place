/**
 * Cottons Component
 *
 * This component is responsible for rendering and animating "Cottons," which are projectiles that spawn at random
 * positions and move forward to potentially collide with the opposing player (Chris).
 * Each cotton is represented by an SVG that is dynamically loaded and added to the scene.
 */

import React, { useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import * as THREE from 'three';

import { useDirectionContext } from '../provider/DirectionProvider';
import { useGameStateContext } from '../provider/GameStateProvider';
import { missyBounds } from '../utils/constants';
import { useAudioContext } from '../provider/AudioProvider';

function Cottons() {
  const { chrisMeshPosition } = useDirectionContext();
  const { setChrisScore, setMissyScore } = useGameStateContext();
  const { playSound, setVolume } = useAudioContext();
  const { viewport } = useThree(); // Access viewport dimensions

  const [cottons, setCottons] = useState([]);
  const [svgGroup, setSvgGroup] = useState(null);

  // Cottons bounds
  const boundsCottons = { z: 10 };
  const cottonInitialScale = 6;

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
      position: position,
      boundingBox: new THREE.Box3().setFromCenterAndSize(
        position,
        new THREE.Vector3(0.5, 0.5, 0.5) // Size of the box
      ),
      hasCollided: false,
    };
    setCottons((prevCottons) => [...prevCottons, newCotton]);
  };

  // Load SVG once on mount
  useEffect(() => {
    const loader = new SVGLoader();
    loader.load('/images/coton.svg', (data) => {
      const paths = data.paths;
      const group = new THREE.Group();

      paths.forEach((path) => {
        const material = new THREE.MeshBasicMaterial({
          color: path.color || 0xffffff,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.scale.set(0.002, 0.002, 0.002);
          mesh.rotateX(-Math.PI / 2);
          group.add(mesh);
        });
      });

      setSvgGroup(group);
    });
  }, []);

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

  // Move cottons towards the center
  useFrame((_, delta) => {
    setCottons((prevCottons) =>
      prevCottons
        .map((cotton) => {
          if (cotton.length < 1) return;

          // Get direction vector towards center
          const direction = new THREE.Vector3()
            .subVectors(center.position, cotton.position)
            .normalize();
          const speed = 1;

          cotton.position.addScaledVector(direction, speed * delta);

          const distanceToCenter = cotton.position.distanceTo(center.position);
          const maxDistance = Math.max(viewport.width, viewport.height) * 1.5; // Max distance from the viewport edges
          const minScale = 1.5; // Minimum scale (how small they should get at the center)

          // Adjust the scale based on distance (closer = smaller)
          cotton.scale = THREE.MathUtils.lerp(cottonInitialScale, minScale, 1 - distanceToCenter / maxDistance);

          // Check for collisions
          // if (cotton.boundingBox.intersectsBox(center.boundingBox) && !cotton.hasCollided) {

          //   setChrisScore((prevScore) => prevScore + 1);
          //   setMissyScore((prevScore) => {
          //     if (prevScore > 0) return prevScore - 1;
          //     return 0;
          //   });
          //   cotton.hasCollided = true; // Mark as collided
          //   playSound('actions', 'coton');
          //   setVolume('actions', 'coton', 0.8);
          // }

          if (cotton.scale <= 2) {
            cotton.hasCollided = true;
          }

          return cotton;
        })
        .filter((cotton) => !cotton.hasCollided)
    );
  });

  // Render cottons and SVG group
  return (
    cottons && (
      <>
        {cottons.map((cotton, index) => (
          <mesh
            key={index}
            position={[cotton.position.x, cotton.position.y, cotton.position.z]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[cotton.scale, cotton.scale, cotton.scale]}
          >
            {svgGroup && svgGroup.children.map((child, i) => <primitive object={child.clone()} key={i} />)}
          </mesh>
        ))}
      </>
    )
  );
}

export default React.memo(Cottons);
