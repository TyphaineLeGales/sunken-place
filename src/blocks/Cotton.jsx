import React, { useEffect, useRef, useState } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import { useGameStateContext } from '../provider/GameStateProvider';
import { useAudioContext } from '../provider/AudioProvider';

const Cotton = (props) => {
    const { id, position, scale, center, cottons, setCottons } = props;

    const { scene, viewport } = useThree();
    const { chrisBox } = useDirectionContext();
    const { setNewScore } = useGameStateContext();
    const { playSound } = useAudioContext();

    const groupRef = useRef();
    const chrisRef = useRef();
    const positionRef = useRef(new THREE.Vector3(position[0], position[1], position[2]));

    const [svgGroup, setSvgGroup] = useState(null);
    const cottonInitialScale = 3;

    const removeCotton = () => {
        let toRemove
        for (const cotton of cottons) {
            if (cotton.id === id) {
                toRemove = cotton
            }
        }

        setCottons(prevArray => prevArray.filter(item => item !== toRemove))
    }

    const loadSvg = () => {
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
    };

    useEffect(() => {
        chrisRef.current = scene.getObjectByName('chrisBody');
        if (groupRef.current) {
            groupRef.current.position.copy(positionRef.current);
        }
        loadSvg();
    }, [scene]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const direction = new THREE.Vector3()
            .subVectors(center.position, positionRef.current)
            .normalize();
        const speed = 1;

        positionRef.current.addScaledVector(direction, speed * delta);

        const distanceToCenter = positionRef.current.distanceTo(center.position);
        const maxDistance = Math.max(viewport.width, viewport.height) * 1.5;
        const minScale = 1.5; // Minimum scale (how small they should get at the center)

        // Adjust the scale based on distance (closer = smaller)
        const newScale = THREE.MathUtils.lerp(cottonInitialScale, minScale, 1 - distanceToCenter / maxDistance);
        groupRef.current.scale.set(newScale, newScale, newScale);

        groupRef.current.updateMatrixWorld(true);
        const cottonBoundingBox = new THREE.Box3().setFromObject(groupRef.current);
        if (cottonBoundingBox.intersectsBox(chrisBox.current)) {
            playSound('actions', 'coton')
            setNewScore((prevScore) => prevScore + 0.1)
            removeCotton()
        }

        if (newScale <= 1.6) {
            removeCotton()
        }

        groupRef.current.position.copy(positionRef.current);
    });

    return (
        <mesh
            name="cotton"
            ref={groupRef}
            position={positionRef.current}
            rotation={[Math.PI / 2, 0, 0]}
            scale={scale}
        >
            {svgGroup && svgGroup.children.map((child, i) => <primitive object={child.clone()} key={i} />)}
        </mesh>
    );
};

export default Cotton;
