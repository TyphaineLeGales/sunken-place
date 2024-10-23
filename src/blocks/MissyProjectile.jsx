import React, { useEffect, useRef } from 'react'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import { useGameStateContext } from '../provider/GameStateProvider';

const MissyProjectile = (props) => {

    const {
        direction,
        id,
        missyProjectiles,
        setMissyProjectiles
    } = props

    const { scene } = useThree()

    const { chrisBox, isChrisInvincible } = useDirectionContext()
    const { setNewScore } = useGameStateContext()

    const groupRef = useRef()
    const chrisRef = useRef()
    const boxRef = useRef()
    const boxHelperRef = useRef()

    const removeProjectile = () => {

        let toRemove
        for (const projectile of missyProjectiles) {
            if (projectile.id === id) {
                toRemove = projectile
            }
        }

        setMissyProjectiles(prevArray => prevArray.filter(item => item !== toRemove))
    }




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





                        mesh.updateMatrixWorld(true)
                        boxRef.current = new THREE.Box3().setFromObject(mesh)
                        boxHelperRef.current = new THREE.BoxHelper(mesh, 0xFF0000)
                        groupRef.current.add(mesh)
                        scene.add(boxHelperRef.current)

                    });
                });

                resolve(group); // Return the loaded group
            });
        });
    };

    useEffect(() => {
        chrisRef.current = scene.getObjectByName('chrisBody')
        groupRef.current.position.set(
            direction.x * 4.5,
            direction.y * 4.5,
            0
        )
        loadRandomWaveSvg()
    }, [])

    useFrame(() => {



        const currentPos = groupRef.current.position
        groupRef.current.position.set(
            currentPos.x + direction.x * 0.1,
            currentPos.y + direction.y * 0.1,
            0
        )

        const pos = new THREE.Vector2(
            groupRef.current.position.x,
            groupRef.current.position.y
        )

        const scale = pos.distanceTo(new THREE.Vector2(0, 0)) * 0.05 + 0.7

        groupRef.current.scale.set(
            scale,
            scale,
            scale
        )

        //Check collisions
        if (groupRef.current.children.length) {
            groupRef.current.children[0].updateMatrixWorld(true)
            boxRef.current.setFromObject(groupRef.current.children[0])
            boxHelperRef.current.update()
            if (boxRef.current.intersectsBox(chrisBox.current) && !isChrisInvincible.current) {
                isChrisInvincible.current = true
                setNewScore(prevScore => prevScore - 0.05)
                removeProjectile()
                setTimeout(() => {
                    isChrisInvincible.current = false
                }, 1000)
            }


        }





        if (pos.distanceTo(new THREE.Vector2(0, 0)) > 20) {
            //KILL
            removeProjectile()
        }

    })



    return (
        <group ref={groupRef} name="missyProjectile" />
    )
}

export default MissyProjectile