import React, { useEffect, useRef, useState } from 'react'
import Axis from 'axis-api';
import { useThree } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';
import { Vector2 } from 'three';

const NewChris = () => {
    const { viewport } = useThree()

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
                >
                    <planeGeometry args={[3.34,2]} />
                    <meshBasicMaterial color={0xFF0000} />
                </mesh>
            </group>

        </>
    )
}

export default NewChris