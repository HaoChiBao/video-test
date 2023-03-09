import { useState } from 'react';
import { VideoRoom } from './components/VideoRoom';
import Video from './Video';

function Dashboard() {
    const [joined, setJoined] = useState(false);
    return (
        <div>

            {!joined && (
                <h1>Dashboard</h1>
            )}

            {!joined && (
                <button onClick={() => setJoined(true)}>
                    Join Room
                </button>
            )}


            {joined && <Video />}
        </div>
    );
}

export default Dashboard;
