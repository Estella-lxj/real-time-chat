import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './Join.css';
import { RiChatSmile2Line } from 'react-icons/ri';
import ParticlesBg from 'particles-bg'

const Join = ({ setState, history }) => {

    const [input, setInput] = useState({ name: "", room: "", })

    const handleNameChange = (e) => {
        setInput(prev => {
            return {
                ...prev,
                name: e.target.value,
            }
        })
    }

    const handleRoomChange = (e) => {
        setInput(prev => {
            return {
                ...prev,
                room: e.target.value,
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setState(prev => {
            return {
                ...prev,
                name: input.name,
                room: input.room,
            }
        })
        history.push('/chat')
    }

    return (
        <div className="form-container">

            <form onSubmit={handleSubmit}>
                <div className="logo">
                    <h1> <RiChatSmile2Line /></h1>

                </div>
                <label htmlFor="nicknam"><h1>Pick a nickname</h1> </label> <br />
                <input name="nickname" value={input.name} onChange={e => handleNameChange(e)} />
                <br />
                <label htmlFor="room"><h1>Enter a chat room</h1> </label><br />
                <input name="room" value={input.room} onChange={e => handleRoomChange(e)} /><br />
                <button type="submit">Join</button>
            </form>
            <ParticlesBg num={200} type="circle" bg={true} />
        </div>

    )
}

export default withRouter(Join);
