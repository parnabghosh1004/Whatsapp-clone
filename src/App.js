import { useEffect, useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Login from './components/Login';
import { useStateValue } from './StateProvider';

function App() {

  const [{ user }, dispatch] = useStateValue()

  return (

    <div className="app">

      <Router>
        <Route path='/'>
          {!user ?
            <Redirect to='/login' /> : <Redirect to='/dashboard' />
          }
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/dashboard' exact>
          <div className='appBody'>
            <Sidebar />
            <Chat noChat />
          </div>
        </Route>
        <Route path='/dashboard/rooms/:roomId'>
          <div className='appBody'>
            <Sidebar />
            <Chat />
          </div>
        </Route>
      </Router>
    </div>

  );
}

export default App;
