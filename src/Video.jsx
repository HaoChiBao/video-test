import React from "react";
import { VideoRoom } from "./components/VideoRoom";
import { IconBar } from "./components/IconBar";

import { useDropzone } from "react-dropzone";
import {useState} from 'react';

export default function Video() {
    let isMediaPipeOn = false;

    const [files, setFiles] = useState([])

    const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
        setFiles(
        acceptedFiles.map((file) =>
            Object.assign(file, {
            preview: URL.createObjectURL(file),
            })
        )
        )
    },
    })

    const images = files.map((file) => (
        <div key={file.name}>
          <div>
            <img src={file.preview} style={{ width: "200px" }} alt="preview" />
          </div>
        </div>
      ))
  
    return (

        <div>
            <h1 style={{ marginTop: '4%', marginBottom: '4%' }}
            >WSE Coffee Chats</h1>

            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop files here</p>
            </div>
            <div>{images}</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <button>Turn On Hand Tracking</button>
            <VideoRoom></VideoRoom>
                {/* <IconBar></IconBar> */}
            </div>
        </div>

  );
}
