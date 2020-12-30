import React, { useState, useEffect } from 'react';
import './Chat.css';
import io from 'socket.io-client';


let socket;

function Chat() {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [roomList, setRoomList] = useState([]);
    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState([]);

    const ENDPOINT = "localhost:5000";

    useEffect(() => {

        socket = io(ENDPOINT);
        socket.on('message', message => {
            setMsgs(prevMsgs => [...prevMsgs, message])
        })

        return () => {
            socket.emit('disconnection');
            socket.off();
        }
    }, [ENDPOINT])

    useEffect((() => {
        if (room !== '' && name !== '') socket.emit('joinRoom', { name, room })
    }), [name])

    useEffect((() => {
        if (room !== '') setRoomList(prevRoomList => [...prevRoomList, room])
        if (name !== '' && room !== '') socket.emit('joinRoom', { name, room })
    }), [room])



    const handleSend = async (e) => {
        e.preventDefault();

        if (input.trim().slice(0, 5) === '/nick') setName(input.slice(6));
        else if (input.trim().slice(0, 5) === '/join') setRoom(input.slice(6));
        else socket.emit('chatInput', input)
        setInput('');
    }

    console.log(name, room)

    return (
        <div>
            <div>Current chat room: {room}</div>
            <div>
                <p>Messages:</p>
                <ul>
                    {msgs.map(item => <li key={item.id}>{item.time} {item.username} {item.text}</li>)}
                </ul>
            </div>
            <div>
                <p>Rooms:</p>
                <ul>
                    {roomList.map(item => <li key={item}>{item}</li>)}
                </ul>
            </div>
            <form onSubmit={handleSend}>
                <input
                    type='text'
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button type='submit'>Send</button>
            </form>
            <div>
                <p>/nick [username]</p>
                <p>/join [roomname]</p>
            </div>
        </div>
    )
}

export default Chat;