import React from 'react';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Video from './Video';
import video from './thebronjames.mp4'

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* <video class="hi" width="320" height="240" controls src={video}></video> */}
      {!joined && <Dashboard setJoined={setJoined} />}
      {joined && <Video />}
    </div>
  );
}


export default App;