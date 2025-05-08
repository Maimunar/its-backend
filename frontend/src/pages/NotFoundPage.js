import React, { useState } from 'react'
import { Redirect } from 'react-router-dom';

const NotFoundPage = () => {
    const [redirectBool, setRedirectBool] = useState(false)
    setTimeout(() => setRedirectBool(true), 3000)

    return (
        <div className="wishlist-container">
            <div className="wishlist-subcontainer">
                <h2>The page you are trying to reach does not exist!</h2>
                <p>Redirecting you back to the home page...</p>
                {redirectBool ? <Redirect to="/" /> : ""}
            </div>
        </div>
    )
}

export default NotFoundPage;