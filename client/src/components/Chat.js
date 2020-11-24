import React, { useState, useEffect } from 'react';
import queryString from 'querystring';
import './Chat.css';
import io from 'socket.io-client';

let socket;

function Chat({ location }) {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const ENDPOINT = "localhost:5000";
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);
        socket.emit('join', { name, room }, ({ error }) => {
            console.log(error)
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location])


    return (
        <div>Chat</div>
    )
}

export default Chat;