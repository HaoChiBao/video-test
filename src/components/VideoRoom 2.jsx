import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import Gradient from "./Gradient";

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

export const VideoRoom = () => {
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

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, UUID)
      .then((uid) =>
        Promise.all([
          AgoraRTC.createMicrophoneAndCameraTracks(),
          uid,
        ])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        client.publish(tracks);
        temp = tracks;
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

  const turnMediaPipeOn = () => {
    console.log('f');
  }

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
      <Chat uuid={UUID} />
      {/* <Gradient></Gradient> */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 40vw)",
          marginRight: "1vw",
          columnGap: "1vw",
          rowGap: "5vw",
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

            for (let localTrack of localTracks) {
              localTrack.stop();
              localTrack.close();
            }
            client.off("user-published", handleUserJoined);
            client.off("user-left", handleUserLeft);
            client.unpublish(temp).then(() => client.leave());
            window.location.assign('/')
          }}
        >
          <img src={exitIcon} />
        </button>

      </div>
    </div>
  );
};
