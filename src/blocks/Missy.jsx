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
import { clamp } from 'lodash';
import { useDirectionContext } from '../provider/DirectionProvider';
import { missyBounds } from '../utils/constants';
import { useGameStateContext } from '../provider/GameStateProvider';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import Hypnosis from './Hypnosis';
import * as THREE from 'three';
import backgroundVert from '../shaders/spoon.vert?raw'
import backgroundFrag from '../shaders/spoon.frag?raw'
import { shaderMaterial } from '@react-three/drei'

const SpoonMaterial = shaderMaterial(
  // Uniforms can be passed here (optional)
  {},
  backgroundVert,  // Vertex shader
  backgroundFrag   // Fragment shader
);

extend({SpoonMaterial})

function Missy() {
  const meshRef = useRef(null);
  const { direction, player2, missyPosition, setMissyPosition, setChrisRotation, setMissyMeshPosition } =
    useDirectionContext();
  const { missyScore } = useGameStateContext();
  // const [isRotating, setIsRotation] = useState(false);
  // const [accumulatedRotation, setAccumulatedRotation] = useState(0);
  const [svgGroup, setSvgGroup] = useState(null);
  const spoonRotationRadius = useRef(2)
  const speed = useRef(0.1)
  const spoon = useRef()
  const [controllerPos, setControllerPos] = useState({x: 0, y: 0})
    // Create a vector to hold the current position of the spoon
  const currentPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    const joystickMoveHandler = (event) => {
      const { x, y } = event.position;
      setControllerPos({x: event.position.x, y: event.position.y})
      // Convert (x, y) controller input to an angle using atan2
     
      // console.log(x, y)
      //setMissyPosition({ x, y });
    };

    const handleKeyDown = (event) => {
      if (event.key === 'x') {
        // setIsRotation(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'x') {
        // setIsRotation(false);
      }
    };

    Axis.joystick2.addEventListener('joystick:move', joystickMoveHandler);
    player2.addEventListener('keydown', handleKeyDown);
    player2.addEventListener('keyup', handleKeyUp);

    return () => {
      Axis.joystick2.removeEventListener('joystick:move', joystickMoveHandler);
      player2.removeEventListener('keydown', handleKeyDown);
      player2.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // useEffect(() => {
  //   const loader = new SVGLoader();
  //   loader.load('/images/missy/cursor-missy.svg', (data) => {
  //     const paths = data.paths;
  //     const group = new THREE.Group();

  //     paths.forEach((path) => {
  //       const material = new THREE.MeshBasicMaterial({
  //         color: path.color || 0xffffff, // Default to white if no color in SVG
  //         side: THREE.DoubleSide,
  //         depthWrite: false,
  //       });

  //       const shapes = SVGLoader.createShapes(path);
  //       shapes.forEach((shape) => {
  //         const geometry = new THREE.ShapeGeometry(shape);
  //         const mesh = new THREE.Mesh(geometry, material);
  //         mesh.scale.set(0.004, 0.004, 0.004);
  //         mesh.rotateX(Math.PI / 1.8); // Rotate the wave
  //         group.add(mesh);
  //       });
  //     });

  //     setSvgGroup(group); // Store the group to use it in the cottons
  //   });
  // }, []);

  useFrame(({state, delta, clock}) => {
    // const { x: xMissy } = missyPosition;

    // if (meshRef.current && !isRotating) {
    //   const computedX = meshRef.current.position.x;
    //   const clampedX = clamp(computedX + xMissy * 10 * delta, -missyBounds, missyBounds);
    //   meshRef.current.position.x = clampedX;
    //   setMissyMeshPosition(meshRef.current.position);
    // }

    // const joystickRotationValue = xMissy;

    // if (isRotating) {
    //   setAccumulatedRotation((prevRotation) => prevRotation + joystickRotationValue * delta * 3);

    //   const angleRotation = accumulatedRotation;
    //   setChrisRotation(angleRotation);
    // }

    // const { x: xKB, y: yKB } = direction;
    // const computedX = meshRef.current.position.x;
    // const clampedX = clamp(computedX + xKB * 10 * delta, -missyBounds, missyBounds);

    // meshRef.current.position.x = clampedX;
    // meshRef.current.position.z -= yKB * 10 * delta;
    const angle = Math.atan2(controllerPos.y, controllerPos.x);
    //console.log("angle", angle)
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
    const newXrotation = Math.cos(angle) * (spoonRotationRadius.current + 3); 
    const newYrotation = Math.sin(angle) *  (spoonRotationRadius.current + 3); 
    spoon.current.lookAt(new THREE.Vector3(newXrotation, newYrotation, 8));
  }

  return (
    <>
      {/* <mesh position={[0, -0.8, -11]} ref={meshRef}>
        { {svgGroup && svgGroup.children.map((child, i) => <primitive object={child.clone()} key={i} />)}}
      </mesh> */}
      <Hypnosis />
      <mesh ref={spoon} position-y={ 2.5}>
        <boxGeometry args={[0.75,0.75, 5]} />
        <spoonMaterial/>
      </mesh >

    </>
  );
}

export default React.memo(Missy);
