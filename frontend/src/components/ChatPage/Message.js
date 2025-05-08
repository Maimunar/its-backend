import React from 'react'

const Message = ({ user, message }) => {

    return (
        <div className="chat-message-container">
            <h4>{user}</h4>
            <p>{message}</p>
        </div>
    )
}

export default Message
