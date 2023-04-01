import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import Gradient from "./Gradient";


import { Hands } from '@mediapipe/hands/hands';
import { drawLandmarks } from '@mediapipe/drawing_utils/drawing_utils';
import { drawConnectors } from '@mediapipe/drawing_utils/drawing_utils';
import { Camera } from '@mediapipe/camera_utils/camera_utils'

import './VideoRoom.css'
import config from "../config.jsx";

import Chat from "./Chat";

const APP_ID = "fd724da3607e4f568c1775a94077234d";
const APP_CERTIFICATE = "06a4d79522d04794a5bae3b1402812ef"

const TOKEN = "007eJxTYFDQf+nFsdLmUpzH5kyu6Y/S5zDOZ3g7j/tHVqJT4/cPIikKDGkp5kYmKYnGZgbmqSZppmYWyYbm5qaJliYG5uZGxiYpvKXqKQ2BjAy611cwMjJAIIjPwpCbmJnHwAAAwvIdLg==";
const CHANNEL = "main";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

function getRelativeContext(percents, context) {
  return {
    x: percents.x * parseInt(context.canvas.width),
    y: percents.y * parseInt(context.canvas.height),
    z: percents.z
  }
}

export const VideoRoom = () => {

  useEffect(() => {
    const video = document.querySelector('.client-video')
    console.log(11111, video)

    function onResults(results) {

      const canvasElement = document.querySelector(`.client-canvas`);

      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;

      if (canvasElement != null) {
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
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#B9FAF8', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#A663CC', lineWidth: 2 });

            if (!true) {
              canvasCtx.fillStyle = 'pink'
              const RATIO = 25 * Math.abs(index.z * 100)

              canvasCtx.fillRect(relativeIndex.x, relativeIndex.y, RATIO, RATIO)
            }
          }
        }
        canvasCtx.restore();
      }
    }


    const hands = new Hands({
      locateFile: (file) => {
        // console.log(file)
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);

    console.log('local')
    const camera = new Camera(video, {
      onFrame: async () => {
        // console.log(1)
        await hands.send({ image: video });
      },
      // width: video.videoWidth,
      // height: video.videoHeight
    });
    camera.start();

  }, [])

  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  const UUID = localStorage.getItem("wse-video-chat-uid");

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  let temp = null;
  let tracks = [0, 0]
  tracks[0] = AgoraRTC.createMicrophoneAudioTrack();

  useEffect(() => {
    const localUid = localStorage.getItem('wse-video-chat-uid')
    console.log(localUid)
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    // navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: true,
    // }).then(stream => {
    //   var videoTracks = stream.getVideoTracks();
    //   tracks[1] = AgoraRTC.createCustomVideoTrack({
    //     mediaStreamTrack: videoTracks[0],
    //   });
    // })

    const video = document.querySelector('.client-canvas');
    const stream = video.captureStream();
    var videoTracks = stream.getVideoTracks();
    tracks[1] = AgoraRTC.createCustomVideoTrack({
      mediaStreamTrack: videoTracks[0],
    });

    client
      .join(APP_ID, CHANNEL, TOKEN, UUID)
      .then((uid) =>
        Promise.all([
          tracks[0],
          tracks[1],
          uid,
        ])
      )
      .then(([audioT, videoT, uid]) => {
        const [audioTrack, videoTrack] = [audioT, videoT];
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish([audioT, videoT]);
        temp = [audioT, videoT];
        // console.log(temp, 'temp')
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(temp).then(() => client.leave());
    };

  }, []);

  const [videoIcon, setVideoIcon] = useState('https://www.svgrepo.com/show/310197/video.svg')
  const [audioIcon, setAudioIcon] = useState('https://www.svgrepo.com/show/309778/mic-on.svg')
  const [exitIcon, setExitIcon] = useState('https://www.svgrepo.com/show/309378/call-outbound.svg')
  const [handIcon, setHandIcon] = useState('https://www.svgrepo.com/show/437006/hand-raised.svg')

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video style={{ position: "absolute", transform: "scaleX(-1)", opacity: "0" }} className="client-video" height={"480px"} width={"640px"}></video>
      <canvas style={{ height: "480px", width: "640px", opacity: "0", position: 'absolute' }} className="client-canvas"></canvas>
      <Chat uuid={UUID} />
      {/* <Gradient></Gradient> */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 40vw)",
          columnGap: "2vw",
          rowGap: "2vw",
        }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
      <div className="video-buttons">
        <button
          onClick={() => {
            console.log(localTracks)
            const videoTrack = localTracks[1];
            videoTrack.setEnabled(!videoTrack.enabled);
            if (videoTrack.enabled) {
              setVideoIcon('https://www.svgrepo.com/show/310199/video-off.svg')
            } else {
              setVideoIcon('https://www.svgrepo.com/show/310197/video.svg')
            }
          }}
        >
          <img src={videoIcon} />
        </button>
        <button
          onClick={() => {
            const audioTrack = localTracks[0];
            audioTrack.setEnabled(!audioTrack.enabled);
            if (audioTrack.enabled) {
              setAudioIcon('https://www.svgrepo.com/show/309777/mic-off.svg')
            } else {
              setAudioIcon('https://www.svgrepo.com/show/309778/mic-on.svg')
            }
          }}
        >
          <img src={audioIcon} />
        </button>

        <button
          onClick={() => {
            const audioTrack = localTracks[0];
            audioTrack.setEnabled(!audioTrack.enabled);
            if (audioTrack.enabled) {
              setHandIcon('https://www.svgrepo.com/show/437009/hand-raised-slash.svg')
            } else {
              setHandIcon('https://www.svgrepo.com/show/437006/hand-raised.svg')
            }
          }}
        >
          <img src={handIcon} />
        </button>

        <button
          onClick={() => {

            // for (let localTrack of localTracks) {
            //   // if (localTrack) continue
            //   // localTrack.stop();
            //   localTrack.close();
            // }
            // client.off("user-published", handleUserJoined);
            // client.off("user-left", handleUserLeft);
            // client.unpublish(temp).then(() => client.leave());
            window.location.assign('/')
          }}
        >
          <img src={exitIcon} />
        </button>

      </div>
    </div>
  );
};
