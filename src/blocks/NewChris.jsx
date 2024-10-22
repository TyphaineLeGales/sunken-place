import React, { useEffect, useRef } from 'react'
import Axis from 'axis-api';
import { useThree } from '@react-three/fiber';
import { useDirectionContext } from '../provider/DirectionProvider';

const NewChris = () => {
    const {viewport} = useThree()
    const {chrisPosition, setChrisPosition} = useDirectionContext()

    const chrisRef = useRef()
    const windowRef = useRef({
        width:viewport.width,
        height:viewport.height
    })

    useEffect(()=>{

       

        const handleResize = () => {
            windowRef.current = {
                width:viewport.width,
                height:viewport.height
            }
        }
        window.addEventListener('resize',handleResize)

        const handleJoystickMove = (e) => {

        }

        Axis.joystick1.addEventListener('joystick:move',handleJoystickMove)

    },[])

    useEffect(()=>{
        console.log(chrisPosition)
    },[chrisPosition])




  return (
    <group
        ref={chrisRef}
        position-x={100}
    >
        <mesh
            
        >
            <boxGeometry args={[15,15,15]}/>
            <meshBasicMaterial color={0xFF0000}/>
        </mesh>
    </group>
  )
}

export default NewChris