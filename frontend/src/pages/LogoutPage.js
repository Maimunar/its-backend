import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

const LogoutPage = ({ changeUserType, setUser }) => {

    const [redirect, setRedirect] = useState(false)
    localStorage.clear()
    changeUserType('user')
    setTimeout(() => setRedirect(true), 2000)
    setUser()
    
    return (
        <div className="wishlist-container-small">
            <div className="wishlist-subcontainer">
                <h4>Succesfully logged out!</h4>
                <h3>Redirecting...</h3>
                {redirect ? <Redirect to="/login" /> : ""}
            </div>
        </div>
    )
}

export default LogoutPage;