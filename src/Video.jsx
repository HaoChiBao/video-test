import React from 'react'
import { VideoRoom } from './components/VideoRoom';
import { IconBar } from './components/IconBar'

export default function Video() {
    return (


        <div>
            <h1 style={{ marginTop: '4%', marginBottom: '4%' }}

            >Meeting Name</h1>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <VideoRoom></VideoRoom>
                <IconBar></IconBar>
            </div>
        </div>

    )
}
