import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import config from '../jwtconfig'

const LoginPage = ({ changeUserType, setUser }) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const invalidLogin = () => {
        setError(true)
        setTimeout(() => {
            setError(false);
        }, 5000);
    }

    const handleLogin = (e) => {
        axios.post('/api/users/login', {
            username: username,
            password: password
        }, config(localStorage.getItem('token')))
            .then((res) => {
                console.log(res.data)
                changeUserType(res.data.userType)
                localStorage.setItem('token', res.data.token)
                setUser(username)
                localStorage.setItem('user', username)
                setRedirect(true)
            })
            .catch((err) => {
                invalidLogin()
                console.log(err)
            })
        e.preventDefault()
    }

    return (
        <div className="wishlist-container-small">
            <div className="wishlist-subcontainer">
                <div className="login-form">
                    <h3>Sign In</h3>
                    <h4>Log In To Your Account</h4>
                    {error ? <p>Invalid Username or password!</p> : ""}
                    <form onSubmit={handleLogin} >
                        <input type="text" placeholder="username" id="userName" onChange={handleUsernameChange} />
                        <input type="password" placeholder="password" id="password" onChange={handlePasswordChange} />
                        <input type="submit" value="Login" id="submitBtn" className="login_btn"></input>
                    </form>
                    <div>
                        <Link to="/register" className="link">Don't have an account? Sign Up</Link>
                        {redirect ? <Redirect to="/" /> : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;