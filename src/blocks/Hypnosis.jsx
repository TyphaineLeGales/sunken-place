/**
 * Hypnosis Component
 *
 * This component renders a video texture of a spiraling animation on a plane in the scene.
 * The video file (`/video/spirale.mp4`) is used to create a looping, muted video texture
 * that is applied to a 3D plane geometry.
 */

import React from 'react';
import { SpriteAnimator } from "@react-three/drei"

function Hypnosis() {
  return (
      <SpriteAnimator
        startFrame={0}
        autoPlay={true}
        loop={true}
        scale={5}
        textureImageURL={'/sprites/cup.png'}
        textureDataURL={'/sprites/cup.json'}
        alphaTest={0.001}
        asSprite={false}
        fps={6}

    />
    
  );
}

export default Hypnosis;
