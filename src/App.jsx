import React from 'react';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Video from './Video';


function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {!joined && <Dashboard setJoined={setJoined} />}
      {joined && <Video />}
    </div>
  );
}


export default App;