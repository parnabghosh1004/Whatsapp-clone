import { Button } from '@material-ui/core'
import React from 'react'
import '../css/Login.css'
import { auth, provider } from '../firebase'
import { actionTypes } from '../reducer'
import { useStateValue } from '../StateProvider'
import { FcGoogle } from "react-icons/fc";

function Login() {

    const [{ }, dispatch] = useStateValue()

    const signIn = () => {
        auth.signInWithPopup(provider).then(result => {
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user
            })
        }).catch(e => alert(e))
    }
    return (

        <div className='login'>
            <div className="login__container">
                <img src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" alt="whatsapp" />
                <div className="login__text">
                    <h1>Signin to WhatsApp</h1>
                </div>
                <Button onClick={signIn}>
                    <FcGoogle size='2em' style={{ margin: '0px 4px' }} />
                    Sign in with Google
                </Button>
            </div>
        </div>
    )
}

export default Login
