/**
 * Waves Component
 *
 * This component is responsible for rendering and animating the "Waves" that are shot by the player (Missy).
 * Each wave is loaded dynamically as an SVG and rendered in the 3D scene as it travels forward.
 */

import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'; // Correct import path
import * as THREE from 'three';

import { useWaveShooter } from './WaveShooter';
import { useDirectionContext } from '../provider/DirectionProvider';
import { useAudioContext } from '../provider/AudioProvider';

// Define the bounds for the waves
export const boundsWaves = { z: 10 };

function Waves() {
  const { playSound } = useAudioContext();
  const { player2, missyMeshPosition } = useDirectionContext();
  const { waves, checkCollisions, shootWave } = useWaveShooter(boundsWaves);

  const [waveSvgs, setWaveSvgs] = useState([]); // Array to store SVG groups for each wave

  const loadRandomWaveSvg = () => {
    const loader = new SVGLoader();
    const randomWaveIndex = Math.floor(Math.random() * 3) + 1;
    const svgPath = `/images/waves/wave-${randomWaveIndex}.svg`;

    return new Promise((resolve) => {
      loader.load(svgPath, (data) => {
        const paths = data.paths;
        const group = new THREE.Group();

        paths.forEach((path) => {
          const material = new THREE.MeshBasicMaterial({
            color: path.color || 0xffffff, // Default to white if no color in SVG
            side: THREE.DoubleSide,
            depthWrite: false,
          });

          const shapes = SVGLoader.createShapes(path);
          shapes.forEach((shape) => {
            const geometry = new THREE.ShapeGeometry(shape);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(0.002, 0.002, 0.002); // Adjust scale
            mesh.rotateX(-Math.PI / 2); // Rotate the wave
            group.add(mesh);
          });
        });

        resolve(group); // Return the loaded group
      });
    });
  };

  // Function to handle shooting a wave
  const handleShootWave = async () => {
    playSound('actions', 'shoot');
    const newWave = {
      x: missyMeshPosition.x,
      y: -0.1,
      z: -4,
    };

    // Load a random SVG for the new wave
    const svgGroup = await loadRandomWaveSvg();

    // Shoot the wave and associate the SVG group with it
    shootWave(newWave);
    setWaveSvgs((prev) => [...prev, svgGroup]);
  };

  // Listen for keydown events and shoot a wave when certain keys are pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (missyMeshPosition && (event.key === 'a' || event.key === 'w')) {
        handleShootWave(); // Handle shooting the wave with random SVG
      }
    };

    player2.addEventListener('keydown', handleKeyDown);

    return () => {
      player2.removeEventListener('keydown', handleKeyDown);
    };
  }, [missyMeshPosition]);

  // Update the SVGs for each wave on each frame
  const updateWaves = (delta) => {
    if (waveSvgs) {
      waveSvgs.forEach((svgGroup, index) => {
        svgGroup.children.forEach((child, i) => {
          const wave = waves[index];
          if (wave) {
            // Rotate the wave on the z axis
            child.rotation.z += wave.speed * delta;
          }
        });
      });
    }
  };

  // Check for collisions and update wave positions on each frame
  useFrame((state, delta) => {
    checkCollisions();
  });

  // Update the waveSvgs array when the waves array is updated
  useEffect(() => {
    setWaveSvgs((prev) => prev.slice(0, waves.length));
  }, [waves]);

  // Render the waves and their respective SVGs
  return (
    waves && (
      <>
        {waves.map((wave, index) => (
          <mesh key={index} position={[wave.x, wave.y, wave.z]}>
            {waveSvgs[index] &&
              waveSvgs[index].children.map((child, i) => <primitive object={child.clone()} key={i} />)}
          </mesh>
        ))}
      </>
    )
  );
}

export default React.memo(Waves);
