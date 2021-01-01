import React, { useState, useEffect, } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import Join from './components/Join';
import Chat from './components/Chat';

let socket;

function App() {

  const initialState = { name: "", room: "", roomList: [], messageList: [], }
  const [state, setState] = useState(initialState)

  const ENDPOINT = "http://localhost:5000/";

  useEffect(() => {

    socket = io(ENDPOINT);
    socket.on('message', message => {
      setState(prev => {
        return {
          ...prev,
          messageList: [...prev.messageList, message]
        }
      })
    })

    socket.emit('getRoomList');
    socket.on('roomList', rooms => {
      console.log(rooms)
      setState(prev => {
        return {
          ...prev,
          roomList: rooms,
        }
      })
    })

    return () => {
      socket.emit('disconnection');
      socket.off();
    }
  }, [ENDPOINT])


  useEffect((() => {
    const name = state.name, room = state.room;
    socket.emit('joinRoom', { name, room })
    socket.emit('getRoomList');
  }), [state.name, state.room])

  console.log(state)

  return (
    <Router>
      <Route path="/" exact render={() => <Join setState={setState} />} />
      <Route path="/chat" render={() => <Chat state={state} setState={setState} socket={socket} />} />
    </Router>
  );
}

export default App;
