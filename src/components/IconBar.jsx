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
            width: '100vw',
            position: 'fixed',
            bottom: '0',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                // width: '',
            }}>

                <button 
                    style={{
                        backgroundColor: 'gray',
                        borderRadius: '100%',
                        height: '4rem',
                        aspectRatio: '1/1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '1rem',
                    }}
                    > <FontAwesomeIcon icon={faVideoCamera} size="2x" /></button>
                <button
                    style={{
                        backgroundColor: 'gray',
                        borderRadius: '100%',
                        height: '4rem',
                        aspectRatio: '1/1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '1rem',
                    }}
                    > <FontAwesomeIcon icon={faPhoneSlash} size="2x" /></button>
                <button
                    style={{
                        backgroundColor: 'gray',
                        borderRadius: '100%',
                        height: '4rem',
                        aspectRatio: '1/1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '1rem',
                    }}
                > <FontAwesomeIcon icon={faMicrophone} size="2x" /></button>

            </div>
        </div>
    );
};
