import { Avatar, IconButton, Switch } from '@material-ui/core'
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined, Send } from '@material-ui/icons'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../css/Chat.css'
import db from '../firebase'
import { useStateValue } from '../StateProvider'
import firebase from 'firebase'
import Picker from 'emoji-picker-react'

export default function Chat({ noChat }) {

    const [msgInput, setMsgInput] = useState('')
    const [roomName, setRoomName] = useState('')
    const { roomId } = useParams()
    const [messages, setMessages] = useState([])
    const [{ user }, dispatch] = useStateValue()
    const [emojiChoose, setEmojiChoose] = useState(false)
    const [switchState, SetSwitchState] = useState(false)

    useEffect(() => {

        if (roomId) {
            const unsubscribe = db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                setRoomName(snapshot.data().name)
            })
            db.collection('rooms')
                .doc(roomId)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    setMessages(snapshot.docs.map(doc => (
                        {
                            id: doc.id,
                            data: doc.data()
                        }
                    )))
                })
            return () => {
                unsubscribe()
            }
        }

    }, [roomId])

    useEffect(() => {
        let elem = document.querySelector('.chat__body')
        if (elem) elem.scrollTop = elem.scrollHeight

    }, [messages])

    const handleMessageSubmit = (e) => {
        e.preventDefault()

        const unsubscribe = db.collection('rooms')
            .doc(roomId)
            .collection('messages')
            .add({
                message: msgInput,
                name: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setMsgInput('')

        return () => {
            unsubscribe()
        }

    }

    const onEmojiClick = (e, obj) => {
        setMsgInput(prevMsg => prevMsg + obj.emoji)
    }

    const handleSwitchChange = () => {
        SetSwitchState(prev => !prev)
        if (!switchState) {
            document.querySelector('.app').style.backgroundColor = '#757474'
            document.querySelector('.appBody').style.backgroundColor = '#3a3939'
            document.querySelector('.sidebar__search').style.backgroundColor = 'rgb(95 95 95 / 90%)'
            document.querySelector('.sidebar__searchContainer').style.backgroundColor = '#a6a2a2'
            document.querySelector('.sidebar__searchContainer > input').style.backgroundColor = '#a3a3a3'
            document.querySelector('.sidebar__searchContainer > input').style.color = 'white'
            document.querySelector('.sidebar__chats').style.backgroundColor = '#3a3939'
            document.querySelectorAll('.sidebarChat').forEach(e => {
                e.style.color = 'white'
            })
            document.querySelector('.chat__headerInfo').style.color = 'white'
            document.querySelectorAll('.MuiSvgIcon-root').forEach(e => {
                e.style.color = 'white'
            })
        }
        else {
            document.querySelector('.app').style.backgroundColor = '#757474'
            document.querySelector('.appBody').style.backgroundColor = 'rgb(247, 245, 245)'
            document.querySelector('.sidebar__search').style.backgroundColor = 'rgba(253, 252, 252, 0.897)'
            document.querySelector('.sidebar__searchContainer').style.backgroundColor = 'white'
            document.querySelector('.sidebar__searchContainer > input').style.backgroundColor = 'white'
            document.querySelector('.sidebar__searchContainer > input').style.color = 'black'
            document.querySelector('.sidebar__chats').style.backgroundColor = 'white'
            document.querySelectorAll('.sidebarChat').forEach(e => {
                e.style.color = 'white'
            })
            document.querySelector('.chat__headerInfo').style.color = 'black'
            document.querySelectorAll('.MuiSvgIcon-root').forEach(e => {
                e.style.color = 'rgba(0, 0, 0, 0.54)'
            })
        }
    }

    return (

        <div className='chat'>
            {noChat ? <h2 style={{ textAlign: 'center', margin: 'auto 16%' }}>Click on the any room on sidebar section to see all the chats.</h2> :
                <>
                    <div className="chat__header">
                        <Avatar />
                        <div className="chat__headerInfo">
                            <h3>{roomName}</h3>
                            <p>last seen at {new Date(messages[messages.length - 1]?.data.timestamp?.toDate()).toUTCString()}</p>
                        </div>
                        <div className="chat__headerRight">
                            <Switch checked={switchState} onChange={handleSwitchChange} color='primary' />
                            <IconButton>
                                <SearchOutlined />
                            </IconButton>
                            <IconButton>
                                <MoreVert />
                            </IconButton>
                        </div>
                    </div>
                    <div className="chat__body">

                        {messages.map(msg => (

                            <p className={`chat__message ${msg.data.name === user.displayName && 'chat__receiver'}`} key={msg.id}>
                                <span className="chat__name">{msg.data.name}</span>
                                {msg.data.message}
                                <span className="chat__timestamp">
                                    {new Date(msg.data.timestamp?.toDate()).toUTCString()}
                                </span>
                            </p>
                        ))}

                    </div>
                    <div className="chat__footer">
                        {
                            emojiChoose && <Picker onEmojiClick={onEmojiClick} />
                        }
                        <IconButton onClick={() => setEmojiChoose(prev => !prev)}>
                            <InsertEmoticon />
                        </IconButton>
                        <IconButton>
                            <AttachFile />
                        </IconButton>
                        <form onSubmit={handleMessageSubmit}>
                            <input type="text" id="" placeholder='Type a message' onChange={e => setMsgInput(e.target.value)} value={msgInput} />
                            {msgInput &&
                                <IconButton type='submit'>
                                    <Send />
                                </IconButton>
                            }
                            {!msgInput &&
                                <IconButton>
                                    <Mic />
                                </IconButton>
                            }
                        </form>
                    </div>
                </>}
        </div>
    )
}
