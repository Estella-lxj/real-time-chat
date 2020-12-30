import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import io from 'socket.io-client';
import { RiChatSmile2Line } from 'react-icons/ri';

let socket;

function Chat() {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [roomList, setRoomList] = useState([]);
    const [input, setInput] = useState('');
    const [msgs, setMsgs] = useState([]);

    const msgsRef = useRef(null);

    const ENDPOINT = "localhost:5000";

    useEffect(() => {

        socket = io(ENDPOINT);
        socket.on('message', message => {
            setMsgs(prevMsgs => [...prevMsgs, message]);
            msgsRef.current.scrollIntoView({ behavior: 'smooth' });
        })

        socket.emit('getRoomList');
        socket.on('roomList', rooms => {
            console.log(rooms)
            setRoomList(rooms)
        })

        return () => {
            socket.emit('disconnection');
            socket.off();
        }
    }, [ENDPOINT])


    useEffect((() => {
        socket.emit('joinRoom', { name, room })
        socket.emit('getRoomList');
    }), [name, room])

    // useEffect((() => {
    //     msgsRef.current.scrollIntoView({ behavior: 'smooth' });
    // }), [msgsRef]);


    const handleSend = async (e) => {
        e.preventDefault();

        if (input.trim().slice(0, 5) === '/nick') setName(input.slice(6));
        else if (input.trim().slice(0, 5) === '/join') setRoom(input.slice(6));
        else socket.emit('chatInput', input)
        setInput('');
    }

    console.log(name, room)

    return (
        <div className="container">
            <nav><RiChatSmile2Line /></nav>
            <div className="location" >
                {room !== '' ? `You are in ${room} now!` : 'Enter your nickname and join a chat room!'}
            </div>
            <div className="msgs" ref={msgsRef}>

                {msgs.map(item => {
                    return (
                        item.username ? <div ref={msgsRef} key={item.id}>
                            <span className='msg-time'>{item.time} </span>
                            <span className='msg-username'>{item.username} </span>
                            <span className='msg-text'>{item.text}</span>
                        </div> : <div key={item.id} ref={msgsRef} className='msg-official'>{item.text} </div>
                    )
                }

                )}

            </div>
            <div className="side-bar">
                <p>Rooms</p>
                <ul>
                    {roomList.length ? roomList.map((item, i) => <li key={i}>{item}</li>) : null}
                </ul>
            </div>
            <div className="user-input">
                <form onSubmit={handleSend} >
                    <input
                        placeholder="Hello..."
                        type='text'
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <div className="btn-group">
                        <button type='reset'>Clear</button>
                        <button type='submit'>Send</button>
                    </div>
                    <div className="explains">
                        Change nickname: /nick [username] <br />
                        Join or create chatroom: /join [roomname]
                    </div>
                </form>
            </div>
            <footer>
                © 2020 - Developed with ❤️ Estella
            </footer>

        </div>
    )
}

export default Chat;