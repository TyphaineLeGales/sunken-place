import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react'
import { CatmullRomCurve3, DoubleSide } from 'three';
import { Vector3 } from 'three';
import { useDirectionContext } from '../provider/DirectionProvider';
import { useAudioContext } from '../provider/AudioProvider';
import { useGameStateContext } from '../provider/GameStateProvider';

const MissyWave = (props) => {

    const {angle, missyWaves, setMissyWaves, id} = props

    const { gameSpeed, chrisBox, isChrisInvincible, setMissyUltPercentage,  } = useDirectionContext() 
    const { setNewScore } = useGameStateContext()
    const {playSound} = useAudioContext()
    const tubeRef = useRef();

    const scaleRef = useRef(0.5)

    
    

    //const generateCirclePoints = (radius, segments) => {
    //    const points = [];
    //    for (let i = 0; i < segments; i++) {
    //      const angle = (i / segments) * Math.PI * 1.6;  // Full circle (2π radians)
    //      points.push(new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    //    }
    //    console.log(points)
    //    return points;
    //  }

      const points = [
        new Vector3(5,2,0),
        new Vector3(2,5,0),
        new Vector3(-2,5,0),
        new Vector3(-5,2,0),
        new Vector3(-5,-2,0),
        new Vector3(-2,-5,0),
        new Vector3(2,-5,0),
        new Vector3(5,-2,0)
      ]

      points.forEach(point=>{
        point.applyAxisAngle(new Vector3(0,0,1),angle)
      })

      //const radius = 5;  // Circle radius
      //const segments = 8;  // Number of points around the circle
      //const points = generateCirclePoints(radius, segments);
  
    // Create a curve from these points using CatmullRomCurve3 (smooth interpolation)
    const curve = new CatmullRomCurve3(points);

    

    const getP = curve.getPoints(50)
    const pointsRef = useRef(getP)

    const removeWave = () => {
        let toRemove
        for(const wave of missyWaves){
            if(wave.id === id){
                toRemove = wave
            }
        }
        setMissyWaves(prevArray => prevArray.filter(item=>item !== toRemove) )
    }

    useFrame(({clock})=>{
        
        
        scaleRef.current += 0.005 * gameSpeed.current
        
        tubeRef.current.scale.set(
            scaleRef.current,
            scaleRef.current,
            scaleRef.current
        ) 

        if(chrisBox && pointsRef.current && !isChrisInvincible.current){
            pointsRef.current.forEach((vector)=>{
                let scaledVector = new Vector3(
                    vector.x * scaleRef.current,
                    vector.y * scaleRef.current,
                    0
                )
                
                if(chrisBox.current.containsPoint(scaledVector)){
                    isChrisInvincible.current = true
                    setMissyUltPercentage(prev=>Math.min(100,prev+1))
                    setNewScore(prevScore => prevScore - 0.05)
                    playSound('actions', 'wave2')
                    setTimeout(() => {
                        isChrisInvincible.current = false
                    }, 1000)
                }
            })
        }
        
        if(scaleRef.current >= 10){
            removeWave()
        }
    })
    
  
    return (
      <mesh scale={scaleRef.current} ref={tubeRef}>
        {/* TubeGeometry that follows the curve */}
        <tubeGeometry args={[curve, 8, 0.1, 3, false]} />
        <meshBasicMaterial color={0xFFFFFF}  />
      </mesh>
    );
}

export default MissyWave