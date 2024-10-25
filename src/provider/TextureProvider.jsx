
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader} from '@react-three/fiber';
import * as THREE from 'three'
let context = {};
const TextureContext = createContext();
export function TextureProvider({children}) {
    const cottonTex = useLoader(TextureLoader, '/images/coton.png')
    const spoonModel= useLoader(GLTFLoader, "/models/spoon.glb");
    const bgTex = useLoader(TextureLoader, '/images/aquarelleTexture.png')
    const dispTex = useLoader(TextureLoader, '/images/dispTex.png')
    console.log("load textures")
    dispTex.wrapS = dispTex.wrapT = THREE.RepeatWrapping;
    dispTex.repeat.set( 2, 2 );
    context = {
        cottonTex, 
        spoonModel, 
        bgTex, 
        dispTex
    }

    return <TextureContext.Provider value={context}>{children}</TextureContext.Provider>;
}

export function useTextureContext() {
    const context = useContext(TextureContext);
    if (!context) throw new Error('useTextureContext must be used inside a `TextureProvider`');
    return context;
  }