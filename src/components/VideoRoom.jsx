import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';

const APP_ID = 'fd724da3607e4f568c1775a94077234d';
const TOKEN =
  '007eJxTYBBaMidXOMqy7pbt1YmaBgdbWZdcaa1yvnJ4LieDXjfD+QwFhrQUcyOTlERjMwPzVJM0UzOLZENzc9NESxMDc3MjY5MU9//8KQ2BjAzcfzcyMzJAIIjPwpCbmJnHwAAArAYdMA==';
const CHANNEL = 'main';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

export const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === 'audio') {
      user.audioTrack.play()
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  let temp = null

  useEffect(() => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) => 
      Promise.all([
        AgoraRTC.createMicrophoneAndCameraTracks(),
        uid,
        localStorage.setItem('wse-video-chat-uid', uid),
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
        temp = tracks
        // console.log(temp, 'temp')
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off('user-published', handleUserJoined);
      client.off('user-left', handleUserLeft);
      client.unpublish(temp).then(() => client.leave());
    };
  }, []);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 40vw)',
          marginRight: '4vw',
          columnGap: '8vw',
          rowGap: '5vw',
        }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};
