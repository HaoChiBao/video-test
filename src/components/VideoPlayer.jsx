import React, { useEffect, useRef } from 'react';

const Canvas = props => {
  return <canvas {...props}></canvas>
}


export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);

    const video = document.querySelector(`#video_${user.videoTrack._ID}`)
    
    video.addEventListener('play', function () {
      setInterval(function () {
        
        try{
        const canvas = document.querySelector(`#canvas${user.uid}`)
        
        // console.log(canvas.width, 'canvas.width')
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // bandaid solution fix later

          if(canvas.width != 0){ // <--- bandaid solution
            
            
            const context = canvas.getContext('2d')
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
            const localUid = localStorage.getItem('wse-video-chat-uid')
            // console.log(localUid, user.uid)
            if(localUid == user.uid){
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            }
            
          }

        } catch(err){
          // console.log(err)
        }


      }, 1000 / 60)
    })
  });

  return (
    <div>
      Uid: {user.uid}
      <Canvas style={{ width: '45vw', position: 'absolute', opacity: '0.1'}} id={'canvas' + user.uid} />
      <div
        ref={ref}
      style={{ width: '45vw', height: '30vw' }}
      >
      </div>
    </div>
  );
};
