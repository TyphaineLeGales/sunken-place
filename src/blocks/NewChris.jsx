import React, { useEffect, useRef, useState } from 'react'
import Axis from 'axis-api';
import { useThree, useLoader } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import { Vector2 } from 'three';
import {SpriteAnimator} from "@react-three/drei"
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const NewChris = () => {
    const { viewport } = useThree()
    const chrisHead = useLoader(TextureLoader, '/images/chris/tete-1.png')

    const [chrisPosition,setChrisPosition] = useState({
        x:0,
        z:0
    })

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

        

    }, [])


    useEffect(()=>{

        windowRef.current = {
            width: viewport.width,
            height: viewport.height
        }

    },[viewport])



    return (
        <>
            <group
               
                ref={chrisRef}
                position={[
                    -6,
                    0,
                    0
                ]}
            >
                <mesh
                    position-z={0.1}
                    name='chrisBody'
                >
                    <SpriteAnimator
                        position-z={0.1}
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
                    <mesh scale={[1.5, 1.5, 1.5]}  rotation={[0, 0, 3.5*Math.PI/2]} position={[1.2, -0.2, 0]}>
                        <planeGeometry args={[1, 1]}/>
                        <meshBasicMaterial map={chrisHead} transparent={true}/> 
                    </mesh>
                </mesh>
            </group>

        </>
    )
}

export default NewChris