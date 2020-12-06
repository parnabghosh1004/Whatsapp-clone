import React, { useEffect, useState } from 'react'
import '../css/Sidebar.css'
import { MoreVert, SearchOutlined } from '@material-ui/icons';
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { Avatar, IconButton } from '@material-ui/core';
import SidebarChat from './SidebarChat';
import db from '../firebase';
import { useStateValue } from '../StateProvider';


export default function Sidebar() {

    const [rooms, setRooms] = useState([])
    const [filteredRooms, setFilteredRooms] = useState([])
    const [{ user }, dispatch] = useStateValue()
    const [roomInput, setRoomInput] = useState('')

    useEffect(() => {
        const unsubscribe = db.collection('rooms').onSnapshot(snapshot => {
            setRooms(snapshot.docs.map((doc) => (
                {
                    id: doc.id,
                    data: doc.data()
                }
            )))
            setFilteredRooms(snapshot.docs.map((doc) => (
                {
                    id: doc.id,
                    data: doc.data()
                }
            )))
        })

        return () => {
            unsubscribe()
        }

    }, [])

    const roomMatch = (e) => {
        setRoomInput(e.target.value)
        if (e.target.value === '') {
            setFilteredRooms(rooms)
        }
        else {
            setFilteredRooms(rooms.filter(r => r.data.name.toLowerCase().startsWith(e.target.value.toLowerCase())))
        }
    }

    return (
        <div className='sidebar'>
            <div className='sidebar__header'>
                <Avatar src={user?.photoURL} />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder='Search to start a new chat ...' type='text' value={roomInput} onChange={roomMatch} />
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChat />
                {
                    filteredRooms.map(room => (
                        <SidebarChat name={room.data.name} key={room.id} id={room.id} />
                    ))
                }
            </div>
        </div>
    )
}
