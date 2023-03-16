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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // if(context.w)
        // const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        // console.log(imageData)

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