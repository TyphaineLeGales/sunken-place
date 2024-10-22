/**
 * Hypnosis Component
 *
 * This component renders a video texture of a spiraling animation on a plane in the scene.
 * The video file (`/video/spirale.mp4`) is used to create a looping, muted video texture
 * that is applied to a 3D plane geometry.
 */

import React from 'react';
import { VideoTexture, DoubleSide, Vector2 } from 'three';

function Hypnosis() {
  const video = document.createElement('video');
  video.src = '/video/spirale.mp4';
  video.loop = true;
  video.muted = true;
  video.style.display = 'none'; // Hide the video element
  document.body.appendChild(video);

  video.play();
  const texture = new VideoTexture(video);
  texture.needsUpdate = true;
  // scale x2 horizontal
texture.repeat.set(0.5, 1);
// scale x2 vertical
texture.repeat.set(1, 0.5);

  return (
    texture && (
      <mesh>
        <circleGeometry args={[4, 5]} />
        <meshBasicMaterial map={texture} side={DoubleSide} />
      </mesh>
    )
  );
}

export default React.memo(Hypnosis);
