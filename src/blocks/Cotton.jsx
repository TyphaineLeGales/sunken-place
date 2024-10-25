import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import { useGameStateContext } from '../provider/GameStateProvider';
import { useAudioContext } from '../provider/AudioProvider';
import { useTextureContext } from '../provider/TextureProvider';

const Cotton = (props) => {
    const { id, position, scale, center, cottons, setCottons } = props;

    const { scene, viewport } = useThree();
    const { chrisBox, setChrisUltPercentage, gameSpeed } = useDirectionContext();
    const { newScore, setNewScore } = useGameStateContext();
    const { playSound } = useAudioContext();
    const { cottonTex } = useTextureContext();

    const groupRef = useRef();
    const chrisRef = useRef();
    const positionRef = useRef(new THREE.Vector3(position[0], position[1], position[2]));
    const cottonInitialScale = 3;
    const randomRotation = useMemo(() => Math.random() * Math.PI * 2, []);


    function interpolateColor(progress) {
        const startColor = new THREE.Color(0xFFFFFF);
        const endColor = new THREE.Color(0xAF0DFB);
        if (progress <= 0.5) {
            return startColor;
        }

        const normalizedProgress = (progress - 0.5) * 2;

        return startColor.lerp(endColor, normalizedProgress+0.2);
    }

    const color = useMemo(() => interpolateColor(newScore), [newScore]);

    const removeCotton = () => {
        let toRemove
        for (const cotton of cottons) {
            if (cotton.id === id) {
                toRemove = cotton
            }
        }
        setCottons(prevArray => prevArray.filter(item => item !== toRemove))
    }

    useEffect(() => {
        chrisRef.current = scene.getObjectByName('chrisBody');
        if (groupRef.current) {
            groupRef.current.position.copy(positionRef.current);
        }
    }, [scene]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const direction = new THREE.Vector3()
            .subVectors(center.position, positionRef.current)
            .normalize();
        const speed = 1;

        positionRef.current.addScaledVector(direction, speed * delta * gameSpeed.current);
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
            removeCotton()
            setChrisUltPercentage(prev => Math.min(100, prev + 5))
            setNewScore((prevScore) => parseFloat((prevScore + 0.05).toFixed(2)));

        }

        if (newScale <= 1.52) {
            removeCotton()
        }
        groupRef.current.position.copy(positionRef.current);
    });

    return (
        <mesh
            name="cotton"
            ref={groupRef}
            position={positionRef.current}
            rotation={[0, 0, randomRotation]}
            scale={scale}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={color} map={cottonTex} transparent="true" />
        </mesh>
    );
};

export default Cotton;
