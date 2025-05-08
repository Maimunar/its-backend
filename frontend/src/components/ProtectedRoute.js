import React from 'react'
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({
    component: Component,
    user,
    ...rest }) => {

    return (
        <Route {...rest}
            render={() => {
                if (user) return <Component user={user} {...rest} />
                else return <Redirect to="/"/>
            }
            }
        />
    )
}

export default ProtectedRoute;