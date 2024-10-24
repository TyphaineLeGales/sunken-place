
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useLoader} from '@react-three/fiber';
let context = {};
const TextureContext = createContext();


export function TextureProvider({children}) {
    const cottonTex = useLoader(TextureLoader, '/images/coton.png')
    console.log("texture is loaded")
    context = {
        cottonTex, 
    }

    return <TextureContext.Provider value={context}>{children}</TextureContext.Provider>;

}

export function useTextureContext() {
    const context = useContext(TextureContext);
    if (!context) throw new Error('useTextureContext must be used inside a `TextureProvider`');
    return context;
  }