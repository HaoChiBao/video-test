import React, { useEffect, useRef } from 'react';
import { Hands } from '@mediapipe/hands/hands';
import {drawLandmarks} from '@mediapipe/drawing_utils/drawing_utils';
import {drawConnectors} from '@mediapipe/drawing_utils/drawing_utils';
import {Camera} from '@mediapipe/camera_utils/camera_utils'

import config from "../config.jsx";
import "firebase/compat/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";
import {getDoc} from "firebase/firestore";

import './VideoPlayer.css'
import {useState} from "react";

const Canvas = props => {
  return <canvas {...props}></canvas>
}

function getRelativeContext(percents, context) {
  return {
    x: percents.x * parseInt(context.canvas.width),
    y: percents.y * parseInt(context.canvas.height),
    z: percents.z
  }
}



export const VideoPlayer = ({ user }) => {
  const [username, setUsername] = useState("")
  function setUsernameFromUid(uid) {
    firebase.initializeApp(config);
    const db = firebase.firestore();
    const docRef = db.collection("loggedIn").doc(uid);
    getDoc(docRef)
    .then((promise) => {
      console.log(promise.data().uid)
      // console.log(promise)
      setUsername(promise.data().uid)
    })
    .catch((error) => {
      console.log(error)
      setUsername(error)
    })
  }

  const ref = useRef();
  
  setUsernameFromUid(user.uid)

  useEffect(() => {
    user.videoTrack.play(ref.current);
    const localUid = localStorage.getItem('wse-video-chat-uid')

    const video = document.querySelector(`#video_${user.videoTrack._ID}`)
    console.log(localUid, user.uid)
    console.log(video)
    
    // displays the mappping of the hand landmarks
    function onResults(results){

      const canvasElement = document.querySelector(`#canvas${localUid}`);

      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;

      if(canvasElement != null){
        const canvasCtx = canvasElement.getContext('2d');
        
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        // if (results.multiHandLandmarks) {
        if (results.multiHandLandmarks.length != 0) {
          // point 4: Thumb tip
          // point 8: Index finger tip
          // point 12: Middle finger tip
          // point 16: Ring finger tip
          // point 20: Pinky finger tip
          
          const HAND_CONNECTIONS = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
          ]
  
          for (const landmarks of results.multiHandLandmarks) {
            const thumb = landmarks[4]
            
            const index = landmarks[8]
            const relativeIndex = getRelativeContext(index, canvasCtx)

            const middle = landmarks[12]
            const ring = landmarks[16]
            const pinky = landmarks[20]
            // console.log(thumb, index, middle, ring, pinky)
            // console.log(results.image)
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#B9FAF8', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#A663CC', lineWidth: 2});
          
            if(!true){
              canvasCtx.fillStyle = 'pink'
              const RATIO = 25 * Math.abs(index.z * 100)
  
              canvasCtx.fillRect(relativeIndex.x, relativeIndex.y, RATIO, RATIO)
            }
          }
        }
        canvasCtx.restore();
      }
    }


    const hands = new Hands({locateFile: (file) => {
      // console.log(file)
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0, 
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);


    if(localUid == user.uid){
      document.querySelector(`#canvas${user.uid}`).style.transform = 'scaleX(-1)'
      console.log('local')
      const camera = new Camera(video, {
        onFrame: async () => {
          // console.log(1)
          await hands.send({image: video});
        },
        // width: video.videoWidth,
        // height: video.videoHeight
      });
      camera.start();
    }

    // if the user is not the local user
    if(localUid != user.uid){
      
      video.addEventListener('play', function () {
        setInterval(function () {
          try{
            const canvas = document.querySelector(`#canvas${user.uid}`)
            const context = canvas.getContext('2d')
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if(canvas.width != 0){ 
              
              context.drawImage(video, 0, 0, canvas.width, canvas.height) 
            }
          } catch(err){
            // console.log(err)
          }
        }, 1000 / 60)
      })
    }
    
  });
  
  return (
    <div style = {{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className='video-output'>
        <Canvas style={{ opacity: '1'}} id={'canvas' + user.uid} className = 'canvas-output'/>
        <div className = 'username'>
          {username}
        </div>
      </div>
      <div
        ref={ref}
      style={{ 
        width: '45vw', height: '30vw', 
      position:'absolute', opacity:'0', pointerEvents:'none', zIndex:'-1' }}
      >
      </div>
    </div>
  );
};
