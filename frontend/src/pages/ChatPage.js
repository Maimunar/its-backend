import React, { useEffect, useState } from 'react'
import Message from '../components/ChatPage/Message'
import axios from 'axios'
import config from '../jwtconfig'
import {io} from 'socket.io-client'
import { withRouter } from 'react-router-dom'

const ChatPage = ({ user }) => {

    const [messages, setMessages] = useState([])
    const [messageToSend, setMessageToSend] = useState()
    const [error, setError] = useState()

    const handleError = (msg) => {
        setError(msg)
        setTimeout(() => setError(), 3000)
    }

    const getMessages = () => {
        axios.get('/api/messages', config(localStorage.getItem('token')))
            .then((res) => {
                let msgs = res.data.map(item => {return {'username': item.username, 'message': item.message}})
                setMessages(msgs)
            })
            .catch((err) => console.log(err))
    }
    
    const postMessage = (e) => {
        e.preventDefault()
        if (messageToSend.length > 0 && user) {
            let sentMessage = {
                username: user,
                message: messageToSend
            }
            axios.post('/api/messages', sentMessage, config(localStorage.getItem('token')))
                .then(setMessageToSend(''))
                .catch((err) => console.log(err))
        } else
            handleError('Please enter a message')
    }

    const addMessage = (message) => {
        console.log('message received! message:', message)
        setMessages((messages) => [message, ...messages])
    }
    
    useEffect(() => { 
        const socket = io()
        socket.on('message', addMessage)
        return () => socket.disconnect()
     }, [])
    useEffect(getMessages, [])

    return (
        <div className="wishlist-container">
            <div className="wishlist-subcontainer">
                <div className="wishlist-title">
                    <h1>Chat with the community</h1>
                </div>
                <div className="chat-message-container">
                    {error ? <p>{error}</p> : ""}
                    <form action="" className="message-form">
                        <textarea placeholder="Write your message here" value={messageToSend}
                            onChange={(e) => setMessageToSend(e.target.value)} id="itemDescription" rows="5"></textarea>
                        <input type="submit" id="submitBtn" value="Send Message"
                            onClick={postMessage} />
                    </form>
                </div>
                <div className="wishlist-content">
                    {messages.map((message, key) =>
                        <Message key={key} user={message.username} message={message.message} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default withRouter(ChatPage)
