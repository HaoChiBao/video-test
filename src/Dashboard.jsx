import { useState } from 'react';
import { VideoRoom } from './components/VideoRoom';
import Video from './Video';
import config from "./config"

import 'firebase/compat/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import 'firebase/compat/auth';

window.onload = function() {
    const script0 = document.createElement('script');
    const script1 = document.createElement('script');
    const script2 = document.createElement('script');
    const script3 = document.createElement('script');
    

    script0.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
    script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
    script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js";
    script3.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";

    script0.async = true;
    script1.async = true;
    script2.async = true;
    script3.async = true;

    script0.crossOrigin = "anonymous";
    script1.crossOrigin = "anonymous";
    script2.crossOrigin = "anonymous";
    script3.crossOrigin = "anonymous";

    document.body.appendChild(script0);
    document.body.appendChild(script1);
    document.body.appendChild(script2);
    document.body.appendChild(script3);
}

function Dashboard() {
    const [joined, setJoined] = useState(false);
    const [usernameValue, setUsernameValue] = useState("");
    firebase.initializeApp(config);

    const uploadUsername = async(e) => {
        e.preventDefault();
        setJoined(true);
        const firestore = firebase.firestore();

        const loggedInUser = firestore.collection("loggedIn");

        await loggedInUser.add({
            username: usernameValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return (
        <div>
            
            {!joined && (
                <h1>Dashboard</h1>
            )}

            {!joined && (
                <input value={usernameValue} onChange={(e) => setUsernameValue(e.target.value)} placeholder="Enter Your Username" />
            )}

            {!joined && (
                <button onClick={uploadUsername} disabled={!usernameValue}>
                    Join Room
                </button>
            )}


            {joined && <Video />}
        </div>
    );
}

export default Dashboard;
