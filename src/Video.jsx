import React from 'react'
import { VideoRoom } from './components/VideoRoom';
import { IconBar } from './components/IconBar'

console.log(1)
export default function Video() {
    return (

        <div>
            <h1>Meeting Name</h1>
            <VideoRoom></VideoRoom>
            <IconBar></IconBar>
        </div>
    )
}
