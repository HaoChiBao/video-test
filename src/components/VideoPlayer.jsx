import React, { useEffect, useRef } from 'react';

const Canvas = props => {
  return <canvas {...props}></canvas>
}


export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);

    const video = document.querySelector(`#video_${user.videoTrack._ID}`)
    const canvas = document.querySelector(`#canvas${user.uid}`)

    const context = canvas.getContext('2d')

    video.addEventListener('play', function () {
      setInterval(function () {

        // bandaid solution fix later
        if(canvas.width != 0){ // <--- bandaid solution
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
  
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
  
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        }


      }, 1000 / 60)
    })
  });

  return (
    <div>
      Uid: {user.uid}
      <Canvas style={{ width: '45vw' }} id={'canvas' + user.uid} />
      <div
        ref={ref}
      style={{ width: '45vw', height: '30vw' }}
      >
      </div>
    </div>
  );
};
