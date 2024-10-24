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

  return (
    texture && (
      <mesh>
        <circleGeometry args={[3, 12]} />
        <meshBasicMaterial map={texture} side={DoubleSide} />
      </mesh>
    )
  );
}

export default React.memo(Hypnosis);
