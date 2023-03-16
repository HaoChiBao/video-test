import React from 'react'
import { Link } from 'react-router-dom';
import { faVideoCamera, faPhoneSlash, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styling/icon.css'



export const IconBar = () => {


    return (

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100vw'

        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '25vw',
                marginTop: '20px'
            }}>

                <button> <FontAwesomeIcon icon={faVideoCamera} size="3x" /></button>
                <button> <FontAwesomeIcon icon={faPhoneSlash} size="3x" /></button>
                <button> <FontAwesomeIcon icon={faMicrophone} size="3x" /></button>


            </div>
        </div>
    );
};
