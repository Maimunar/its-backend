import axios from 'axios'
import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import config from '../jwtconfig'
const RegisterPage = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState({
        'username': '',
        'password': '',
        'email': '',
    })
    const [succesfulRegister, setSuccesfulRegister] = useState(false)

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const clearErrors = () => {
        let temp = {
            'username': '',
            'password': '',
            'email': ''
        }
        setErrorMsg(temp)
        setError(false)
    }

    const validateRegister = (username, email, pass) => {
        let validation = true
        if (username.length < 3) {
            setError(true)
            let msg = "Please enter a valid Username!"
            let temp = errorMsg
            temp['username'] = msg
            setErrorMsg(temp)
            validation = false
        }
        if (pass.length < 6) {
            setError(true)
            let msg = "Please enter a valid Password!"
            let temp = errorMsg
            temp['password'] = msg
            setErrorMsg(temp)
            validation = false
        }
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (!pattern.test(email)) {
            setError(true)
            let msg = "Please enter a valid email address!"
            let temp = errorMsg
            temp['email'] = msg
            setErrorMsg(temp)
            validation = false
        }
        setTimeout(clearErrors, 5000)
        return validation
    }

    const invalidRegister = () => {
        setError(true)
        setTimeout(() => {
            setError(false);
        }, 5000);
    }

    const handleRegister = (e) => {
        e.preventDefault()
        if (validateRegister(username, email, password)) {
            axios.post('/api/users/register', {
                username: username,
                email: email,
                password: password,
            }, config(localStorage.getItem('token'))).then((res) => {
                console.log(res)
                setSuccesfulRegister(true)
            })
                .catch((err) => {
                    invalidRegister()
                    console.log(err)
                })
        }
    }

    return (
        <div className="wishlist-container-small">
            <div className="wishlist-subcontainer">
                <div className="login-form">
                    <h3>Sign Up</h3>
                    <h4>Register a new account</h4>
                    <form onSubmit={handleRegister}>
                        {error ? <p>Invalid registration</p> : ""}
                        {errorMsg['username'] ? <p>{errorMsg['username']}</p> : ""}
                        <input type="text" placeholder="username" id="userName" onChange={handleUsernameChange} />
                        {errorMsg['email'] ? <p>{errorMsg['email']}</p> : ""}
                        <input type="text" placeholder="email" id="email" onChange={handleEmailChange} />
                        {errorMsg['password'] ? <p>{errorMsg['password']}</p> : ""}
                        <input type="password" placeholder="password" id="password" onChange={handlePasswordChange} />
                        <input type="submit" value="Register" id="submitBtn" className="login_btn"></input>
                    </form>
                    <div>
                        {succesfulRegister ? <Redirect to="/login" /> : ""}
                        <Link to="/login" className="link">Already have an account? Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;