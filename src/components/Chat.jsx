import './Chat.css'

import ChatMessage from './ChatMessage'

import config from "../config.jsx";
import "firebase/compat/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";
import {getDoc, updateDoc} from "firebase/firestore";

import { useState } from 'react';

let instance = false;

const Chat = (props) => {
    const [lastMessageCount, setLastMessageCount] = useState(0);
    const [message, setMessage] = useState('');
    
    // this user's username
    const [username, setUsername] = useState('');
    const uid = props.uuid;
    const state = {
        collapse: false,
        username: '',
    }
    
    firebase.initializeApp(config);
    const db = firebase.firestore();

    if(!instance){
        instance = true;

        const docRef = db.collection("loggedIn").doc(uid);
        getDoc(docRef)
        .then((promise) => {
            console.log(promise.data().uid)
            // console.log(promise)
            setUsername(promise.data().uid)
            state.username = promise.data().uid;
        })
        .catch((error) => {
            console.log(error)
        })
    
        const listenForMessages = setInterval(() => {
            const docRef = db.collection("chat").doc('main');
            getDoc(docRef)
            .then((promise) => {
                const msgData = promise.data().messages;
                console.log(msgData.length,":", lastMessageCount)
                if(msgData.length > lastMessageCount){
                    console.log('new messages loading:')
                    setLastMessageCount(msgData.length)
                    // setMessages(msgData)
                    if(document.querySelector('.chat-body') != null){
                        
                        document.querySelector('.chat-body').innerHTML = '';
                        for(let i = 0; i < msgData.length; i++){
                            const currMsg = msgData[i];
                            let type = 'other';
                            console.log(currMsg.username, ":", state.username)
                            if(currMsg.username == state.username){
                                type = 'user'
                            }
                            appendMessage(currMsg.message, currMsg.username, type)
                        }
                        console.log(msgData)
                        // console.log(lastMessageCount)
                    
                    }
                }

            })
            .catch((error) => {
                console.log(error)
            })
        }, 5000);
    }

    const uploadMessage = (e) => {
        console.log('uploading message')
        console.log(message)
        console.log(username)
        // appendMessage(message, username, 'user')
        const docRef = db.collection("chat").doc('main');
        getDoc(docRef)
        .then((promise) => {
            const messagesData = promise.data().messages;
            messagesData.push({
                username: username,
                message: message,
            })
            updateDoc(docRef, {
                messages: messagesData
            })
        })
    }

    const appendMessage = (message, username, type) => {
        if(message == '') return;
        // listenForMessages();

        console.log('appending message')
        const msg = document.createElement('div');
        msg.className = 'chat-message ' + type;
        
        const msgContainer = document.createElement('div');
        msgContainer.className = 'msg-container';

        const msgBody = document.createElement('div');
        msgBody.className = 'chat-message-body';

        const msgHeader = document.createElement('div');
        msgHeader.className = 'chat-message-header';

        const msgText = document.createElement('p');
        msgText.innerText = message;

        const msgUsername = document.createElement('h1');
        msgUsername.innerText = username;

        msgBody.appendChild(msgText);
        msgHeader.appendChild(msgUsername);
        msgContainer.appendChild(msgBody);
        msgContainer.appendChild(msgHeader);
        msg.appendChild(msgContainer);

        document.querySelector('.chat-body').appendChild(msg);
    }

    const collapseChat = () => {
        const chatBody = document.querySelector(".chat-container");
        if(state.collapse){
            chatBody.style.height = "80vh"
            state.collapse = false;
        } else {
            chatBody.style.height = "50px"; 
            state.collapse = true;
        }
    }
    return (
        <div className = "chat-container">
            <button onClick = {collapseChat} className = "chat-header">
                <h1>debugging channel</h1>
            </button>
            <div className = "chat-body">
                <ChatMessage 
                username = "James" 
                message = 'Wow that is amazing holy shit!'
                type = 'user'/>
                <ChatMessage 
                username = "James" 
                message = 'Wow that is amazing holy shit!'
                type = 'other'/>

            </div>
            <div className = "chat-footer">
                <input onChange = {(e=>setMessage(e.target.value))} type = "text" placeholder = "type a message" />
                <button onClick={uploadMessage}>Send</button>
            </div>
        </div>
    )
}
export default Chat;