import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { RiChatSmile2Line } from 'react-icons/ri';
import { withRouter } from 'react-router-dom';

function Chat({ state, setState, socket, history }) {

    const [input, setInput] = useState('');
    const messageRef = useRef(null);


    const handleSend = async (e) => {
        e.preventDefault();

        if (input.trim().slice(0, 5) === '/nick') {
            setState(prev => {
                return {
                    ...prev,
                    name: input.slice(6).trim()
                }
            })
        }
        else if (input.trim().slice(0, 5) === '/join') {
            setState(prev => {
                return {
                    ...prev,
                    room: input.slice(6).trim()
                }
            })
        }
        else socket.emit('chatInput', input)
        setInput('');
    }

    const handleLeave = () => {
        socket.emit('disconnection');
        history.push('/');
    }

    useEffect((() => {
        messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }), [state.messageList])

    return (
        <div className="container">
            <nav><RiChatSmile2Line />
                <button onClick={handleLeave}>Leave</button>
            </nav>
            <div className="location" >
                You are in {state.room} now!
            </div>
            <div className="msgs" ref={messageRef}>

                {state.messageList.map(item => {
                    return (
                        item.username ? <div key={item.id} ref={messageRef}>
                            <span className='msg-time'>{item.time} </span>
                            <span className='msg-username'>{item.username} </span>
                            <span className='msg-text'>{item.text}</span>
                        </div> : <div key={item.id} ref={messageRef} className='msg-official'>{item.text} </div>
                    )
                }

                )}

            </div>
            <div className="side-bar">
                <p>Rooms</p>
                <ul>
                    {state.roomList.map((item, i) => <li key={i}>{item}</li>)}
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
                        <button type='submit'>Send</button>
                    </div>
                    <div className="explains">
                        Secret command 😜<br />
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

export default withRouter(Chat);

