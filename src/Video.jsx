import React from "react";
import { VideoRoom } from "./components/VideoRoom";
import { IconBar } from "./components/IconBar";


export default function Video() {
    let isMediaPipeOn = false;

    const turnMediaPipeOn = () => {
        return (<p>fadsfadf</p>)
    }
    return (
        <div>
            <h1>Meeting Name</h1>
            <button onClick={turnMediaPipeOn()}>Turn On Hand Tracking</button>
            <VideoRoom></VideoRoom>
            <IconBar></IconBar>
        </div>
  );
}
