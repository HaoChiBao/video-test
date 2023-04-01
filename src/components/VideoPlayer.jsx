import React, { useEffect, useRef } from 'react';

import config from "../config.jsx";
import "firebase/compat/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";
import { getDoc } from "firebase/firestore";

import './VideoPlayer.css'
import { useState } from "react";

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

  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className='video-output'>
        {/* <Canvas style={{ opacity: '1'}} id={'canvas' + user.uid} className = 'canvas-output'/> */}
        <div
          className='video'
          ref={ref}
        >
          <div className='username'>
            {username}
          </div>
        </div>
      </div>
    </div>
  );
};
