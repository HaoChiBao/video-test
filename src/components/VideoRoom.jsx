import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import Gradient from "./Gradient";

import config from "../config.jsx";

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
  let tracks = [0,0]
  tracks[0] = AgoraRTC.createMicrophoneAudioTrack();

  useEffect(() => {
    const localUid = localStorage.getItem('wse-video-chat-uid')
    console.log(localUid)
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    }).then(stream => {
      var videoTracks = stream.getVideoTracks();
      tracks[1] = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: videoTracks[0],
      });
    })

    // const video = document.querySelector('.canvas-output');
    // const stream = video.captureStream();
    // var videoTracks = stream.getVideoTracks();
    // tracks[1] = AgoraRTC.createCustomVideoTrack({
    //   mediaStreamTrack: videoTracks[0],
    // });

    client
      .join(APP_ID, CHANNEL, TOKEN, UUID)
      .then((uid) =>
        Promise.all([
          tracks[0],
          tracks[1],
          //tracks[1],
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

  const turnMediaPipeOn = () => {
    console.log('f');
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
    </div>
  );
};
