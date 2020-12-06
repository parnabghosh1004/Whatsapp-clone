import { Avatar } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../css/SidebarChat.css'
import db from '../firebase'

export default function SidebarChat({ addNewChat, name, id }) {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        db.collection('rooms').doc(id).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => (
            setMessages(snapshot.docs.map(doc => (
                doc.data()
            )))
        ))
    }, [])

    const createChat = () => {
        const roomName = prompt('Please enter a room name for the chat')
        if (roomName) {
            db.collection('rooms').add({
                name: roomName
            })
        }
    }

    return !addNewChat ? (
        <Link to={`/dashboard/rooms/${id}`}>
            <div className='sidebarChat'>
                <Avatar />
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                    {
                        messages.length ? <p>{messages[0]?.name} : {messages[0]?.message}</p> : <p>This room do not have any messages</p>
                    }
                </div>
            </div>
        </Link>
    )
        : (
            <div className="sidebarChat" onClick={createChat}>
                <h2>Add New Chat</h2>
            </div>
        )
}
