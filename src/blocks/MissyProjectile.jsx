import React, { useEffect, useRef } from 'react'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';

const MissyProjectile = (props) => {
    const groupRef = useRef()
    const {direction,id,missyProjectiles, setMissyProjectiles} = props

    const removeProjectile = () => {

        let toRemove
            for(const projectile of missyProjectiles){
                if(projectile.id === id){
                    toRemove = projectile
                }
            }
            
            setMissyProjectiles(prevArray=>prevArray.filter(item => item !== toRemove))
    }

    useEffect(()=>{
        console.log(missyProjectiles)
    },[missyProjectiles])
    

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
                groupRef.current.add(mesh);
              });
            });
    
            resolve(group); // Return the loaded group
          });
        });
      };

    useEffect(()=>{
        groupRef.current.position.set(
            direction.x * 3,
            direction.y * 3,
            0
        )
        loadRandomWaveSvg()
    },[])

    useFrame(()=>{
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
        if(pos.distanceTo(new THREE.Vector2(0,0))>20){
            //KILL
            removeProjectile()
        }
        
    })

    

  return (
    <group ref={groupRef} name="missyProjectile"/>
  )
}

export default MissyProjectile