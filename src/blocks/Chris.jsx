import React, { useEffect, useRef, useState } from 'react'
import Axis from 'axis-api';
import { useFrame, useThree } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import { Box3, BoxHelper, MathUtils, Mesh, Vector2, Vector3 } from 'three';
import { SpriteAnimator } from "@react-three/drei"
import { useAudioContext } from '../provider/AudioProvider';

const Chris = () => {

    const { viewport, scene } = useThree()
    const { setChrisBox, isChrisInvincible, setChrisUltPercentage, chrisUltPercentage, missyUltPercentage, player1, gameSpeed } = useDirectionContext()
    const { playSound } = useAudioContext();

    const chrisBodyRef = useRef()
    const boxRef = useRef()
    const boxHelperRef = useRef()
    const spriteRef = useRef()
    const chrisUltPercentageRef = useRef(0)
    const isChrisUlting = useRef(false)

    useEffect(() => {
        chrisUltPercentageRef.current = chrisUltPercentage
        if (chrisUltPercentageRef.current >= 100) {
            playSound('actions', 'jauge')
        }
    }, [chrisUltPercentage])



    const joystickPos = useRef({
        x: 0,
        y: 0
    })

    const chrisRef = useRef()
    const windowRef = useRef({
        width: viewport.width,
        height: viewport.height
    })

    useEffect(() => {

        const handleKeyDown = (e) => {
            console.log(e.key)
            if (e.key === "w" && chrisUltPercentageRef.current === 100) {
                playSound('actions', 'ultiChrisStart')
                isChrisUlting.current = true
                setChrisUltPercentage(0)

                let initialInterval = 1000;
                let totalDuration = 2000;
                let elapsedTime = 0;
                let currentInterval = initialInterval;
                let isTic = true;
                let i = 0

                const playTicTac = () => {
                    if (elapsedTime >= totalDuration) {
                        clearTimeout(ticTacTimeout);
                        return;
                    }

                    if (isTic) {
                        playSound('actions', 'tic');
                    } else {
                        playSound('actions', 'tac');
                    }
                    isTic = !isTic;

                    if (i > 1) {
                        currentInterval = Math.max(50, currentInterval * 0.7);
                        elapsedTime += currentInterval;
                    }
                    i++;

                    ticTacTimeout = setTimeout(playTicTac, currentInterval);
                };

                // Start the first tic-tac
                let ticTacTimeout = setTimeout(playTicTac, currentInterval);


                setTimeout(() => {
                    isChrisUlting.current = false
                    playSound('actions', 'ultiChrisEnd')
                }, 5000)
            }
        }

        player1.addEventListener('keydown', handleKeyDown);


        const handleResize = () => {
            windowRef.current = {
                width: viewport.width,
                height: viewport.height
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        const handleJoystickMove = (e) => {
            joystickPos.current = e.position


        }

        Axis.joystick1.addEventListener('joystick:move', handleJoystickMove)

        chrisBodyRef.current = scene.getObjectByName('chrisBody')
        chrisBodyRef.current.updateMatrixWorld(true)

        boxRef.current = new Box3().setFromObject(chrisBodyRef.current)
        //boxHelperRef.current = new BoxHelper(chrisBodyRef.current, 0xFFD700)

        setChrisBox(boxRef)

        return () => {
            window.removeEventListener('resize', handleResize)
            Axis.joystick1.removeEventListener('joystick:move', handleJoystickMove)
        }
    }, [])


    useEffect(() => {



        windowRef.current = {
            width: viewport.width,
            height: viewport.height
        }

        const ultInterval = setInterval(() => {
            setChrisUltPercentage(prev => Math.min(100, prev + 1))
        }, (1000));

        return () => {
            clearInterval(ultInterval)
        }

    }, [viewport])



    useFrame(({ clock }) => {

        //console.log(chrisUltPercentage, missyUltPercentage)

        if (gameSpeed.current) {
            gameSpeed.current = MathUtils.lerp(gameSpeed.current, isChrisUlting.current ? 0.2 : 1, 0.1)
        }


        if (chrisRef.current) {


            if (isChrisInvincible.current) {
                //chrisRef.current.children.forEach(child=>{
                //    child.material.opacity = MathUtils.lerp(child.material.opacity, 0.5 + (Math.sin(clock.elapsedTime) * 0.4 - 0.2),0.2)
                //})
                spriteRef.current.children.forEach(child => {
                    child.material.opacity = MathUtils.lerp(child.material.opacity, 0.5 + (Math.sin(clock.elapsedTime) * 0.2 - 0.1), 0.2)
                })
            } else {
                //chrisRef.current.children.forEach(child=>{
                //    child.material.opacity = MathUtils.lerp(child.material.opacity, 1,0.1)
                //})
                spriteRef.current.children.forEach(child => {
                    child.material.opacity = MathUtils.lerp(child.material.opacity, 1, 0.1)
                })
            }





            const currentChrisPos = new Vector2(chrisRef.current.position.x, chrisRef.current.position.y)
            const nextChrisPos = new Vector2(chrisRef.current.position.x + joystickPos.current.x * 0.2, chrisRef.current.position.y + joystickPos.current.y * 0.2)
            const center = new Vector2(0, 0)

            let newPosition;

            if (nextChrisPos.y >= windowRef.current.height * 0.4 || nextChrisPos.y <= windowRef.current.height * -0.4) {
                nextChrisPos.y = currentChrisPos.y
            }
            if (nextChrisPos.x >= windowRef.current.width * 0.4 || nextChrisPos.x <= windowRef.current.width * -0.4) {
                nextChrisPos.x = currentChrisPos.x
            }
            if (nextChrisPos.distanceTo(center) < 4) {
                newPosition = currentChrisPos
            } else {
                newPosition = nextChrisPos
            }




            chrisRef.current.position.set(
                newPosition.x,
                newPosition.y,
                0
            )

            if (joystickPos.current.x !== 0 && joystickPos.current.x !== 0) {
                chrisRef.current.rotation.z = Math.atan2(joystickPos.current.y, joystickPos.current.x)
            }

        }
        const scale = chrisRef.current.position.distanceTo(new Vector3(0, 0, 0)) * 0.05 + 0.5
        chrisRef.current.scale.set(
            scale,
            scale,
            scale
        )
        chrisBodyRef.current.updateMatrixWorld(true)
        boxRef.current.setFromObject(chrisBodyRef.current)
        //boxHelperRef.current.update()

    })



    return (
        <>
            <group

                ref={chrisRef}
                position={[
                    -5,
                    0,
                    0
                ]}

            >
                <mesh

                >
                    <SpriteAnimator
                        startFrame={0}
                        autoPlay={true}
                        loop={true}
                        scale={5}
                        textureImageURL={'/sprites/chrisBody.png'}
                        textureDataURL={'./sprites/chrisBody.json'}
                        alphaTest={0.001}
                        asSprite={false}
                        fps={6}
                        ref={spriteRef}
                    />

                </mesh>
                <mesh
                    name='chrisBody'
                >
                    <planeGeometry args={[2.5, 1.5]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>
            </group>

        </>
    )
}

export default Chris