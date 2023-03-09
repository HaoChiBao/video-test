import React, { useEffect, useRef } from 'react';

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  const input = ctx => {
    ctx.fillStyle = '#000000'
    ctx.fill()
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    //Our draw come here
    input(context)
  }, [input])
  
  return <canvas ref={canvasRef} {...props}/>
}


export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
    
    console.log(((ref.current).children[0]).children[0])
  });

  return (
    <div>
      Uid: {user.uid}
      <div
        ref={ref}
        style={{ width: '200px', height: '200px' }}
      >
        <Canvas />
      </div>
    </div>
  );
};
