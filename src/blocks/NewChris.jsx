import React, { useEffect, useRef, useState } from 'react'
import Axis from 'axis-api';
import { useFrame, useThree } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import { Box3, BoxHelper, Mesh, Vector2, Vector3 } from 'three';
import {SpriteAnimator} from "@react-three/drei"

const NewChris = () => {

    const { viewport, scene } = useThree()

    const {setChrisBox} = useDirectionContext()

    const chrisBodyRef = useRef()
    const boxRef = useRef()
    const boxHelperRef = useRef()

    const chrisRef = useRef()
    const windowRef = useRef({
        width: viewport.width,
        height: viewport.height
    })

    useEffect(() => {
        const handleResize = () => {
            windowRef.current = {
                width: viewport.width,
                height: viewport.height
            }
        }
        window.addEventListener('resize', handleResize)

        const handleJoystickMove = (e) => {
            
            const currentChrisPos = new Vector2(chrisRef.current.position.x,chrisRef.current.position.y)
            const nextChrisPos = new Vector2(chrisRef.current.position.x + e.position.x * 0.1,chrisRef.current.position.y + e.position.y * 0.1)
            const center = new Vector2(0,0)
 
            let newPosition;
            if(nextChrisPos.distanceTo(center) < 5){
                newPosition = currentChrisPos
            }else if(nextChrisPos.distanceTo(center)>Math.min(windowRef.current.width * 0.9,windowRef.current.height * 0.9) * 0.5){
                newPosition = currentChrisPos
            }else{
                newPosition = nextChrisPos
            }

            
            chrisRef.current.position.set(
                newPosition.x,
                newPosition.y,
                0 
            )

            if(e.position.x !== 0 && e.position.x !== 0){
                chrisRef.current.rotation.z = Math.atan2(e.position.y,e.position.x)
            }
            

            
        }

        Axis.joystick1.addEventListener('joystick:move', handleJoystickMove)

        chrisBodyRef.current = scene.getObjectByName('chrisBody') 
        chrisBodyRef.current.updateMatrixWorld(true)

        boxRef.current = new Box3().setFromObject(chrisBodyRef.current)
        boxHelperRef.current = new BoxHelper(chrisBodyRef.current,0xFFD700)
    
        setChrisBox(boxRef)

        
        scene.add(boxHelperRef.current)

    }, [])


    useEffect(()=>{

        windowRef.current = {
            width: viewport.width,
            height: viewport.height
        }

    },[viewport])

 

    useFrame(()=>{
        const scale = chrisRef.current.position.distanceTo(new Vector3(0,0,0)) * 0.05 + 0.7
        chrisRef.current.scale.set(
            scale,
            scale,
            scale
        )
        chrisBodyRef.current.updateMatrixWorld(true)
        boxRef.current.setFromObject(chrisBodyRef.current)
        boxHelperRef.current.update()
        
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
                    name='chrisBody'
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
                    />
          
                </mesh>
            </group>

        </>
    )
}

export default NewChris