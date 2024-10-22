import React, { useEffect, useRef } from 'react'
import Axis from 'axis-api';
import { useThree } from '@react-three/fiber';

const NewChris = () => {
    const {viewport} = useThree()

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




  return (
    <group
        ref={chrisRef}
    >

    </group>
  )
}

export default NewChris